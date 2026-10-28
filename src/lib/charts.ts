import type { NetworkData, Platform, PostData } from "@/lib/types";

const DAY = 24 * 60 * 60 * 1000;
const WEEKS = 8;

const weekLabel = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });

/** Vues regroupées par semaine de publication, sur les 8 dernières semaines (la plus récente en dernier). */
export function viewsByWeek(posts: PostData[], now: Date): { week: string; views: number }[] {
  const end = now.getTime();
  return Array.from({ length: WEEKS }, (_, i) => {
    const start = end - (WEEKS - i) * 7 * DAY;
    const stop = start + 7 * DAY;
    const views = posts
      .filter((p) => p.publishedAt.getTime() > start && p.publishedAt.getTime() <= stop)
      .reduce((sum, p) => sum + p.views, 0);
    return { week: weekLabel.format(new Date(start + DAY)), views };
  });
}

export type FollowersPoint = { date: string } & Partial<Record<Platform, number>>;

/** Relevés d'abonnés des réseaux fusionnés par jour (AAAA-MM-JJ), du plus ancien au plus récent. */
export function followersSeries(networks: Pick<NetworkData, "platform" | "snapshots">[]): FollowersPoint[] {
  const byDay = new Map<string, FollowersPoint>();
  for (const network of networks) {
    for (const snapshot of network.snapshots) {
      const date = snapshot.date.toISOString().slice(0, 10);
      const point = byDay.get(date) ?? { date };
      point[network.platform] = snapshot.followers;
      byDay.set(date, point);
    }
  }
  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Abonnés tous réseaux confondus à chaque relevé ; un réseau absent ce jour-là compte pour sa dernière valeur connue. */
export function totalFollowers(points: FollowersPoint[]): number[] {
  const last: Partial<Record<Platform, number>> = {};
  return points.map((point) => {
    for (const platform of ["INSTAGRAM", "TIKTOK"] as const) {
      if (point[platform] !== undefined) last[platform] = point[platform];
    }
    return (last.INSTAGRAM ?? 0) + (last.TIKTOK ?? 0);
  });
}
