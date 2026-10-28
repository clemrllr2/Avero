import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  decodeSimulatedCode,
  encodeSimulatedCode,
  parseConsentForm,
  simulatedProvider,
  type SimulatedGrant,
} from "@/lib/sync/simulated";
import { NotProfessionalAccountError, PlatformApiError, TokenExpiredError } from "@/lib/sync/types";

const NOW = new Date("2026-10-28T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const SINCE = new Date(NOW.getTime() - 30 * DAY);

const grant = (overrides: Partial<SimulatedGrant> = {}): SimulatedGrant => ({
  platform: "INSTAGRAM",
  username: "lea.martin",
  size: "medium",
  scenario: "ok",
  issuedAt: NOW.getTime(),
  ...overrides,
});

/** Parcours complet : code → jetons → lecture du compte. */
async function connect(overrides: Partial<SimulatedGrant> = {}) {
  const provider = simulatedProvider(overrides.platform ?? "INSTAGRAM");
  const tokens = await provider.exchangeCode(encodeSimulatedCode(grant(overrides)), "/cb");
  return { provider, tokens, account: () => provider.fetchAccount(tokens.accessToken, SINCE) };
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
});

afterEach(() => vi.useRealTimers());

describe("code d'autorisation simulé", () => {
  test("encodé puis décodé à l'identique", () => {
    expect(decodeSimulatedCode(encodeSimulatedCode(grant()))).toEqual(grant());
  });

  test("code illisible ou altéré → null", () => {
    expect(decodeSimulatedCode("n'importe quoi")).toBeNull();
    const forged = Buffer.from(JSON.stringify({ ...grant(), scenario: "pirate" })).toString("base64url");
    expect(decodeSimulatedCode(forged)).toBeNull();
    const badName = Buffer.from(JSON.stringify({ ...grant(), username: "<script>" })).toString("base64url");
    expect(decodeSimulatedCode(badName)).toBeNull();
  });
});

