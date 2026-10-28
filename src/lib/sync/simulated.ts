import { buildNetwork } from "@/lib/data/mock/generate";
import type { Platform } from "@/lib/types";
import {
  NotProfessionalAccountError,
  PlatformApiError,
  TokenExpiredError,
  type FetchedAccount,
  type PlatformProvider,
  type TokenSet,
} from "@/lib/sync/types";

// Connecteur simulé (OAUTH2_MODE=simulated) : même parcours que les vrais réseaux, sans compte développeur.
// L'écran d'autorisation est une page d'AVERO ; les chiffres sont générés à partir du nom d'utilisateur.

export type SimulatedSize = "small" | "medium" | "large";
export type SimulatedScenario = "ok" | "personal_account" | "already_linked" | "revoked_later" | "unavailable_later";

/** Ce que le créateur a choisi sur l'écran simulé. */
export interface SimulatedGrant {
  platform: Platform;
  username: string;
  size: SimulatedSize;
  scenario: SimulatedScenario;
  /** Date de délivrance (ms) : sert aux scénarios « à la prochaine actualisation » */
  issuedAt: number;
}

export const SIMULATED_SIZES: SimulatedSize[] = ["small", "medium", "large"];
export const SIMULATED_SCENARIOS: SimulatedScenario[] = [
  "ok",
  "personal_account",
  "already_linked",
  "revoked_later",
  "unavailable_later",
];
/** Nom d'utilisateur accepté : lettres minuscules, chiffres, points et tirets bas (comme sur Instagram/TikTok). */
export const SIMULATED_USERNAME = /^[a-z0-9._]{1,30}$/;

const DAY_MS = 24 * 60 * 60 * 1000;
const TOKEN_LIFETIME_MS = 60 * DAY_MS;
const REFRESH_BEFORE_MS = 7 * DAY_MS;
/** Délai après la connexion à partir duquel les scénarios « plus tard » se déclenchent. */
const LATER_MS = 10_000;
/** Identifiant d'un créateur d'exemple (prisma/seed.ts) : relier ce compte déclenche « déjà relié ». */
const ALREADY_LINKED_EXTERNAL_ID = "seed-1";
const TOKEN_PREFIX = "sim.";

const SLUGS: Record<Platform, string> = { INSTAGRAM: "instagram", TIKTOK: "tiktok" };
const PLATFORMS = Object.keys(SLUGS) as Platform[];

function isGrant(value: unknown): value is SimulatedGrant {
  if (typeof value !== "object" || value === null) return false;
  const g = value as Record<string, unknown>;
  return (
    PLATFORMS.includes(g.platform as Platform) &&
    typeof g.username === "string" &&
    SIMULATED_USERNAME.test(g.username) &&
    SIMULATED_SIZES.includes(g.size as SimulatedSize) &&
    SIMULATED_SCENARIOS.includes(g.scenario as SimulatedScenario) &&
    typeof g.issuedAt === "number" &&
    Number.isFinite(g.issuedAt)
  );
}

function encode(grant: SimulatedGrant): string {
  const { platform, username, size, scenario, issuedAt } = grant;
  return Buffer.from(JSON.stringify({ platform, username, size, scenario, issuedAt })).toString("base64url");
}

