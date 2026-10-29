import Link from "next/link";
import { COLUMNS, FULL_ENGAGEMENT } from "@/components/brand/columns";
import { PLATFORM_ICONS, PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { Avatar } from "@/components/visual/Avatar";
import { Icon } from "@/components/visual/Icon";
import { PostThumb } from "@/components/visual/PostThumb";
import { RadialGauge } from "@/components/visual/RadialGauge";
import { Sparkline } from "@/components/visual/Sparkline";
import type { CreatorRow } from "@/lib/creator-query";
import { formatDate } from "@/lib/format";
import type { SortKey } from "@/lib/plans";
import { avatarColors } from "@/lib/visual";

/** Indicateurs affichés sur la carte (en plus des vues, en grand). */
const CARD_KPIS: SortKey[] = ["followers", "engagementRate", "avgViewsPerPost", "followerGrowth30d"];

/**
 * Carte d'un créateur dans la galerie des marques. Un indicateur absent de la ligne (retiré par le serveur
 * selon le plan) apparaît verrouillé. Courbe des vues, fiche et comparaison : Premium.
 */
export function CreatorCard({
  row,
  premium,
  selected,
  selectable,
  onToggle,
}: {
  row: CreatorRow;
  premium: boolean;
  selected: boolean;
  selectable: boolean;
  onToggle: () => void;
}) {
  const cover = avatarColors(row.displayName);
  const name = premium ? (
    <Link href={`/marque/createurs/${row.creatorId}`} className="hover:text-cobalt">
      {row.displayName}
    </Link>
  ) : (
    row.displayName
  );

  return (
    <article
      className={`flex w-full flex-col overflow-hidden rounded-[28px] border bg-surface shadow-[0_24px_60px_-48px_rgba(25,25,52,0.5)] transition-colors ${
        selected ? "border-cobalt ring-2 ring-cobalt/20" : "border-line hover:border-cobalt/30"
      }`}
    >
      <div
        className="relative isolate h-24 overflow-hidden"
        style={{ backgroundImage: `linear-gradient(120deg, ${cover[0]}, ${cover[1]})` }}
      >
        <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
        <div aria-hidden className="absolute top-3 right-3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PostThumb key={i} seed={`${row.creatorId}-${i}`} className="w-9 rounded-lg !shadow-none ring-1 ring-white/30" />
          ))}
        </div>
        {premium && (
          <label className="glass absolute top-3 left-3 flex cursor-pointer items-center gap-2 rounded-full bg-night/40 px-3 py-1.5 text-xs font-semibold text-white">
            <input
              type="checkbox"
              checked={selected}
              disabled={!selectable}
              onChange={onToggle}
              className="size-3.5 accent-cobalt"
              aria-label={`Comparer ${row.displayName}`}
            />
            Comparer
          </label>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-5">
        <div className="-mt-8 flex items-end gap-3">
          <Avatar name={row.displayName} size="lg" ring />
          <div className="flex min-w-0 flex-col pb-1">
            <h3 className="truncate font-semibold">{name}</h3>
            <span className="flex gap-1.5 text-muted">
              {row.platforms.map((p) => (
                <span key={p} className={p === "INSTAGRAM" ? "text-instagram" : "text-tiktok"}>
                  <Icon name={PLATFORM_ICONS[p]} className="size-3.5" />
                  <span className="sr-only">{PLATFORM_NAMES[p]}</span>
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <p className="flex flex-col">
            <span className="display text-[32px] leading-none font-bold">{COLUMNS[0].render(row)}</span>
            <span className="text-sm text-muted">vues sur 30 jours</span>
          </p>
          {row.viewsTrend && <Sparkline values={row.viewsTrend} className="h-10 w-28" />}
        </div>

        <dl className="grid grid-cols-2 gap-2">
          {CARD_KPIS.map((key) => {
            const col = COLUMNS.find((c) => c.key === key)!;
            const locked = row[key] === undefined;
            const growth = key === "followerGrowth30d" ? row.followerGrowth30d : undefined;
            return (
              <div key={key} className="flex flex-col gap-1 rounded-2xl bg-paper px-3 py-2.5">
                <dt className="flex items-center gap-1.5 text-xs text-muted">
                  <Icon name={col.icon} className="size-3.5" />
                  {col.label}
                </dt>
                <dd className="flex items-center gap-1.5 font-semibold tabular-nums">
                  {locked ? (
                    <Link href="/marque/plans" className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-cobalt">
                      <Icon name="lock" className="size-3" />
                      Basic
                    </Link>
                  ) : (
                    <>
                      {key === "engagementRate" && typeof row.engagementRate === "number" && (
                        <RadialGauge value={row.engagementRate / FULL_ENGAGEMENT} size={18} color={col.color} track={`${col.color}22`} />
                      )}
                      {typeof growth === "number" && growth !== 0 && (
                        <Icon
                          name={growth > 0 ? "arrow-up" : "arrow-down"}
                          className={`size-3.5 ${growth > 0 ? "text-[#0d7a3c]" : "text-danger"}`}
                        />
                      )}
                      {col.render(row)}
                    </>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>

        <p className="mt-auto flex items-center justify-between gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" className="size-3.5" />
            Mis à jour le {formatDate(row.lastSyncedAt)}
          </span>
          {premium && (
            <Link href={`/marque/createurs/${row.creatorId}`} className="inline-flex items-center gap-1 font-semibold text-cobalt hover:underline">
              Voir la fiche
              <Icon name="arrow-right" className="size-3.5" />
            </Link>
          )}
        </p>
      </div>
    </article>
  );
}
