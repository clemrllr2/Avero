import type { PostData } from "@/lib/types";
import {
  PlatformApiError,
  TokenExpiredError,
  type FetchedAccount,
  type PlatformProvider,
  type TokenSet,
} from "@/lib/sync/types";

// TikTok Login Kit v2 + Display API.
// Identifiants de l'app TikTok : TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET dans .env.

const AUTHORIZE_URL = "https://www.tiktok.com/v2/auth/authorize/";
const API = "https://open.tiktokapis.com";
const SCOPES = ["user.info.basic", "user.info.profile", "user.info.stats", "video.list"];
/** Le jeton d'accès dure 24 h : on le renouvelle s'il expire dans moins d'1 h. */
const REFRESH_BEFORE_MS = 60 * 60 * 1000;
const MAX_VIDEO_PAGES = 10;
const VIDEO_FIELDS = "id,title,cover_image_url,share_url,create_time,view_count,like_count,comment_count,share_count";

function credentials() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) throw new PlatformApiError("TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET manquants.");
  return { clientKey, clientSecret };
}

async function send(url: string, init: RequestInit): Promise<unknown> {
  try {
    const response = await fetch(url, { ...init, cache: "no-store" });
    return await response.json();
  } catch (error) {
    throw new PlatformApiError(`TikTok injoignable : ${String(error)}`);
  }
}

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}

/** Appel au point d'accès des jetons (code d'autorisation ou renouvellement). */
async function requestToken(params: Record<string, string>): Promise<TokenSet> {
  const { clientKey, clientSecret } = credentials();
  const body = (await send(`${API}/v2/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: clientKey, client_secret: clientSecret, ...params }),
  })) as TokenResponse;

  if (body.error || !body.access_token || !body.expires_in) {
    const message = body.error_description ?? body.error ?? "TikTok n'a pas renvoyé de jeton.";
    // Code ou jeton de rafraîchissement refusé : il faut reconnecter le compte.
    if (body.error === "invalid_grant") throw new TokenExpiredError(message);
    throw new PlatformApiError(message);
  }
  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token ?? null,
    expiresAt: new Date(Date.now() + body.expires_in * 1000),
  };
}

interface ApiResponse<T> {
  data?: T;
  error?: { code: string; message?: string };
}

/** Appel à l'API (profil, vidéos) ; error.code ≠ "ok" est traduit en erreur. */
async function api<T>(path: string, accessToken: string, init: RequestInit = {}): Promise<T> {
  const body = (await send(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, ...(init.body ? { "Content-Type": "application/json" } : {}) },
  })) as ApiResponse<T>;
  const code = body.error?.code;
  if (code && code !== "ok") {
    const message = body.error?.message || code;
    if (code === "access_token_invalid") throw new TokenExpiredError(message);
    throw new PlatformApiError(message);
  }
  if (!body.data) throw new PlatformApiError("Réponse TikTok vide.");
  return body.data;
}

interface Video {
  id: string;
  title?: string;
  cover_image_url?: string;
  share_url?: string;
  create_time: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
}

async function fetchVideos(accessToken: string, since: Date): Promise<PostData[]> {
  const videos: Video[] = [];
  let cursor: number | undefined;
  // Les vidéos arrivent de la plus récente à la plus ancienne : on s'arrête à la première trop ancienne.
  for (let page = 0; page < MAX_VIDEO_PAGES; page++) {
    const data = await api<{ videos: Video[]; cursor: number; has_more: boolean }>(
      `/v2/video/list/?fields=${VIDEO_FIELDS}`,
      accessToken,
      { method: "POST", body: JSON.stringify({ max_count: 20, ...(cursor !== undefined && { cursor }) }) },
    );
    const recent = data.videos.filter((v) => v.create_time * 1000 >= since.getTime());
    videos.push(...recent);
    if (!data.has_more || recent.length < data.videos.length) break;
    cursor = data.cursor;
  }

  return videos.map((v) => ({
    externalId: v.id,
    platform: "TIKTOK" as const,
    publishedAt: new Date(v.create_time * 1000),
    caption: v.title || null,
    thumbnailUrl: v.cover_image_url ?? null,
    permalink: v.share_url ?? null,
    views: v.view_count ?? 0,
    likes: v.like_count ?? 0,
    comments: v.comment_count ?? 0,
    shares: v.share_count ?? 0,
    // TikTok ne fournit ni les enregistrements ni la portée.
    saves: null,
    reach: null,
  }));
}

export const tiktokProvider: PlatformProvider = {
  platform: "TIKTOK",

  authorizeUrl(state, redirectUri) {
    const url = new URL(AUTHORIZE_URL);
    url.searchParams.set("client_key", credentials().clientKey);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", SCOPES.join(","));
    url.searchParams.set("state", state);
    return url.toString();
  },

  exchangeCode(code, redirectUri) {
    return requestToken({ grant_type: "authorization_code", code, redirect_uri: redirectUri });
  },

  async refreshIfNeeded(tokens, now) {
    if (tokens.expiresAt.getTime() - now.getTime() > REFRESH_BEFORE_MS) return null;
    if (!tokens.refreshToken) throw new TokenExpiredError("Pas de jeton de rafraîchissement TikTok.");
    // TikTok peut renvoyer un nouveau jeton de rafraîchissement : c'est celui-ci qu'il faut garder.
    return requestToken({ grant_type: "refresh_token", refresh_token: tokens.refreshToken });
  },

  async fetchAccount(accessToken, since): Promise<FetchedAccount> {
    const { user } = await api<{
      user: { open_id: string; username?: string; display_name?: string; avatar_url?: string; follower_count?: number };
    }>("/v2/user/info/?fields=open_id,username,display_name,avatar_url,follower_count", accessToken);
    const posts = await fetchVideos(accessToken, since);

    return {
      externalUserId: user.open_id,
      username: user.username || user.display_name || user.open_id,
      avatarUrl: user.avatar_url ?? null,
      followers: user.follower_count ?? 0,
      posts,
      audience: null, // TikTok ne fournit pas l'audience
    };
  },
};