describe("simulatedProvider", () => {
  test("authorizeUrl → écran simulé d'AVERO, avec le state", () => {
    expect(simulatedProvider("INSTAGRAM").authorizeUrl("etat 1", "/cb")).toBe("/oauth/simulation/instagram?state=etat+1");
    expect(simulatedProvider("TIKTOK").authorizeUrl("abc", "/cb")).toBe("/oauth/simulation/tiktok?state=abc");
  });

  test("code d'un autre réseau ou illisible → refusé", async () => {
    await expect(simulatedProvider("TIKTOK").exchangeCode(encodeSimulatedCode(grant()), "/cb")).rejects.toBeInstanceOf(
      PlatformApiError,
    );
    await expect(simulatedProvider("TIKTOK").exchangeCode("abc", "/cb")).rejects.toBeInstanceOf(PlatformApiError);
  });

  test("même nom → mêmes chiffres ; autre nom → autres chiffres", async () => {
    const a = await (await connect()).account();
    const b = await (await connect()).account();
    const c = await (await connect({ username: "hugo.cuisine" })).account();
    expect(b.followers).toBe(a.followers);
    expect(b.posts.map((p) => p.views)).toEqual(a.posts.map((p) => p.views));
    expect(c.followers).not.toBe(a.followers);
  });

  test("la taille choisie est respectée", async () => {
    for (const username of ["a", "b.c", "lea", "zoe_99"]) {
      expect((await (await connect({ username, size: "small" })).account()).followers).toBeLessThan(20_000);
      const medium = (await (await connect({ username, size: "medium" })).account()).followers;
      expect(medium).toBeGreaterThanOrEqual(20_000);
      expect(medium).toBeLessThanOrEqual(200_000);
      expect((await (await connect({ username, size: "large" })).account()).followers).toBeGreaterThan(200_000);
    }
  });

  test("Instagram : compte, publications des 30 derniers jours, audience et historique sur 60 jours", async () => {
    const account = await (await connect()).account();
    expect(account.externalUserId).toBe("sim-lea.martin");
    expect(account.username).toBe("lea.martin");
    expect(account.posts.length).toBeGreaterThan(0);
    expect(account.posts.every((p) => p.publishedAt >= SINCE && p.platform === "INSTAGRAM")).toBe(true);
    expect(account.posts[0].saves).not.toBeNull();
    expect(account.audience?.ages.length).toBeGreaterThan(0);
    const history = account.followerHistory ?? [];
    expect(history.length).toBeGreaterThan(2);
    expect(NOW.getTime() - history[0].date.getTime()).toBeGreaterThanOrEqual(59 * DAY);
    expect(history.at(-1)?.followers).toBe(account.followers);
  });

  test("TikTok : ni audience, ni enregistrements, ni portée ; jeton de rafraîchissement fourni", async () => {
    const { tokens, account } = await connect({ platform: "TIKTOK" });
    const result = await account();
    expect(tokens.refreshToken).not.toBeNull();
    expect(result.audience).toBeNull();
    expect(result.posts.every((p) => p.platform === "TIKTOK" && p.saves === null && p.reach === null)).toBe(true);
  });

  test("scénario « compte personnel » → NotProfessionalAccountError", async () => {
    const { account } = await connect({ scenario: "personal_account" });
    await expect(account()).rejects.toBeInstanceOf(NotProfessionalAccountError);
  });

  test("scénario « déjà relié » → identifiant du créateur d'exemple seed-1", async () => {
    expect((await (await connect({ scenario: "already_linked" })).account()).externalUserId).toBe("seed-1");
  });

  test("scénarios « plus tard » : la première lecture réussit, puis l'erreur arrive 10 s après la connexion", async () => {
    const revoked = await connect({ scenario: "revoked_later" });
    const unavailable = await connect({ scenario: "unavailable_later" });
    await expect(revoked.account()).resolves.toBeDefined();
    await expect(unavailable.account()).resolves.toBeDefined();

    vi.setSystemTime(NOW.getTime() + 11_000);
    await expect(revoked.account()).rejects.toBeInstanceOf(TokenExpiredError);
    await expect(unavailable.account()).rejects.toBeInstanceOf(PlatformApiError);
  });

  test("jeton illisible → TokenExpiredError", async () => {
    await expect(simulatedProvider("INSTAGRAM").fetchAccount("seed-jeton-factice", SINCE)).rejects.toBeInstanceOf(
      TokenExpiredError,
    );
  });

  test("refreshIfNeeded : null si expiration lointaine ; nouveaux jetons sinon, même compte", async () => {
    const { provider, tokens } = await connect();
    expect(await provider.refreshIfNeeded(tokens, NOW)).toBeNull();
    const soon = { ...tokens, expiresAt: new Date(NOW.getTime() + DAY) };
    const refreshed = await provider.refreshIfNeeded(soon, NOW);
    expect(refreshed?.expiresAt.getTime()).toBeGreaterThan(NOW.getTime() + 30 * DAY);
    expect((await provider.fetchAccount(refreshed!.accessToken, SINCE)).username).toBe("lea.martin");
  });
});

describe("parseConsentForm (écran d'autorisation simulé)", () => {
  test("nom nettoyé (@, espaces, majuscules) et choix lus", () => {
    expect(
      parseConsentForm({ username: "  @Lea.Martin ", size: "large", scenario: "revoked_later" }, "INSTAGRAM", NOW),
    ).toEqual({
      ok: true,
      grant: { platform: "INSTAGRAM", username: "lea.martin", size: "large", scenario: "revoked_later", issuedAt: NOW.getTime() },
    });
  });

  test("nom vide ou avec des caractères interdits → message d'erreur", () => {
    for (const username of ["", "@", "léa martin", "a/b", "x".repeat(31)]) {
      expect(parseConsentForm({ username, size: "small", scenario: "ok" }, "INSTAGRAM", NOW)).toEqual({
        ok: false,
        error: "Nom d'utilisateur invalide : lettres, chiffres, points et tirets bas uniquement (30 caractères au plus).",
      });
    }
  });

  test("taille ou scénario inconnu → erreur ; « compte personnel » refusé pour TikTok", () => {
    expect(parseConsentForm({ username: "lea", size: "xxl", scenario: "ok" }, "INSTAGRAM", NOW).ok).toBe(false);
    expect(parseConsentForm({ username: "lea", size: "small", scenario: "pirate" }, "INSTAGRAM", NOW).ok).toBe(false);
    expect(parseConsentForm({ username: "lea", size: "small", scenario: "personal_account" }, "TIKTOK", NOW).ok).toBe(false);
  });
});
