import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { instagramProvider } from "@/lib/sync/instagram";
import { NotProfessionalAccountError, TokenExpiredError } from "@/lib/sync/types";
import shortToken from "@/lib/sync/fixtures/instagram/short-token.json";
import longToken from "@/lib/sync/fixtures/instagram/long-token.json";
import refreshedToken from "@/lib/sync/fixtures/instagram/refreshed-token.json";
import me from "@/lib/sync/fixtures/instagram/me.json";
import mePersonal from "@/lib/sync/fixtures/instagram/me-personal.json";
import mediaPage1 from "@/lib/sync/fixtures/instagram/media-page1.json";
import mediaPage2 from "@/lib/sync/fixtures/instagram/media-page2.json";
import insightsM1 from "@/lib/sync/fixtures/instagram/insights-m1.json";
import ages from "@/lib/sync/fixtures/instagram/demographics-age.json";
import genders from "@/lib/sync/fixtures/instagram/demographics-gender.json";
import countries from "@/lib/sync/fixtures/instagram/demographics-country.json";
import error190 from "@/lib/sync/fixtures/instagram/error-190.json";
import errorAudience from "@/lib/sync/fixtures/instagram/error-audience.json";

const NOW = new Date("2026-10-28T12:00:00Z");
const SINCE = new Date("2026-09-28T12:00:00Z");

type Route = (url: URL, init?: RequestInit) => unknown | undefined;
const requests: { url: URL; init?: RequestInit }[] = [];

/** Remplace fetch : chaque appel est noté, puis la première route qui répond fournit le JSON. */
function stubFetch(...routes: Route[]) {
  vi.stubGlobal("fetch", async (input: string | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    requests.push({ url, init });
    for (const route of routes) {
      const body = route(url, init);
      if (body !== undefined) {
        const status = typeof body === "object" && body !== null && "error" in body ? 400 : 200;
        return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
      }
    }
    throw new Error(`Appel inattendu : ${url}`);
  });
}

