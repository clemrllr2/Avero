import { viewsByWeek } from "@/lib/charts";
import { computeCombinedKpis, computeNetworkKpis } from "@/lib/kpi";
import type { CreatorKpis, CreatorSource, NetworkData, Platform } from "@/lib/types";

export interface FullCreatorRow extends CreatorKpis {
  creatorId: string;
  displayName: string;
  avatarUrl: string | null;
  platforms: Platform[];
  lastSyncedAt: Date;
  /** Vues par semaine de publication sur 8 semaines (graphiques : Premium, retiré sinon par stripForPlan) */
  viewsTrend: number[];
}

export interface CreatorDashboard {
  creatorId: string;
  displayName: string;
  networks: NetworkData[];
  kpis: CreatorKpis;
  kpisByPlatform: Partial<Record<Platform, CreatorKpis>>;
  lastSyncedAt: Date | null;
}

/** Date de la mise à jour la plus ancienne : les chiffres affichés sont au moins aussi récents. */
function oldestSync(networks: NetworkData[]): Date | null {
  if (networks.length === 0) return null;
  return new Date(Math.min(...networks.map((n) => n.lastSyncedAt.getTime())));
}

export function buildFullRow(source: CreatorSource, now: Date): FullCreatorRow {
  return {
    creatorId: source.creatorId,
    displayName: source.displayName,
    avatarUrl: source.networks.find((n) => n.avatarUrl)?.avatarUrl ?? null,
    platforms: source.networks.map((n) => n.platform),
    lastSyncedAt: oldestSync(source.networks) ?? now,
    viewsTrend: viewsByWeek(source.networks.flatMap((n) => n.posts), now).map((w) => w.views),
    ...computeCombinedKpis(source.networks, now),
  };
}

export function buildDashboard(source: CreatorSource, now: Date): CreatorDashboard {
  const kpisByPlatform: Partial<Record<Platform, CreatorKpis>> = {};
  for (const network of source.networks) {
    kpisByPlatform[network.platform] = computeNetworkKpis(network, now);
  }
  return {
    creatorId: source.creatorId,
    displayName: source.displayName,
    networks: source.networks,
    kpis: computeCombinedKpis(source.networks, now),
    kpisByPlatform,
    lastSyncedAt: oldestSync(source.networks),
  };
}
