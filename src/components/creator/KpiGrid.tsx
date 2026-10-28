import { KpiCard } from "@/components/ui/KpiCard";
import { formatCompact, formatGrowth, formatNumber, formatPercent } from "@/lib/format";
import type { CreatorKpis } from "@/lib/types";

/** Les 6 KPI d'un créateur (spec, section 4). */
export function KpiGrid({ kpis }: { kpis: CreatorKpis }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
      <KpiCard label="Vues sur 30 jours" value={formatCompact(kpis.views30d)} />
      <KpiCard label="Abonnés" value={formatCompact(kpis.followers)} />
      <KpiCard
        label="Vues moyennes par publication"
        value={kpis.avgViewsPerPost === null ? "—" : formatCompact(kpis.avgViewsPerPost)}
      />
      <KpiCard label="Taux d'engagement" value={formatPercent(kpis.engagementRate)} />
      <KpiCard label="Publications sur 30 jours" value={formatNumber(kpis.posts30d)} />
      <KpiCard
        label="Évolution des abonnés sur 30 jours"
        value={formatGrowth(kpis.followerGrowth30d)}
        tone={kpis.followerGrowth30d === null ? "muted" : "default"}
      />
    </div>
  );
}
