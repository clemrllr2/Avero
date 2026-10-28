import type { CreatorKpis, Plan } from "@/lib/types";

export type Feature =
  | "followers"
  | "avgViewsPerPost"
  | "engagementRate"
  | "posts30d"
  | "followerGrowth30d"
  | "filters"
  | "creatorDetail"
  | "charts"
  | "audience"
  | "compare"
  | "exportCsv";

export type SortKey = keyof CreatorKpis;

const BASIC_FEATURES: readonly Feature[] = [
  "followers",
  "avgViewsPerPost",
  "engagementRate",
  "posts30d",
  "followerGrowth30d",
  "filters",
];

/** Source unique de vérité : ce que chaque plan permet de voir (spec, section 4). */
export const PLAN_FEATURES: Record<Plan, readonly Feature[]> = {
  FREE: [],
  BASIC: BASIC_FEATURES,
  PREMIUM: [...BASIC_FEATURES, "creatorDetail", "charts", "audience", "compare", "exportCsv"],
};

export const PLAN_LABELS: Record<Plan, { name: string; description: string }> = {
  FREE: {
    name: "Free",
    description: "Le nombre de vues de chaque créateur, avec tri.",
  },
  BASIC: {
    name: "Basic",
    description: "Abonnés, vues moyennes, engagement, publications, évolution et filtres.",
  },
  PREMIUM: {
    name: "Premium",
    description: "Détail par publication, graphiques, audience, comparaison et export CSV.",
  },
};

/** Lignes du tableau comparatif des plans ; feature null = inclus dans tous les plans. */
export const PLAN_COMPARISON: { label: string; feature: Feature | null }[] = [
  { label: "Vues sur 30 jours, avec tri", feature: null },
  { label: "Abonnés", feature: "followers" },
  { label: "Vues moyennes par publication", feature: "avgViewsPerPost" },
  { label: "Taux d'engagement", feature: "engagementRate" },
  { label: "Publications sur 30 jours", feature: "posts30d" },
  { label: "Évolution des abonnés", feature: "followerGrowth30d" },
  { label: "Filtres par réseau et nombre d'abonnés", feature: "filters" },
  { label: "Détail publication par publication", feature: "creatorDetail" },
  { label: "Graphiques d'évolution", feature: "charts" },
  { label: "Audience : âge, sexe, pays (Instagram)", feature: "audience" },
  { label: "Comparaison de 2 à 4 créateurs", feature: "compare" },
  { label: "Export CSV", feature: "exportCsv" },
];

export const PLANS: readonly Plan[] = ["FREE", "BASIC", "PREMIUM"];

export function isPlan(value: unknown): value is Plan {
  return typeof value === "string" && (PLANS as readonly string[]).includes(value);
}

export function canAccess(plan: Plan, feature: Feature): boolean {
  return PLAN_FEATURES[plan].includes(feature);
}

export const SORT_KEYS: readonly SortKey[] = [
  "views30d",
  "followers",
  "avgViewsPerPost",
  "engagementRate",
  "posts30d",
  "followerGrowth30d",
];

export function allowedSortKeys(plan: Plan): SortKey[] {
  // views30d est visible dans tous les plans ; les autres clés sont aussi des Feature.
  return SORT_KEYS.filter((key) => key === "views30d" || canAccess(plan, key as Feature));
}
