"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { COLUMNS, FULL_ENGAGEMENT, sortHref } from "@/components/brand/columns";
import { CreatorCard } from "@/components/brand/CreatorCard";
import { Podium } from "@/components/brand/Podium";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Avatar } from "@/components/visual/Avatar";
import { Icon } from "@/components/visual/Icon";
import { RadialGauge } from "@/components/visual/RadialGauge";
import { Sparkline } from "@/components/visual/Sparkline";
import { MAX_COMPARED } from "@/lib/compare";
import type { CreatorListQuery, CreatorRow, ListView } from "@/lib/creator-query";
import { formatDate } from "@/lib/format";
import type { SortKey } from "@/lib/plans";

function LockIcon() {
  return <Icon name="lock" className="size-3.5" />;
}

/** Valeur numérique de la colonne triée (pour la barre proportionnelle) ; 0 si absente ou négative. */
function metric(row: CreatorRow, key: SortKey): number {
  const value = row[key];
  return typeof value === "number" && value > 0 ? value : 0;
}

/** Contenu d'une cellule : jauge pour l'engagement, flèche colorée pour l'évolution, texte sinon. */
function cell(row: CreatorRow, key: SortKey, text: string): ReactNode {
  if (key === "engagementRate" && typeof row.engagementRate === "number") {
    return (
      <span className="inline-flex items-center gap-2">
        <RadialGauge value={row.engagementRate / FULL_ENGAGEMENT} size={20} color="#d6336c" track="#d6336c22" />
        {text}
      </span>
    );
  }
  if (key === "followerGrowth30d" && typeof row.followerGrowth30d === "number" && row.followerGrowth30d !== 0) {
    const up = row.followerGrowth30d > 0;
    return (
      <span className={`inline-flex items-center gap-1 ${up ? "text-[#0d7a3c]" : "text-danger"}`}>
        <Icon name={up ? "arrow-up" : "arrow-down"} className="size-3.5" />
        {text}
      </span>
    );
  }
  return text;
}