const profile = (body: unknown = me): Route => (url) => (url.pathname === "/me" ? body : undefined);
const media: Route = (url) => {
  if (url.pathname !== "/me/media") return undefined;
  return url.searchParams.get("page") === "2" ? mediaPage2 : url.searchParams.get("page") === "3" ? { data: [] } : mediaPage1;
};
const insights: Route = (url) => {
  if (!url.pathname.endsWith("/insights") || url.pathname.startsWith("/1784")) return undefined;
  return url.pathname === "/m1/insights" ? insightsM1 : errorAudience;
};
const audience = (ok = true): Route => (url) => {
  if (url.searchParams.get("metric") !== "follower_demographics") return undefined;
  if (!ok) return errorAudience;
  return { age: ages, gender: genders, country: countries }[url.searchParams.get("breakdown") ?? ""];
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  vi.stubEnv("INSTAGRAM_CLIENT_ID", "id-test");
  vi.stubEnv("INSTAGRAM_CLIENT_SECRET", "secret-test");
  requests.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("instagramProvider", () => {
  test("authorizeUrl contient client_id, redirect_uri, state et les 2 scopes", () => {
    const url = new URL(instagramProvider.authorizeUrl("etat123", "https://avero.test/api/connect/instagram/callback"));
    expect(url.origin + url.pathname).toBe("https://www.instagram.com/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("id-test");
    expect(url.searchParams.get("redirect_uri")).toBe("https://avero.test/api/connect/instagram/callback");
    expect(url.searchParams.get("state")).toBe("etat123");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")?.split(",")).toEqual([
      "instagram_business_basic",
      "instagram_business_manage_insights",
    ]);
  });

  test("exchangeCode enchaîne jeton court puis long ; expiresAt = now + expires_in", async () => {
    stubFetch(
      (url) => (url.host === "api.instagram.com" ? shortToken : undefined),
      (url) => (url.pathname === "/access_token" ? longToken : undefined),
    );
    const tokens = await instagramProvider.exchangeCode("CODE#_", "https://avero.test/cb");

    expect(tokens).toEqual({
      accessToken: "IG_LONG",
      refreshToken: null,
      expiresAt: new Date(NOW.getTime() + 5184000 * 1000),
    });
    const form = new URLSearchParams(String(requests[0].init?.body));
    expect(requests[0].init?.method).toBe("POST");
    expect(form.get("code")).toBe("CODE"); // « #_ » final retiré
    expect(form.get("grant_type")).toBe("authorization_code");
    expect(form.get("client_secret")).toBe("secret-test");
    expect(requests[1].url.searchParams.get("grant_type")).toBe("ig_exchange_token");
    expect(requests[1].url.searchParams.get("access_token")).toBe("IG_SHORT");
  });

  test("fetchAccount convertit profil + publications : views/reach/saves/shares depuis les insights", async () => {
    stubFetch(profile(), media, insights, audience());
    const account = await instagramProvider.fetchAccount("IG_LONG", SINCE);

    expect(account).toMatchObject({
      externalUserId: "17841400000000001",
      username: "lea.martin",
      avatarUrl: "https://cdn.exemple.test/lea.jpg",
      followers: 48200,
    });
    expect(account.posts[0]).toEqual({
      externalId: "m1",
      platform: "INSTAGRAM",
      publishedAt: new Date("2026-10-25T08:00:00Z"),
      caption: "Ma routine du matin",
      thumbnailUrl: "https://cdn.exemple.test/m1.jpg",
      permalink: "https://www.instagram.com/reel/m1/",
      views: 15000,
      likes: 900,
      comments: 40,
      shares: 95,
      saves: 210,
      reach: 11000,
    });
  });

  test("statistiques indisponibles pour une publication → 0 vue, sans faire échouer la synchro", async () => {
    stubFetch(profile(), media, insights, audience());
    const { posts } = await instagramProvider.fetchAccount("IG_LONG", SINCE);
    expect(posts[1]).toMatchObject({ externalId: "m2", caption: null, views: 0, shares: 0, saves: null, reach: null });
    expect(posts[1].thumbnailUrl).toBe("https://cdn.exemple.test/m2.jpg");
  });

  test("fetchAccount ignore les publications plus anciennes que since et suit la pagination", async () => {
    stubFetch(profile(), media, insights, audience());
    const { posts } = await instagramProvider.fetchAccount("IG_LONG", SINCE);
    expect(posts.map((p) => p.externalId)).toEqual(["m1", "m2", "m3"]);
    // m4 est plus ancienne que since : la page 3 n'est jamais demandée
    expect(requests.some((r) => r.url.searchParams.get("page") === "3")).toBe(false);
  });

  test("audience lue par âge, genre et pays", async () => {
    stubFetch(profile(), media, insights, audience());
    const { audience: result } = await instagramProvider.fetchAccount("IG_LONG", SINCE);
    expect(result).toEqual({
      ages: [
        { label: "18-24", count: 16000 },
        { label: "25-34", count: 15000 },
      ],
      genders: [
        { label: "F", count: 30000 },
        { label: "M", count: 17000 },
        { label: "U", count: 1200 },
      ],
      countries: [
        { label: "FR", count: 35000 },
        { label: "BE", count: 5000 },
      ],
    });
  });

  test("audience en erreur → audience null, le reste est renvoyé", async () => {
    stubFetch(profile(), media, insights, audience(false));
    const account = await instagramProvider.fetchAccount("IG_LONG", SINCE);
    expect(account.audience).toBeNull();
    expect(account.posts).toHaveLength(3);
  });

  test("moins de 100 abonnés → audience null sans la demander", async () => {
    stubFetch(profile({ ...me, followers_count: 85 }), media, insights);
    const account = await instagramProvider.fetchAccount("IG_LONG", SINCE);
    expect(account.audience).toBeNull();
    expect(requests.some((r) => r.url.searchParams.get("metric") === "follower_demographics")).toBe(false);
  });

  test("account_type PERSONAL → NotProfessionalAccountError", async () => {
    stubFetch(profile(mePersonal));
    await expect(instagramProvider.fetchAccount("IG_LONG", SINCE)).rejects.toBeInstanceOf(NotProfessionalAccountError);
  });

  test("erreur OAuth code 190 → TokenExpiredError", async () => {
    stubFetch(profile(error190));
    await expect(instagramProvider.fetchAccount("IG_LONG", SINCE)).rejects.toBeInstanceOf(TokenExpiredError);
  });

  test("refreshIfNeeded : null si expiration > 7 j ; nouveau TokenSet sinon", async () => {
    stubFetch((url) => (url.pathname === "/refresh_access_token" ? refreshedToken : undefined));
    const later = { accessToken: "IG_LONG", refreshToken: null, expiresAt: new Date(NOW.getTime() + 8 * 86_400_000) };
    expect(await instagramProvider.refreshIfNeeded(later, NOW)).toBeNull();
    expect(requests).toHaveLength(0);

    const soon = { ...later, expiresAt: new Date(NOW.getTime() + 3 * 86_400_000) };
    expect(await instagramProvider.refreshIfNeeded(soon, NOW)).toEqual({
      accessToken: "IG_REFRESHED",
      refreshToken: null,
      expiresAt: new Date(NOW.getTime() + 5184000 * 1000),
    });
    expect(requests[0].url.searchParams.get("grant_type")).toBe("ig_refresh_token");
  });
});
