import Link from "next/link";
import { CompareRadar } from "@/components/brand/CompareRadar";
import { Card } from "@/components/ui/Card";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Avatar } from "@/components/visual/Avatar";
import type { CreatorDashboard } from "@/lib/aggregate";
import { COMPARE_COLORS, bestIndex, normalizeForRadar } from "@/lib/compare";
import { formatCompact, formatDate, formatGrowth, formatNumber, formatPercent } from "@/lib/format";
import type { CreatorKpis } from "@/lib/types";

const ROWS: { key: keyof CreatorKpis; label: string; short: string; format: (v: number | null) => string }[] = [
  { key: "views30d", label: "Vues sur 30 jours", short: "Vues", format: (v) => formatCompact(v ?? 0) },
  { key: "followers", label: "Abonnés", short: "Abonnés", format: (v) => formatCompact(v ?? 0) },
  {
    key: "avgViewsPerPost",
    label: "Vues moyennes par publication",
    short: "Vues moy.",
    format: (v) => (v === null ? "—" : formatCompact(v)),
  },
  { key: "engagementRate", label: "Taux d'engagement", short: "Engagement", format: formatPercent },
  { key: "posts30d", label: "Publications sur 30 jours", short: "Publications", format: (v) => formatNumber(v ?? 0) },
  { key: "followerGrowth30d", label: "Évolution des abonnés", short: "Évolution", format: formatGrowth },
];

/**
 * Comparaison : une carte par créateur, un radar (valeurs relatives au meilleur), puis le tableau
 * (une colonne par créateur, une ligne par KPI ; la meilleure valeur de chaque ligne est mise en avant).
 */
export function CompareTable({ creators }: { creators: CreatorDashboard[] }) {
  const values = creators.map((c) => ROWS.map((row) => c.kpis[row.key]));
  const scores = normalizeForRadar(values);
  const axes = ROWS.map((row, k) => ({
    label: row.short,
    scores: creators.map((_, i) => scores[i][k]),
    display: creators.map((_, i) => row.format(values[i][k])),
  }));

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {creators.map((c, i) => (
          <li
            key={c.creatorId}
            className="relative isolate flex items-center gap-4 overflow-hidden rounded-[24px] border border-line bg-surface p-4"
          >
            <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: COMPARE_COLORS[i] }} />
            <Avatar name={c.displayName} size="lg" />
            <span className="flex min-w-0 flex-col gap-1.5">
              <Link href={`/marque/createurs/${c.creatorId}`} className="display truncate text-lg font-bold hover:text-cobalt">
                {c.displayName}
              </Link>
              <span className="flex flex-wrap gap-1.5">
                {c.networks.map((n) => (
                  <PlatformBadge key={n.platform} platform={n.platform} />
                ))}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <Card title="Vue d'ensemble" icon="chart">
        <CompareRadar names={creators.map((c) => c.displayName)} axes={axes} />
      </Card>

      <div className="overflow-x-auto rounded-[28px] border border-line bg-surface shadow-[0_24px_60px_-48px_rgba(25,25,52,0.5)]">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="p-5 text-sm font-medium text-muted">
                Indicateur
              </th>
              {creators.map((c, i) => (
                <th key={c.creatorId} scope="col" className="p-5 align-middle">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: COMPARE_COLORS[i] }} />
                    <span className="font-semibold">{c.displayName}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {ROWS.map((row, k) => {
              const rowValues = values.map((v) => v[k]);
              const best = bestIndex(rowValues);
              return (
                <tr key={row.key} className="border-b border-line">
                  <th scope="row" className="p-5 font-normal text-muted">
                    {row.label}
                  </th>
                  {rowValues.map((value, i) => (
                    <td key={creators[i].creatorId} className="p-5">
                      <span className="flex flex-col gap-2">
                        {i === best ? (
                          <span className="inline-flex items-center gap-2 font-bold">
                            {row.format(value)}
                            <span className="rounded-md bg-signal px-1.5 py-0.5 text-[11px] font-semibold text-ink">Meilleur</span>
                          </span>
                        ) : (
                          row.format(value)
                        )}
                        <span aria-hidden className="h-1.5 w-full max-w-28 overflow-hidden rounded-full bg-ink/6">
                          <span
                            className="block h-full rounded-full"
                            style={{ width: `${scores[i][k]}%`, backgroundColor: COMPARE_COLORS[i] }}
                          />
                        </span>
                      </span>
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
    </div>
  );
}
