/** Moyennes par publication saisies dans le calculateur public de taux d'engagement. */
export interface EngagementInput {
  followers: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface EngagementRates {
  interactions: number;
  /** (likes + commentaires + partages) ÷ vues : la méthode utilisée par AVERO */
  byViews: number | null;
  /** (likes + commentaires + partages) ÷ abonnés : la méthode « classique » */
  byFollowers: number | null;
}

export function engagementRates({ followers, views, likes, comments, shares }: EngagementInput): EngagementRates {
  const interactions = likes + comments + shares;
  return {
    interactions,
    byViews: views > 0 ? interactions / views : null,
    byFollowers: followers > 0 ? interactions / followers : null,
  };
}

/** Lit un nombre saisi librement : « 12 400 », « 12k », « 1,5 M ». Valeur illisible ou négative → 0. */
export function parseCount(raw: string): number {
  const text = raw.replace(/[\s  ]/g, "").replace(",", ".").toLowerCase();
  const match = text.match(/^(\d+(?:\.\d+)?)([km])?$/);
  if (!match) return 0;
  const multiplier = match[2] === "m" ? 1_000_000 : match[2] === "k" ? 1_000 : 1;
  return Math.round(Number(match[1]) * multiplier);
}
