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

const PLANS: readonly Plan[] = ["FREE", "BASIC", "PREMIUM"];

export function isPlan(value: unknown): value is Plan {
  return typeof value === "string" && (PLANS as readonly string[]).includes(value);
}

export function canAccess(plan: Plan, feature: Feature): boolean {
  return PLAN_FEATURES[plan].includes(feature);
}

const SORT_KEYS: readonly SortKey[] = [
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
