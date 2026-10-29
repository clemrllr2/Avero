// Cloudflare Turnstile : vérification anti-robot du formulaire de contact.
// Clés dans .env : NEXT_PUBLIC_TURNSTILE_SITE_KEY (publique, affichée dans la page)
// et TURNSTILE_SECRET_KEY (secrète, utilisée seulement par le serveur).

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
/** Longueur maximale d'un jeton Turnstile (documentation Cloudflare). */
const MAX_TOKEN_LENGTH = 2048;

/** Nom du champ caché que le widget ajoute au formulaire. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

export type TurnstileConfig =
  | { status: "enabled"; siteKey: string; secret: string }
  | { status: "disabled" }
  /** Une seule des deux clés : on refuse les envois plutôt que de laisser passer sans vérification. */
  | { status: "misconfigured" };

export function turnstileConfig(env: Record<string, string | undefined>): TurnstileConfig {
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secret = env.TURNSTILE_SECRET_KEY;
  if (siteKey && secret) return { status: "enabled", siteKey, secret };
  if (!siteKey && !secret) return { status: "disabled" };
  return { status: "misconfigured" };
}

/** Demande à Cloudflare si le jeton du widget est valide. Toute erreur (réseau, réponse illisible) → false. */
export async function verifyTurnstile(
  token: unknown,
  { secret, remoteIp, fetchImpl = fetch }: { secret: string; remoteIp?: string; fetchImpl?: typeof fetch },
): Promise<boolean> {
  if (typeof token !== "string" || !token.trim() || token.length > MAX_TOKEN_LENGTH) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  try {
    const response = await fetchImpl(SITEVERIFY_URL, { method: "POST", body, cache: "no-store" });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: unknown };
    return result.success === true;
  } catch {
    return false;
  }
}
