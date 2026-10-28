import Link from "next/link";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import type { CreatorDashboard } from "@/lib/aggregate";
import { bestIndex } from "@/lib/compare";
import { formatCompact, formatDate, formatGrowth, formatNumber, formatPercent } from "@/lib/format";
import type { CreatorKpis } from "@/lib/types";

const ROWS: { key: keyof CreatorKpis; label: string; format: (v: number | null) => string }[] = [
  { key: "views30d", label: "Vues sur 30 jours", format: (v) => formatCompact(v ?? 0) },
  { key: "followers", label: "Abonnés", format: (v) => formatCompact(v ?? 0) },
  { key: "avgViewsPerPost", label: "Vues moyennes par publication", format: (v) => (v === null ? "—" : formatCompact(v)) },
  { key: "engagementRate", label: "Taux d'engagement", format: formatPercent },
  { key: "posts30d", label: "Publications sur 30 jours", format: (v) => formatNumber(v ?? 0) },
  { key: "followerGrowth30d", label: "Évolution des abonnés", format: formatGrowth },
];

/** Une colonne par créateur, une ligne par KPI ; la meilleure valeur de chaque ligne est mise en avant. */
export function CompareTable({ creators }: { creators: CreatorDashboard[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="p-5 text-sm font-medium text-muted">
              Indicateur
            </th>
            {creators.map((c) => (
              <th key={c.creatorId} scope="col" className="p-5 align-top">
                <Link href={`/marque/createurs/${c.creatorId}`} className="display text-lg font-bold hover:text-cobalt">
                  {c.displayName}
                </Link>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {c.networks.map((n) => (
                    <PlatformBadge key={n.platform} platform={n.platform} />
                  ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {ROWS.map((row) => {
            const values = creators.map((c) => c.kpis[row.key]);
            const best = bestIndex(values);
            return (
              <tr key={row.key} className="border-b border-line">
                <th scope="row" className="p-5 font-normal text-muted">
                  {row.label}
                </th>
                {values.map((value, i) => (
                  <td key={creators[i].creatorId} className="p-5">
                    {i === best ? (
                      <span className="inline-flex items-center gap-2 font-bold">
                        {row.format(value)}
                        <span className="rounded-md bg-signal px-1.5 py-0.5 text-[11px] font-semibold text-ink">Meilleur</span>
                      </span>
                    ) : (
                      row.format(value)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
          <tr>
            <th scope="row" className="p-5 font-normal text-muted">
              Mis à jour le
            </th>
            {creators.map((c) => (
              <td key={c.creatorId} className="p-5 text-muted">
                {c.lastSyncedAt ? formatDate(c.lastSyncedAt) : "—"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
