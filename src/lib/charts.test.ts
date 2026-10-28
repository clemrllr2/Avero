import { describe, expect, test } from "vitest";
import { followersSeries, viewsByWeek } from "@/lib/charts";
import type { NetworkData, PostData } from "@/lib/types";

const now = new Date("2026-10-26T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(now.getTime() - n * DAY);

const post = (ageInDays: number, views: number): PostData => ({
  externalId: `p${ageInDays}`,
  platform: "INSTAGRAM",
  publishedAt: daysAgo(ageInDays),
  caption: null,
  thumbnailUrl: null,
  permalink: null,
  views,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: null,
  reach: null,
});

describe("viewsByWeek", () => {
  test("8 semaines, de la plus ancienne à la plus récente", () => {
    const weeks = viewsByWeek([post(1, 100), post(2, 50), post(20, 30), post(60, 999)], now);
    expect(weeks).toHaveLength(8);
    expect(weeks[7].views).toBe(150);
    expect(weeks[5].views).toBe(30);
  });

  test("les publications de plus de 8 semaines sont ignorées", () => {
    const total = viewsByWeek([post(57, 999)], now).reduce((sum, w) => sum + w.views, 0);
    expect(total).toBe(0);
  });

  test("une semaine sans publication vaut 0", () => {
    expect(viewsByWeek([], now).every((w) => w.views === 0)).toBe(true);
  });
});

describe("followersSeries", () => {
  const network = (platform: NetworkData["platform"], snapshots: [number, number][]) =>
    ({
      platform,
      snapshots: snapshots.map(([age, followers]) => ({ date: daysAgo(age), followers })),
    }) as NetworkData;

  test("fusionne les relevés des deux réseaux par jour, dans l'ordre", () => {
    const series = followersSeries([
      network("INSTAGRAM", [
        [10, 900],
        [0, 1000],
      ]),
      network("TIKTOK", [
        [5, 3000],
        [0, 3100],
      ]),
    ]);
    expect(series).toEqual([
      { date: "2026-10-16", INSTAGRAM: 900 },
      { date: "2026-10-21", TIKTOK: 3000 },
      { date: "2026-10-26", INSTAGRAM: 1000, TIKTOK: 3100 },
    ]);
  });
});
