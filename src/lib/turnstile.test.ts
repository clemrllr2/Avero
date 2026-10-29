import { describe, expect, test, vi } from "vitest";
import { turnstileConfig, verifyTurnstile } from "@/lib/turnstile";

const SECRET = "secret-test";

function fakeFetch(body: unknown, ok = true) {
  return vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status: ok ? 200 : 500 }));
}

describe("verifyTurnstile", () => {
  test("jeton accepté par Cloudflare → true ; envoie secret, jeton et IP", async () => {
    const fetchImpl = fakeFetch({ success: true });
    expect(await verifyTurnstile("jeton", { secret: SECRET, remoteIp: "203.0.113.7", fetchImpl })).toBe(true);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(init?.method).toBe("POST");
    const body = new URLSearchParams(String(init?.body));
    expect(body.get("secret")).toBe(SECRET);
    expect(body.get("response")).toBe("jeton");
    expect(body.get("remoteip")).toBe("203.0.113.7");
  });

  test("jeton refusé (robot, jeton expiré ou déjà utilisé) → false", async () => {
    expect(await verifyTurnstile("jeton", { secret: SECRET, fetchImpl: fakeFetch({ success: false, "error-codes": ["timeout-or-duplicate"] }) })).toBe(false);
  });

  test("jeton absent, vide ou trop long → false sans appeler Cloudflare", async () => {
    const fetchImpl = fakeFetch({ success: true });
    for (const token of [undefined, "", "   ", 42, "x".repeat(2049)]) {
      expect(await verifyTurnstile(token, { secret: SECRET, fetchImpl })).toBe(false);
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("Cloudflare injoignable ou en erreur → false (on refuse plutôt que laisser passer)", async () => {
    const failing = vi.fn(async () => {
      throw new Error("réseau coupé");
    });
    expect(await verifyTurnstile("jeton", { secret: SECRET, fetchImpl: failing })).toBe(false);
    expect(await verifyTurnstile("jeton", { secret: SECRET, fetchImpl: fakeFetch({ success: true }, false) })).toBe(false);
  });
});

describe("turnstileConfig", () => {
  test("les deux clés → activé ; aucune → désactivé ; une seule → mal configuré", () => {
    expect(turnstileConfig({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site", TURNSTILE_SECRET_KEY: "secret" })).toEqual({
      status: "enabled",
      siteKey: "site",
      secret: "secret",
    });
    expect(turnstileConfig({})).toEqual({ status: "disabled" });
    expect(turnstileConfig({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site" })).toEqual({ status: "misconfigured" });
    expect(turnstileConfig({ TURNSTILE_SECRET_KEY: "secret" })).toEqual({ status: "misconfigured" });
  });
});
