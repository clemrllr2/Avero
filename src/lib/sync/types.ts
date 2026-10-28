import type { AudienceData, FollowerSnapshot, Platform, PostData } from "@/lib/types";

/** Jetons d'accès à un réseau (en clair : chiffrés avant l'enregistrement). */
export interface TokenSet {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date;
}

/** Ce qu'une synchronisation lit sur un réseau, au format commun. */
export interface FetchedAccount {
  externalUserId: string;
  username: string;
  avatarUrl: string | null;
  followers: number;
  /** Publications depuis la date demandée */
  posts: PostData[];
  /** null : réseau sans audience (TikTok) ou compte de moins de 100 abonnés */
  audience: AudienceData | null;
  /** Historique d'abonnés, si le réseau le fournit (sinon seul le relevé du jour est enregistré) */
  followerHistory?: FollowerSnapshot[];
}

/** Un connecteur : Instagram, TikTok ou leur version simulée. */
export interface PlatformProvider {
  platform: Platform;
  /** Adresse de l'écran d'autorisation (absolue, ou relative à l'app pour le mode simulé) */
  authorizeUrl(state: string, redirectUri: string): string;
  exchangeCode(code: string, redirectUri: string): Promise<TokenSet>;
  /** Nouveaux jetons si ceux-ci expirent bientôt ; null s'il n'y a rien à faire */
  refreshIfNeeded(tokens: TokenSet, now: Date): Promise<TokenSet | null>;
  fetchAccount(accessToken: string, since: Date): Promise<FetchedAccount>;
}

/** Jeton expiré ou révoqué : il faut reconnecter le compte. */
export class TokenExpiredError extends Error {}
/** Compte Instagram personnel : seuls les comptes professionnels donnent accès aux statistiques. */
export class NotProfessionalAccountError extends Error {}
/** Réponse inattendue ou réseau indisponible. */
export class PlatformApiError extends Error {}
