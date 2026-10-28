/** Cookie qui garde le state OAuth pendant l'autorisation (10 minutes), limité aux routes /api/connect. */
export function stateCookieName(slug: string): string {
  return `oauth_state_${slug}`;
}

export const STATE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/api/connect",
  maxAge: 10 * 60,
};

/** Adresse de retour déclarée auprès du réseau : APP_URL si défini, sinon l'adresse de la requête. */
export function callbackUrl(slug: string, requestUrl: string): string {
  const base = process.env.APP_URL || new URL(requestUrl).origin;
  return `${base.replace(/\/$/, "")}/api/connect/${slug}/callback`;
}
