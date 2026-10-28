import type { CreatorKpis, FollowerSnapshot, NetworkData, PostData } from "@/lib/types";

type KpiInput = Pick<NetworkData, "posts" | "snapshots">;

const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function windowStart(now: Date): number {
  return now.getTime() - WINDOW_MS;
}

function postsInWindow(posts: PostData[], now: Date): PostData[] {
  const start = windowStart(now);
  return posts.filter((p) => p.publishedAt.getTime() >= start);
}

function byDate(snapshots: FollowerSnapshot[]): FollowerSnapshot[] {
  return [...snapshots].sort((a, b) => a.date.getTime() - b.date.getTime());
}

function latestFollowers(snapshots: FollowerSnapshot[]): number {
  const sorted = byDate(snapshots);
  return sorted.length > 0 ? sorted[sorted.length - 1].followers : 0;
}

/** Dernier relevé − plus ancien relevé des 30 derniers jours ; null s'il y a moins de 2 relevés. */
function followerGrowth(snapshots: FollowerSnapshot[], now: Date): number | null {
  const start = windowStart(now);
  const recent = byDate(snapshots).filter((s) => s.date.getTime() >= start);
  if (recent.length < 2) return null;
  return recent[recent.length - 1].followers - recent[0].followers;
}

/** KPI calculés sur les publications : vues, nombre, moyenne et engagement. */
function postKpis(posts: PostData[], now: Date) {
  const recent = postsInWindow(posts, now);
  const views30d = recent.reduce((sum, p) => sum + p.views, 0);
  const interactions = recent.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
  return {
    views30d,
    posts30d: recent.length,
    avgViewsPerPost: recent.length > 0 ? views30d / recent.length : null,
    engagementRate: views30d > 0 ? interactions / views30d : null,
  };
}

export function computeNetworkKpis(network: KpiInput, now: Date): CreatorKpis {
  return {
    ...postKpis(network.posts, now),
    followers: latestFollowers(network.snapshots),
    followerGrowth30d: followerGrowth(network.snapshots, now),
  };
}

export function computeCombinedKpis(networks: KpiInput[], now: Date): CreatorKpis {
  const growths = networks
    .map((n) => followerGrowth(n.snapshots, now))
    .filter((g): g is number => g !== null);
  return {
    ...postKpis(
      networks.flatMap((n) => n.posts),
      now,
    ),
    followers: networks.reduce((sum, n) => sum + latestFollowers(n.snapshots), 0),
    followerGrowth30d: growths.length > 0 ? growths.reduce((a, b) => a + b, 0) : null,
  };
}
