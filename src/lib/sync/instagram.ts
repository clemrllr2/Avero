import type { AudienceData, Breakdown, PostData } from "@/lib/types";
import {
  NotProfessionalAccountError,
  PlatformApiError,
  TokenExpiredError,
  type FetchedAccount,
  type PlatformProvider,
  type TokenSet,
} from "@/lib/sync/types";

// API Instagram avec connexion Instagram (comptes professionnels uniquement).
// Identifiants de l'app Meta : INSTAGRAM_CLIENT_ID / INSTAGRAM_CLIENT_SECRET dans .env.

const AUTHORIZE_URL = "https://www.instagram.com/oauth/authorize";
const TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const GRAPH = "https://graph.instagram.com";
const SCOPES = ["instagram_business_basic", "instagram_business_manage_insights"];
const DAY_MS = 24 * 60 * 60 * 1000;
/** Le jeton longue durée (60 jours) est prolongé quand il expire dans moins de 7 jours. */
const REFRESH_BEFORE_MS = 7 * DAY_MS;
const MAX_MEDIA_PAGES = 10;
/** Instagram ne fournit l'audience qu'à partir de 100 abonnés. */
const MIN_FOLLOWERS_FOR_AUDIENCE = 100;
const PROFESSIONAL_TYPES = ["BUSINESS", "MEDIA_CREATOR", "CREATOR"];

interface GraphError {
  error?: { message?: string; code?: number };
}

function credentials() {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new PlatformApiError("INSTAGRAM_CLIENT_ID / INSTAGRAM_CLIENT_SECRET manquants.");
  return { clientId, clientSecret };
}

/** Appelle l'API ; les erreurs Meta sont traduites (code 190 = jeton expiré ou révoqué). */
async function call<T>(url: string | URL, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { ...init, cache: "no-store" });
  } catch (error) {
    throw new PlatformApiError(`Instagram injoignable : ${String(error)}`);
  }
  const body = (await response.json().catch(() => null)) as (T & GraphError) | null;
  if (body?.error) {
    const message = body.error.message ?? "Erreur Instagram";
    if (body.error.code === 190) throw new TokenExpiredError(message);
    throw new PlatformApiError(message);
  }
  if (!response.ok || body === null) throw new PlatformApiError(`Instagram a répondu ${response.status}.`);
  return body;
}

function graphUrl(path: string, params: Record<string, string>): URL {
  const url = new URL(path, GRAPH);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url;
}

interface LongToken {
  access_token: string;
  expires_in: number;
}

function toTokenSet(token: LongToken): TokenSet {
  return { accessToken: token.access_token, refreshToken: null, expiresAt: new Date(Date.now() + token.expires_in * 1000) };
}

