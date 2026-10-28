import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { tiktokProvider } from "@/lib/sync/tiktok";
import { PlatformApiError, TokenExpiredError } from "@/lib/sync/types";
import token from "@/lib/sync/fixtures/tiktok/token.json";
import tokenRefreshed from "@/lib/sync/fixtures/tiktok/token-refreshed.json";
import tokenError from "@/lib/sync/fixtures/tiktok/token-error.json";
import user from "@/lib/sync/fixtures/tiktok/user.json";
import videosPage1 from "@/lib/sync/fixtures/tiktok/videos-page1.json";
import videosPage2 from "@/lib/sync/fixtures/tiktok/videos-page2.json";
import errorTokenInvalid from "@/lib/sync/fixtures/tiktok/error-token-invalid.json";

const NOW = new Date("2026-10-28T12:00:00Z");
const SINCE = new Date("2026-09-28T12:00:00Z");
const HOUR = 60 * 60 * 1000;

const requests: { url: URL; init?: RequestInit }[] = [];

function stubFetch(route: (url: URL, init?: RequestInit) => unknown) {
  vi.stubGlobal("fetch", async (input: string | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    requests.push({ url, init });
    const body = route(url, init);
    if (body === undefined) throw new Error(`Appel inattendu : ${url}`);
    return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
  });
}

/** Profil + vidéos : page 1, puis page 2 quand le curseur de la page 1 est envoyé. */
const account = (userBody: unknown = user) => (url: URL, init?: RequestInit) => {
  if (url.pathname === "/v2/user/info/") return userBody;
  if (url.pathname === "/v2/video/list/") {
    const { cursor } = JSON.parse(String(init?.body ?? "{}"));
    return cursor === 1792483200000 ? videosPage2 : videosPage1;
  }
  return undefined;
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  vi.stubEnv("TIKTOK_CLIENT_KEY", "cle-test");
  vi.stubEnv("TIKTOK_CLIENT_SECRET", "secret-test");
  requests.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("tiktokProvider", () => {
  test("authorizeUrl contient client_key, redirect_uri, state et les 4 scopes", () => {
    const url = new URL(tiktokProvider.authorizeUrl("etat123", "https://avero.test/api/connect/tiktok/callback"));
    expect(url.origin + url.pathname).toBe("https://www.tiktok.com/v2/auth/authorize/");
    expect(url.searchParams.get("client_key")).toBe("cle-test");
    expect(url.searchParams.get("redirect_uri")).toBe("https://avero.test/api/connect/tiktok/callback");
    expect(url.searchParams.get("state")).toBe("etat123");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")?.split(",")).toEqual([
      "user.info.basic",
      "user.info.profile",
      "user.info.stats",
      "video.list",
    ]);
  });

  test("exchangeCode garde le jeton de rafraîchissement ; expiresAt = now + 24 h", async () => {
    stubFetch((url) => (url.pathname === "/v2/oauth/token/" ? token : undefined));
    const tokens = await tiktokProvider.exchangeCode("CODE", "https://avero.test/cb");

    expect(tokens).toEqual({ accessToken: "TT_ACCESS", refreshToken: "TT_REFRESH", expiresAt: new Date(NOW.getTime() + 24 * HOUR) });
    const form = new URLSearchParams(String(requests[0].init?.body));
    expect(requests[0].init?.method).toBe("POST");
    expect(form.get("grant_type")).toBe("authorization_code");
    expect(form.get("client_key")).toBe("cle-test");
    expect(form.get("client_secret")).toBe("secret-test");
    expect(form.get("code")).toBe("CODE");
    expect(form.get("redirect_uri")).toBe("https://avero.test/cb");
  });

  test("fetchAccount convertit profil et vidéos (create_time en secondes → Date)", async () => {
    stubFetch(account());
    const result = await tiktokProvider.fetchAccount("TT_ACCESS", SINCE);

    expect(result).toMatchObject({
      externalUserId: "open-123",
      username: "ines.danse",
      avatarUrl: "https://cdn.exemple.test/ines.jpg",
      followers: 890000,
      audience: null,
    });
    expect(result.posts[0]).toEqual({
      externalId: "v1",
      platform: "TIKTOK",
      publishedAt: new Date("2026-10-25T08:00:00Z"),
      caption: "Chorégraphie du jour",
      thumbnailUrl: "https://cdn.exemple.test/v1.jpg",
      permalink: "https://www.tiktok.com/@ines.danse/video/v1",
      views: 250000,
      likes: 21000,
      comments: 800,
      shares: 1500,
      saves: null,
      reach: null,
    });
    expect(result.posts[1].caption).toBeNull(); // titre vide
    expect(requests[0].init?.headers).toMatchObject({ Authorization: "Bearer TT_ACCESS" });
  });

  test("pagination arrêtée dès qu'une vidéo est plus ancienne que since", async () => {
    stubFetch(account());
    const { posts } = await tiktokProvider.fetchAccount("TT_ACCESS", SINCE);
    expect(posts.map((p) => p.externalId)).toEqual(["v1", "v2", "v3"]);
    expect(requests.filter((r) => r.url.pathname === "/v2/video/list/")).toHaveLength(2);
  });

  test("access_token_invalid → TokenExpiredError", async () => {
    stubFetch(account(errorTokenInvalid));
    await expect(tiktokProvider.fetchAccount("TT_ACCESS", SINCE)).rejects.toBeInstanceOf(TokenExpiredError);
  });

  test("autre code d'erreur → PlatformApiError", async () => {
    stubFetch(account({ data: {}, error: { code: "rate_limit_exceeded", message: "Trop de requêtes", log_id: "L6" } }));
    await expect(tiktokProvider.fetchAccount("TT_ACCESS", SINCE)).rejects.toBeInstanceOf(PlatformApiError);
  });

  test("refreshIfNeeded : null si l'expiration est dans plus d'1 h ; sinon nouveaux jetons", async () => {
    stubFetch((url) => (url.pathname === "/v2/oauth/token/" ? tokenRefreshed : undefined));
    const later = { accessToken: "TT_ACCESS", refreshToken: "TT_REFRESH", expiresAt: new Date(NOW.getTime() + 2 * HOUR) };
    expect(await tiktokProvider.refreshIfNeeded(later, NOW)).toBeNull();
    expect(requests).toHaveLength(0);

    const soon = { ...later, expiresAt: new Date(NOW.getTime() + 30 * 60 * 1000) };
    expect(await tiktokProvider.refreshIfNeeded(soon, NOW)).toEqual({
      accessToken: "TT_ACCESS_2",
      refreshToken: "TT_REFRESH_2",
      expiresAt: new Date(NOW.getTime() + 24 * HOUR),
    });
    const form = new URLSearchParams(String(requests[0].init?.body));
    expect(form.get("grant_type")).toBe("refresh_token");
    expect(form.get("refresh_token")).toBe("TT_REFRESH");
  });

  test("jeton de rafraîchissement refusé → TokenExpiredError", async () => {
    stubFetch(() => tokenError);
    const expired = { accessToken: "TT_ACCESS", refreshToken: "TT_REFRESH", expiresAt: new Date(NOW.getTime() - HOUR) };
    await expect(tiktokProvider.refreshIfNeeded(expired, NOW)).rejects.toBeInstanceOf(TokenExpiredError);
  });
});
