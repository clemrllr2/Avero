import { randomBytes, timingSafeEqual } from "node:crypto";

// Protection du parcours OAuth : un « state » aléatoire part avec la demande d'autorisation et doit
// revenir identique. Il est gardé dans un cookie httpOnly avec le mode choisi au départ (simulé ou réel).

export function createState(): string {
  return randomBytes(32).toString("base64url");
}

/** Comparaison à temps constant ; faux si l'un des deux manque. */
export function verifyState(fromQuery: string | null, fromCookie: string | undefined): boolean {
  if (!fromQuery || !fromCookie) return false;
  const a = Buffer.from(fromQuery);
  const b = Buffer.from(fromCookie);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function stateCookieValue(state: string, simulated: boolean): string {
  return `${state}.${simulated ? "sim" : "real"}`;
}

export function parseStateCookie(value: string | undefined): { state: string; simulated: boolean } | null {
  const match = value?.match(/^([A-Za-z0-9_-]+)\.(sim|real)$/);
  return match ? { state: match[1], simulated: match[2] === "sim" } : null;
}