interface Media {
  id: string;
  caption?: string;
  permalink?: string;
  thumbnail_url?: string;
  media_url?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface Insights {
  data: { name: string; values?: { value: number }[] }[];
}

/** Statistiques d'une publication ; si Instagram ne les fournit pas, la publication est gardée sans elles. */
async function mediaInsights(id: string, accessToken: string): Promise<Record<string, number>> {
  try {
    const insights = await call<Insights>(graphUrl(`/${id}/insights`, { metric: "views,reach,saved,shares", access_token: accessToken }));
    return Object.fromEntries(insights.data.map((metric) => [metric.name, metric.values?.[0]?.value ?? 0]));
  } catch (error) {
    if (error instanceof TokenExpiredError) throw error;
    return {};
  }
}

async function fetchPosts(accessToken: string, since: Date): Promise<PostData[]> {
  const media: Media[] = [];
  let next: string | URL | undefined = graphUrl("/me/media", {
    fields: "id,caption,media_type,permalink,thumbnail_url,media_url,timestamp,like_count,comments_count",
    limit: "50",
    access_token: accessToken,
  });
  // Les publications arrivent de la plus récente à la plus ancienne : on s'arrête à la première trop ancienne.
  for (let page = 0; next && page < MAX_MEDIA_PAGES; page++) {
    const body: { data: Media[]; paging?: { next?: string } } = await call(next);
    const recent = body.data.filter((m) => new Date(m.timestamp) >= since);
    media.push(...recent);
    next = recent.length === body.data.length ? body.paging?.next : undefined;
  }

  return Promise.all(
    media.map(async (m) => {
      const stats = await mediaInsights(m.id, accessToken);
      return {
        externalId: m.id,
        platform: "INSTAGRAM" as const,
        publishedAt: new Date(m.timestamp),
        caption: m.caption ?? null,
        thumbnailUrl: m.thumbnail_url ?? m.media_url ?? null,
        permalink: m.permalink ?? null,
        views: stats.views ?? 0,
        likes: m.like_count ?? 0,
        comments: m.comments_count ?? 0,
        shares: stats.shares ?? 0,
        saves: stats.saved ?? null,
        reach: stats.reach ?? null,
      };
    }),
  );
}

interface Demographics {
  data: { total_value?: { breakdowns?: { results?: { dimension_values: string[]; value: number }[] }[] } }[];
}

async function demographics(userId: string, accessToken: string, breakdown: string): Promise<Breakdown[]> {
  const body = await call<Demographics>(
    graphUrl(`/${userId}/insights`, {
      metric: "follower_demographics",
      period: "lifetime",
      metric_type: "total_value",
      timeframe: "last_30_days",
      breakdown,
      access_token: accessToken,
    }),
  );
  const results = body.data[0]?.total_value?.breakdowns?.[0]?.results ?? [];
  return results.map((r) => ({ label: r.dimension_values.at(-1) ?? "", count: r.value }));
}

async function fetchAudience(userId: string, accessToken: string): Promise<AudienceData | null> {
  try {
    const [ages, genders, countries] = await Promise.all(
      ["age", "gender", "country"].map((breakdown) => demographics(userId, accessToken, breakdown)),
    );
    return { ages, genders, countries };
  } catch (error) {
    if (error instanceof TokenExpiredError) throw error;
    return null;
  }
}

export const instagramProvider: PlatformProvider = {
  platform: "INSTAGRAM",

  authorizeUrl(state, redirectUri) {
    const url = new URL(AUTHORIZE_URL);
    url.searchParams.set("client_id", credentials().clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", SCOPES.join(","));
    url.searchParams.set("state", state);
    return url.toString();
  },

  async exchangeCode(code, redirectUri) {
    const { clientId, clientSecret } = credentials();
    // Jeton court (1 heure)…
    const short = await call<{ data: { access_token: string }[] }>(TOKEN_URL, {
      method: "POST",
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code.replace(/#_$/, ""), // Instagram ajoute parfois « #_ » à la fin du code
      }),
    });
    const shortToken = short.data[0]?.access_token;
    if (!shortToken) throw new PlatformApiError("Instagram n'a pas renvoyé de jeton.");
    // … échangé contre un jeton longue durée (60 jours).
    const long = await call<LongToken>(
      graphUrl("/access_token", { grant_type: "ig_exchange_token", client_secret: clientSecret, access_token: shortToken }),
    );
    return toTokenSet(long);
  },

  async refreshIfNeeded(tokens, now) {
    if (tokens.expiresAt.getTime() - now.getTime() > REFRESH_BEFORE_MS) return null;
    const refreshed = await call<LongToken>(
      graphUrl("/refresh_access_token", { grant_type: "ig_refresh_token", access_token: tokens.accessToken }),
    );
    return toTokenSet(refreshed);
  },

  async fetchAccount(accessToken, since): Promise<FetchedAccount> {
    const me = await call<{
      user_id: string;
      username: string;
      account_type?: string;
      profile_picture_url?: string;
      followers_count?: number;
    }>(graphUrl("/me", { fields: "user_id,username,account_type,profile_picture_url,followers_count", access_token: accessToken }));

    if (!PROFESSIONAL_TYPES.includes((me.account_type ?? "").toUpperCase())) {
      throw new NotProfessionalAccountError("Compte Instagram personnel.");
    }

    const followers = me.followers_count ?? 0;
    const [posts, audience] = await Promise.all([
      fetchPosts(accessToken, since),
      followers >= MIN_FOLLOWERS_FOR_AUDIENCE ? fetchAudience(me.user_id, accessToken) : Promise.resolve(null),
    ]);

    return {
      externalUserId: me.user_id,
      username: me.username,
      avatarUrl: me.profile_picture_url ?? null,
      followers,
      posts,
      audience,
    };
  },
};
