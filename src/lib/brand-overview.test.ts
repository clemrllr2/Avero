import { expect, test } from "vitest";
import { listOverview } from "@/lib/brand-overview";
import type { CreatorRow } from "@/lib/creator-query";

const row = (creatorId: string, views30d: number, extra: Partial<CreatorRow> = {}): CreatorRow => ({
  creatorId,
  displayName: creatorId,
  avatarUrl: null,
  platforms: ["INSTAGRAM"],
  lastSyncedAt: new Date("2026-10-26T10:00:00Z"),
  views30d,
  ...extra,
});

test("listOverview : nombre, vues cumulées, réseaux et top 10 par vues quel que soit le tri", () => {
  const rows = [
    row("a", 100, { platforms: ["INSTAGRAM", "TIKTOK"] }),
    row("b", 900, { platforms: ["TIKTOK"] }),
    ...Array.from({ length: 10 }, (_, i) => row(`x${i}`, i)),
  ];
  const overview = listOverview(rows);
  expect(overview.count).toBe(12);
  expect(overview.totalViews).toBe(1045);
  expect(overview.platformCounts).toEqual({ INSTAGRAM: 11, TIKTOK: 2 });
  expect(overview.top.map((r) => r.creatorId).slice(0, 3)).toEqual(["b", "a", "x9"]);
  expect(overview.top).toHaveLength(10);
});

test("listOverview : engagement moyen sur les seules valeurs connues ; null si aucune (plan Free ou pas de données)", () => {
  expect(listOverview([row("a", 1, { engagementRate: 0.04 }), row("b", 1, { engagementRate: null }), row("c", 1, { engagementRate: 0.08 })]).avgEngagement).toBeCloseTo(0.06);
  expect(listOverview([row("a", 1), row("b", 1)]).avgEngagement).toBeNull();
});

test("listOverview : liste vide", () => {
  expect(listOverview([])).toEqual({ count: 0, totalViews: 0, avgEngagement: null, platformCounts: { INSTAGRAM: 0, TIKTOK: 0 }, top: [] });
});
