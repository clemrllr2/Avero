import { describe, expect, test } from "vitest";
import {
  PLAN_COMPARISON,
  PLAN_FEATURES,
  allowedSortKeys,
  canAccess,
  isPlan,
  planCardFeatures,
  type Feature,
} from "@/lib/plans";

const ALL_FEATURES: Feature[] = [
  "followers",
  "avgViewsPerPost",
  "engagementRate",
  "posts30d",
  "followerGrowth30d",
  "filters",
  "creatorDetail",
  "charts",
  "audience",
  "compare",
  "exportCsv",
];

describe("canAccess", () => {
  test("FREE n'a accès à aucune fonctionnalité", () => {
    expect(PLAN_FEATURES.FREE).toHaveLength(0);
    for (const feature of ALL_FEATURES) expect(canAccess("FREE", feature)).toBe(false);
  });

  test("BASIC : 5 KPI enrichis + filtres, pas de détail", () => {
    for (const feature of [
      "followers",
      "avgViewsPerPost",
      "engagementRate",
      "posts30d",
      "followerGrowth30d",
      "filters",
    ] as Feature[]) {
      expect(canAccess("BASIC", feature)).toBe(true);
    }
    for (const feature of ["creatorDetail", "charts", "audience", "compare", "exportCsv"] as Feature[]) {
      expect(canAccess("BASIC", feature)).toBe(false);
    }
  });

  test("PREMIUM a tout ce qu'a BASIC, plus le reste", () => {
    for (const feature of ALL_FEATURES) expect(canAccess("PREMIUM", feature)).toBe(true);
  });
});

describe("allowedSortKeys", () => {
  test("FREE ne peut trier que par vues", () => {
    expect(allowedSortKeys("FREE")).toEqual(["views30d"]);
  });

  test("BASIC et PREMIUM peuvent trier sur les 6 KPI", () => {
    const all = [
      "views30d",
      "followers",
      "avgViewsPerPost",
      "engagementRate",
      "posts30d",
      "followerGrowth30d",
    ];
    expect([...allowedSortKeys("BASIC")].sort()).toEqual([...all].sort());
    expect([...allowedSortKeys("PREMIUM")].sort()).toEqual([...all].sort());
  });
});

describe("isPlan", () => {
  test("accepte uniquement les 3 plans exacts", () => {
    expect(isPlan("FREE")).toBe(true);
    expect(isPlan("BASIC")).toBe(true);
    expect(isPlan("PREMIUM")).toBe(true);
    expect(isPlan("ADMIN")).toBe(false);
    expect(isPlan("basic")).toBe(false);
    expect(isPlan(undefined)).toBe(false);
    expect(isPlan(null)).toBe(false);
  });
});

describe("planCardFeatures", () => {
  test("FREE : uniquement les vues", () => {
    expect(planCardFeatures("FREE")).toEqual(["Vues sur 30 jours, avec tri"]);
  });

  test("BASIC : 7 fonctionnalités, la dernière étant les filtres", () => {
    const features = planCardFeatures("BASIC");
    expect(features).toHaveLength(7);
    expect(features.at(-1)).toBe("Filtres par réseau et nombre d'abonnés");
  });

  test("PREMIUM : toutes les lignes du comparatif, dans l'ordre", () => {
    expect(planCardFeatures("PREMIUM")).toEqual(PLAN_COMPARISON.map((row) => row.label));
  });
});
