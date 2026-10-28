import { KpiCard } from "@/components/ui/KpiCard";
import { formatCompact, formatGrowth, formatNumber, formatPercent } from "@/lib/format";
import type { CreatorKpis } from "@/lib/types";

export type KpiSparks = { views?: number[]; followers?: number[] };

/** Taux d'engagement qui remplit la jauge : 10 % et plus. */
const FULL_ENGAGEMENT = 0.1;

/** Les 6 KPI d'un créateur (spec, section 4), en tuiles colorées. */
export function KpiGrid({ kpis, sparks = {} }: { kpis: CreatorKpis; sparks?: KpiSparks }) {
  const growth = kpis.followerGrowth30d;
  return (
    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
      <KpiCard label="Vues sur 30 jours" value={formatCompact(kpis.views30d)} icon="eye" color="#3b46f1" spark={sparks.views} />
      <KpiCard label="Abonnés" value={formatCompact(kpis.followers)} icon="users" color="#7c5cff" spark={sparks.followers} />
      <KpiCard
        label="Vues moyennes par publication"
        value={kpis.avgViewsPerPost === null ? "—" : formatCompact(kpis.avgViewsPerPost)}
        icon="play"
        color="#2f7fe0"
      />
      <KpiCard
        label="Taux d'engagement"
        value={formatPercent(kpis.engagementRate)}
        icon="heart"
        color="#d6336c"
        gauge={kpis.engagementRate === null ? null : kpis.engagementRate / FULL_ENGAGEMENT}
      />
      <KpiCard label="Publications sur 30 jours" value={formatNumber(kpis.posts30d)} icon="grid" color="#e8890c" />
      <KpiCard
        label="Évolution des abonnés sur 30 jours"
        value={formatGrowth(growth)}
        tone={growth === null ? "muted" : "default"}
        icon="trend"
        color="#0e9f9a"
        trend={growth === null || growth === 0 ? null : growth > 0 ? "up" : "down"}
      />
    </div>
  );
}