/** Tri de la galerie : une pastille par indicateur (verrouillée si le plan ne le permet pas). */
function SortPills({ query, view, sortable }: { query: CreatorListQuery; view: ListView; sortable: SortKey[] }) {
  return (
    <div role="group" aria-label="Trier par" className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-muted">Trier par</span>
      {COLUMNS.map((col) => {
        const active = query.sort === col.key;
        if (!sortable.includes(col.key)) {
          return (
            <Link
              key={col.key}
              href="/marque/plans"
              title="Disponible avec le plan Basic"
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line px-3 py-1.5 text-sm text-muted/70 hover:text-cobalt"
            >
              <LockIcon />
              {col.label}
            </Link>
          );
        }
        return (
          <Link
            key={col.key}
            href={sortHref(query, view, col.key)}
            scroll={false}
            aria-current={active ? "true" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
              active ? "border-night bg-night text-paper" : "border-line bg-surface hover:border-cobalt/40 hover:text-cobalt"
            }`}
          >
            <Icon name={col.icon} className="size-3.5" />
            {col.label}
            {active && <span aria-hidden>{query.order === "asc" ? "↑" : "↓"}</span>}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Liste des créateurs, en cartes ou en tableau. Les indicateurs absents des lignes (retirés côté serveur
 * selon le plan) apparaissent verrouillés avec un lien vers les plans.
 */
export function CreatorsTable({
  rows,
  query,
  sortable,
  premium,
  view = "tableau",
}: {
  rows: CreatorRow[];
  query: CreatorListQuery;
  sortable: SortKey[];
  premium: boolean;
  view?: ListView;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < MAX_COMPARED ? [...s, id] : s));

  if (rows.length === 0) {
    return (
      <p className="flex items-center gap-3 rounded-[28px] border border-line bg-surface p-8 text-muted">
        <Icon name="users" className="size-5" />
        Aucun créateur ne correspond à ces filtres.
      </p>
    );
  }

  const sortColumn = COLUMNS.find((c) => c.key === query.sort) ?? COLUMNS[0];
  const maxMetric = Math.max(1, ...rows.map((r) => metric(r, query.sort)));
  const byId = new Map(rows.map((r) => [r.creatorId, r]));
  const trend = rows.some((r) => r.viewsTrend);

  return (
    <div className="flex flex-col gap-4">
      {/* Podium : seulement en tri décroissant (les trois premiers sont alors les meilleurs). */}
      {query.order === "desc" && (
        <Podium rows={rows} metricLabel={sortColumn.label} render={sortColumn.render} linkable={premium} />
      )}
      {premium && (
        <div className="section-dark sticky top-[7.5rem] z-30 flex flex-wrap items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5 shadow-[0_20px_40px_-20px_rgba(15,16,48,0.7)] sm:top-20">
          <span className="flex items-center gap-3 text-sm text-paper/70">
            {selected.length > 0 && (
              <span aria-hidden className="flex -space-x-2">
                {selected.map((id) => (
                  <Avatar key={id} name={byId.get(id)?.displayName ?? id} size="sm" className="ring-2 ring-night" />
                ))}
              </span>
            )}
            {selected.length === 0
              ? "Cochez 2 à 4 créateurs pour les comparer."
              : `${selected.length} créateur${selected.length > 1 ? "s" : ""} sélectionné${selected.length > 1 ? "s" : ""}`}
          </span>
          <Link
            href={`/marque/comparer?ids=${selected.join(",")}`}
            aria-disabled={selected.length < 2}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              selected.length < 2 ? "pointer-events-none bg-paper/10 text-paper/40" : "bg-cobalt text-white hover:bg-cobalt-deep"
            }`}
          >
            <Icon name="chart" className="size-4" />
            Comparer
          </Link>
        </div>
      )}

      {view === "cartes" ? (
        <>
          <SortPills query={query} view={view} sortable={sortable} />
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => (
              <li key={row.creatorId} className="flex">
                <CreatorCard
                  row={row}
                  premium={premium}
                  selected={selected.includes(row.creatorId)}
                  selectable={selected.includes(row.creatorId) || selected.length < MAX_COMPARED}
                  onToggle={() => toggle(row.creatorId)}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="overflow-x-auto rounded-[28px] border border-line bg-surface shadow-[0_24px_60px_-48px_rgba(25,25,52,0.5)]">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                {premium && <th scope="col" className="w-10 py-3 pl-5"><span className="sr-only">Comparer</span></th>}
                <th scope="col" className="px-5 py-3 font-medium text-muted">Créateur</th>
                {trend && <th scope="col" className="px-3 py-3 font-medium text-muted">Tendance</th>}
                {COLUMNS.map((col) => {
                  const locked = !sortable.includes(col.key);
                  const active = query.sort === col.key;
                  return (
                    <th key={col.key} scope="col" className="px-3 py-3 text-right font-medium" aria-sort={active ? (query.order === "asc" ? "ascending" : "descending") : undefined}>
                      {locked ? (
                        <Link href="/marque/plans" title="Disponible avec le plan Basic" className="inline-flex items-center gap-1.5 text-muted/60 hover:text-cobalt">
                          <LockIcon />
                          {col.label}
                        </Link>
                      ) : (
                        <Link href={sortHref(query, "tableau", col.key)} scroll={false} className={`inline-flex items-center gap-1.5 ${active ? "text-ink" : "text-muted hover:text-ink"}`}>
                          <Icon name={col.icon} className="size-3.5" />
                          {col.label}
                          <span aria-hidden className="w-3 text-cobalt">{active ? (query.order === "asc" ? "↑" : "↓") : ""}</span>
                        </Link>
                      )}
                    </th>
                  );
                })}
                <th scope="col" className="px-5 py-3 text-right font-medium text-muted">Mis à jour le</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((row) => (
                <tr key={row.creatorId} className="border-b border-line transition-colors last:border-0 hover:bg-cobalt/[0.03]">
                  {premium && (
                    <td className="py-3 pl-5">
                      <input
                        type="checkbox"
                        aria-label={`Comparer ${row.displayName}`}
                        checked={selected.includes(row.creatorId)}
                        disabled={!selected.includes(row.creatorId) && selected.length >= MAX_COMPARED}
                        onChange={() => toggle(row.creatorId)}
                        className="size-4 accent-cobalt"
                      />
                    </td>
                  )}
                  <th scope="row" className="px-5 py-3 font-normal">
                    <span className="flex items-center gap-3">
                      <Avatar name={row.displayName} size="md" />
                      <span className="flex flex-col gap-1.5">
                        {premium ? (
                          <Link href={`/marque/createurs/${row.creatorId}`} className="font-semibold hover:text-cobalt">
                            {row.displayName}
                          </Link>
                        ) : (
                          <span className="font-semibold">{row.displayName}</span>
                        )}
                        <span className="flex gap-1.5">
                          {row.platforms.map((p) => (
                            <PlatformBadge key={p} platform={p} />
                          ))}
                        </span>
                      </span>
                    </span>
                  </th>
                  {trend && (
                    <td className="px-3 py-3">{row.viewsTrend && <Sparkline values={row.viewsTrend} className="h-8 w-24" />}</td>
                  )}
                  {COLUMNS.map((col) =>
                    sortable.includes(col.key) ? (
                      <td key={col.key} className={`px-3 py-3 text-right ${col.key === query.sort ? "font-semibold" : ""}`}>
                        {col.key === query.sort ? (
                          <span className="inline-flex flex-col items-end gap-1.5">
                            {cell(row, col.key, col.render(row))}
                            <span aria-hidden className="h-1.5 w-16 overflow-hidden rounded-full bg-ink/6">
                              <span
                                className="block h-full rounded-full bg-gradient-to-r from-cobalt via-violet to-instagram"
                                style={{ width: `${(metric(row, col.key) / maxMetric) * 100}%` }}
                              />
                            </span>
                          </span>
                        ) : (
                          cell(row, col.key, col.render(row))
                        )}
                      </td>
                    ) : (
                      <td key={col.key} className="px-3 py-3 text-right text-muted/40">
                        <span aria-label="Verrouillé">•••</span>
                      </td>
                    ),
                  )}
                  <td className="px-5 py-3 text-right whitespace-nowrap text-muted">{formatDate(row.lastSyncedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
