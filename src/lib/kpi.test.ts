import { describe, expect, test } from "vitest";
import { computeCombinedKpis, computeNetworkKpis } from "@/lib/kpi";
import type { FollowerSnapshot, PostData } from "@/lib/types";

const now = new Date("2026-10-26T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(now.getTime() - n * DAY);

function post(
  ageInDays: number,
  views: number,
  likes = 0,
  comments = 0,
  shares = 0,
): PostData {
  return {
    externalId: `p-${ageInDays}-${views}`,
    platform: "INSTAGRAM",
    publishedAt: daysAgo(ageInDays),
    caption: null,
    thumbnailUrl: null,
    permalink: null,
    views,
    likes,
    comments,
    shares,
    saves: null,
    reach: null,
  };
}

const snap = (ageInDays: number, followers: number): FollowerSnapshot => ({
  date: daysAgo(ageInDays),
  followers,
});

describe("computeNetworkKpis", () => {
  test("ne compte que les publications des 30 derniers jours", () => {
    const kpis = computeNetworkKpis(
      {
        posts: [post(1, 1000, 50, 10, 40), post(10, 3000, 100, 20, 30), post(40, 99999, 1, 1, 1)],
        snapshots: [],
      },
      now,
    );
    expect(kpis.views30d).toBe(4000);
    expect(kpis.posts30d).toBe(2);
    expect(kpis.avgViewsPerPost).toBe(2000);
    expect(kpis.engagementRate).toBeCloseTo(0.0625);
  });

  test("une publication d'il y a exactement 30 jours est incluse", () => {
    const kpis = computeNetworkKpis({ posts: [post(30, 500)], snapshots: [] }, now);
    expect(kpis.views30d).toBe(500);
  });

  test("followers = dernier relevé ; évolution = dernier − plus ancien des 30 j", () => {
    const kpis = computeNetworkKpis(
      { posts: [], snapshots: [snap(45, 500), snap(29, 800), snap(0, 1000)] },
      now,
    );
    expect(kpis.followers).toBe(1000);
    expect(kpis.followerGrowth30d).toBe(200);
  });

  test("un seul relevé → évolution null", () => {
    const kpis = computeNetworkKpis({ posts: [], snapshots: [snap(0, 1000)] }, now);
    expect(kpis.followers).toBe(1000);
    expect(kpis.followerGrowth30d).toBeNull();
  });

  test("aucune publication → moyenne et engagement null, pas de NaN", () => {
    const kpis = computeNetworkKpis({ posts: [post(40, 1000)], snapshots: [] }, now);
    expect(kpis.views30d).toBe(0);
    expect(kpis.posts30d).toBe(0);
    expect(kpis.avgViewsPerPost).toBeNull();
    expect(kpis.engagementRate).toBeNull();
  });

  test("publications à 0 vue → engagement null, pas d'Infinity", () => {
    const kpis = computeNetworkKpis({ posts: [post(1, 0, 5, 1, 0)], snapshots: [] }, now);
    expect(kpis.avgViewsPerPost).toBe(0);
    expect(kpis.engagementRate).toBeNull();
  });

  test("aucun relevé → followers 0", () => {
    const kpis = computeNetworkKpis({ posts: [], snapshots: [] }, now);
    expect(kpis.followers).toBe(0);
    expect(kpis.followerGrowth30d).toBeNull();
  });
});

describe("computeCombinedKpis", () => {
  const instagram = {
    posts: [post(1, 1000, 50, 10, 40)],
    snapshots: [snap(20, 800), snap(0, 1000)],
  };
  const tiktok = {
    posts: [post(2, 3000, 100, 20, 30)],
    snapshots: [snap(0, 3000)],
  };

  test("additionne vues et abonnés, engagement calculé sur toutes les publications", () => {
    const kpis = computeCombinedKpis([instagram, tiktok], now);
    expect(kpis.views30d).toBe(4000);
    expect(kpis.posts30d).toBe(2);
    expect(kpis.avgViewsPerPost).toBe(2000);
    expect(kpis.engagementRate).toBeCloseTo(0.0625);
    expect(kpis.followers).toBe(4000);
    expect(kpis.followerGrowth30d).toBe(200);
  });

  test("évolution null si aucun réseau n'a assez de relevés", () => {
    const kpis = computeCombinedKpis([{ ...instagram, snapshots: [snap(0, 1000)] }, tiktok], now);
    expect(kpis.followerGrowth30d).toBeNull();
  });

  test("aucun réseau → KPI à zéro ou null", () => {
    const kpis = computeCombinedKpis([], now);
    expect(kpis).toEqual({
      views30d: 0,
      followers: 0,
      avgViewsPerPost: null,
      engagementRate: null,
      posts30d: 0,
      followerGrowth30d: null,
    });
  });
});
