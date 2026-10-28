/** Connexion des réseaux : écran simulé (sans compte développeur) ou vraies API Meta/TikTok. */
export type OAuthMode = "simulated" | "real";

/** Lit OAUTH2_MODE : seule la valeur exacte "real" active le mode réel ; tout le reste → simulé. */
export function parseOAuthMode(value: string | undefined): OAuthMode {
  return value === "real" ? "real" : "simulated";
}

export function currentOAuthMode(): OAuthMode {
  return parseOAuthMode(process.env.OAUTH2_MODE);
}
