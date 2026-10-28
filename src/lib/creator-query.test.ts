import { describe, expect, test } from "vitest";
import type { FullCreatorRow } from "@/lib/aggregate";
import { effectiveQuery, parseListQuery, queryCreatorRows, stripForPlan } from "@/lib/creator-query";

const syncedAt = new Date("2026-10-26T10:00:00Z");

function row(
  creatorId: string,
  overrides: Partial<FullCreatorRow> = {},
): FullCreatorRow {
  return {
    creatorId,
    displayName: creatorId.toUpperCase(),
    avatarUrl: null,
    platforms: ["INSTAGRAM"],
    lastSyncedAt: syncedAt,
    views30d: 1000,
    followers: 1000,
    avgViewsPerPost: 100,
    engagementRate: 0.05,
    posts30d: 10,
    followerGrowth30d: 10,
    ...overrides,
  };
}

const rows: FullCreatorRow[] = [
  row("a", { views30d: 500, engagementRate: 0.09, followers: 20_000 }),
  row("b", { views30d: 3000, engagementRate: null, followers: 500, platforms: ["TIKTOK"] }),
  row("c", { views30d: 1500, engagementRate: 0.02, followers: 5_000, platforms: ["INSTAGRAM", "TIKTOK"] }),
];

const ids = (list: { creatorId: string }[]) => list.map((r) => r.creatorId);

describe("stripForPlan", () => {
  test("FREE : la ligne ne contient que views30d comme KPI", () => {
    const keys = Object.keys(stripForPlan(rows[0], "FREE"));
    expect(keys).toContain("views30d");
    for (const hidden of ["followers", "avgViewsPerPost", "engagementRate", "posts30d", "followerGrowth30d"]) {
      expect(keys).not.toContain(hidden);
    }
  });

  test("BASIC : tous les KPI sont présents", () => {
    expect(stripForPlan(rows[0], "BASIC")).toEqual(rows[0]);
  });
});

describe("queryCreatorRows", () => {
  test("FREE : un tri interdit est remplacé par views30d desc", () => {
    const result = queryCreatorRows(rows, "FREE", { sort: "engagementRate", order: "asc" });
    expect(ids(result)).toEqual(["b", "c", "a"]);
  });

  test("FREE : les filtres sont ignorés", () => {
    const result = queryCreatorRows(rows, "FREE", {
      sort: "views30d",
      order: "desc",
      platform: "TIKTOK",
      minFollowers: 10_000,
    });
    expect(ids(result)).toEqual(["b", "c", "a"]);
  });

  test("BASIC : filtre réseau", () => {
    const result = queryCreatorRows(rows, "BASIC", { sort: "views30d", order: "desc", platform: "TIKTOK" });
    expect(ids(result)).toEqual(["b", "c"]);
  });

  test("BASIC : tranche d'abonnés (bornes incluses)", () => {
    const result = queryCreatorRows(rows, "BASIC", {
      sort: "followers",
      order: "asc",
      minFollowers: 500,
      maxFollowers: 5_000,
    });
    expect(ids(result)).toEqual(["b", "c"]);
  });

  test("tri : les valeurs null sont toujours en fin de liste", () => {
    const asc = queryCreatorRows(rows, "BASIC", { sort: "engagementRate", order: "asc" });
    const desc = queryCreatorRows(rows, "BASIC", { sort: "engagementRate", order: "desc" });
    expect(ids(asc)).toEqual(["c", "a", "b"]);
    expect(ids(desc)).toEqual(["a", "c", "b"]);
  });

  test("le résultat est déjà filtré selon le plan", () => {
    const [first] = queryCreatorRows(rows, "FREE", { sort: "views30d", order: "desc" });
    expect(first).not.toHaveProperty("followers");
  });
});

describe("parseListQuery", () => {
  test("valeurs invalides → valeurs par défaut", () => {
    expect(
      parseListQuery({ sort: "hack", order: "x", minFollowers: "abc", maxFollowers: "-5", platform: "FACEBOOK" }),
    ).toEqual({ sort: "views30d", order: "desc" });
  });

  test("valeurs valides conservées", () => {
    expect(
      parseListQuery({ sort: "followers", order: "asc", platform: "TIKTOK", minFollowers: "1000", maxFollowers: "50000" }),
    ).toEqual({ sort: "followers", order: "asc", platform: "TIKTOK", minFollowers: 1000, maxFollowers: 50000 });
  });

  test("paramètre répété → première valeur", () => {
    expect(parseListQuery({ sort: ["followers", "views30d"] }).sort).toBe("followers");
  });
});

describe("effectiveQuery", () => {
  test("FREE : tri interdit et filtres retirés", () => {
    expect(effectiveQuery("FREE", { sort: "engagementRate", order: "asc", platform: "TIKTOK", minFollowers: 10 })).toEqual({
      sort: "views30d",
      order: "desc",
    });
  });

  test("FREE : tri par vues conservé avec son ordre", () => {
    expect(effectiveQuery("FREE", { sort: "views30d", order: "asc" })).toEqual({ sort: "views30d", order: "asc" });
  });

  test("BASIC : requête inchangée", () => {
    const query = { sort: "followers", order: "asc", platform: "TIKTOK", maxFollowers: 5000 } as const;
    expect(effectiveQuery("BASIC", query)).toEqual(query);
  });
});