function decode(value: string): SimulatedGrant | null {
  try {
    const parsed: unknown = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    return isGrant(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export const encodeSimulatedCode = encode;
/** null si le code est illisible ou contient une valeur inconnue. */
export const decodeSimulatedCode = decode;

/** Empreinte stable d'un texte (FNV-1a 32 bits) : mêmes chiffres pour un même nom. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Nombre d'abonnés : petit < 20 k, moyen 20 k–200 k, gros > 200 k. */
function followersFor(size: SimulatedSize, ratio: number): number {
  const [min, span] = { small: [1_500, 16_000], medium: [25_000, 150_000], large: [250_000, 1_250_000] }[size];
  return Math.round(min + ratio * span);
}

function tokensFor(grant: SimulatedGrant, now: number): TokenSet {
  return {
    accessToken: TOKEN_PREFIX + encode(grant),
    // TikTok fournit un jeton de rafraîchissement, Instagram non (comme les vraies API).
    refreshToken: grant.platform === "TIKTOK" ? TOKEN_PREFIX + encode(grant) : null,
    expiresAt: new Date(now + TOKEN_LIFETIME_MS),
  };
}

function grantFromToken(token: string): SimulatedGrant {
  const grant = token.startsWith(TOKEN_PREFIX) ? decode(token.slice(TOKEN_PREFIX.length)) : null;
  if (!grant) throw new TokenExpiredError("Jeton simulé illisible.");
  return grant;
}

export function simulatedProvider(platform: Platform): PlatformProvider {
  return {
    platform,

    authorizeUrl(state) {
      return `/oauth/simulation/${SLUGS[platform]}?${new URLSearchParams({ state })}`;
    },

    async exchangeCode(code) {
      const grant = decode(code);
      if (!grant || grant.platform !== platform) throw new PlatformApiError("Code d'autorisation simulé invalide.");
      const now = Date.now();
      return tokensFor({ ...grant, issuedAt: now }, now);
    },

    async refreshIfNeeded(tokens, now) {
      if (tokens.expiresAt.getTime() - now.getTime() > REFRESH_BEFORE_MS) return null;
      return tokensFor(grantFromToken(tokens.accessToken), now.getTime());
    },

    async fetchAccount(accessToken, since): Promise<FetchedAccount> {
      const grant = grantFromToken(accessToken);
      const now = new Date();
      const later = now.getTime() - grant.issuedAt > LATER_MS;

      if (grant.scenario === "personal_account" && platform === "INSTAGRAM") {
        throw new NotProfessionalAccountError("Compte Instagram personnel (simulation).");
      }
      if (grant.scenario === "revoked_later" && later) throw new TokenExpiredError("Accès révoqué (simulation).");
      if (grant.scenario === "unavailable_later" && later) throw new PlatformApiError("Réseau indisponible (simulation).");

      const seed = hash(`${platform}:${grant.username}`);
      const followers = followersFor(grant.size, (seed % 10_000) / 10_000);
      const growth = -0.02 + ((Math.floor(seed / 10_000) % 1_000) / 1_000) * 0.3;
      const network = buildNetwork(`sim-${grant.username}`, grant.username, { platform, followers, growth }, seed, now);

      return {
        externalUserId: grant.scenario === "already_linked" ? ALREADY_LINKED_EXTERNAL_ID : `sim-${grant.username}`,
        username: grant.username,
        avatarUrl: null,
        followers,
        posts: network.posts.filter((post) => post.publishedAt >= since),
        audience: network.audience,
        followerHistory: network.snapshots,
      };
    },
  };
}

export type ConsentResult = { ok: true; grant: SimulatedGrant } | { ok: false; error: string };

/** Lit le formulaire de l'écran d'autorisation simulé (nom nettoyé : « @Lea.Martin » → « lea.martin »). */
export function parseConsentForm(input: Record<string, unknown>, platform: Platform, now: Date): ConsentResult {
  const username = typeof input.username === "string" ? input.username.trim().replace(/^@/, "").toLowerCase() : "";
  if (!SIMULATED_USERNAME.test(username)) {
    return {
      ok: false,
      error: "Nom d'utilisateur invalide : lettres, chiffres, points et tirets bas uniquement (30 caractères au plus).",
    };
  }
  const size = input.size as SimulatedSize;
  const scenario = input.scenario as SimulatedScenario;
  const scenarioAllowed = SIMULATED_SCENARIOS.includes(scenario) && !(scenario === "personal_account" && platform !== "INSTAGRAM");
  if (!SIMULATED_SIZES.includes(size) || !scenarioAllowed) return { ok: false, error: "Choix invalide, réessaie." };
  return { ok: true, grant: { platform, username, size, scenario, issuedAt: now.getTime() } };
}
