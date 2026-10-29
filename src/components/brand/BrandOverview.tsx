import Link from "next/link";
import type { ReactNode } from "react";
import { PLATFORM_ICONS, PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { Avatar } from "@/components/visual/Avatar";
import { Icon, type IconName } from "@/components/visual/Icon";
import type { ListOverview } from "@/lib/brand-overview";
import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import type { Platform } from "@/lib/types";

const PLATFORMS: Platform[] = ["INSTAGRAM", "TIKTOK"];

function Tile({ icon, color, label, children }: { icon: IconName; color: string; label: string; children: ReactNode }) {
  return (
    <div
      className="flex flex-col justify-between gap-3 rounded-3xl border border-line bg-surface p-5"
      style={{ backgroundImage: `radial-gradient(120% 90% at 100% 0%, ${color}14, transparent 60%)` }}
    >
      <span aria-hidden className="grid size-10 place-items-center rounded-2xl text-white" style={{ backgroundColor: color }}>
        <Icon name={icon} className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        {children}
        <span className="text-sm text-muted">{label}</span>
      </div>
    </div>
  );
}

/**
 * Vue d'ensemble de la liste affichée : nombre de créateurs, vues cumulées, engagement moyen (Basic et plus),
 * présence par réseau, et top 10 par vues.
 */
export function BrandOverview({ overview, engagementAllowed }: { overview: ListOverview; engagementAllowed: boolean }) {
  if (overview.count === 0) return null;
  const topMax = Math.max(1, overview.top[0]?.views30d ?? 1);

  return (
    <section aria-label="Vue d'ensemble" className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <div className="grid grid-cols-2 gap-4">
        <Tile icon="users" color="#7c5cff" label={`créateur${overview.count > 1 ? "s" : ""} dans la liste`}>
          <span className="display text-[32px] leading-none font-bold">{formatNumber(overview.count)}</span>
        </Tile>
        <Tile icon="eye" color="#3b46f1" label="vues cumulées sur 30 jours">
          <span className="display text-[32px] leading-none font-bold">{formatCompact(overview.totalViews)}</span>
        </Tile>
        <Tile icon="heart" color="#d6336c" label="engagement moyen">
          {engagementAllowed ? (
            <span className="display text-[32px] leading-none font-bold">{formatPercent(overview.avgEngagement)}</span>
          ) : (
            <Link href="/marque/plans" className="flex items-center gap-2 text-sm font-semibold text-cobalt hover:underline">
              <Icon name="lock" className="size-4" />
              Disponible avec Basic
            </Link>
          )}
        </Tile>
        <Tile icon="globe" color="#0e9f9a" label="créateurs par réseau">
          <ul className="flex flex-col gap-2">
            {PLATFORMS.map((p) => (
              <li key={p} className="flex flex-col gap-1">
                <span className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Icon name={PLATFORM_ICONS[p]} className={`size-3.5 ${p === "INSTAGRAM" ? "text-instagram" : "text-tiktok"}`} />
                    {PLATFORM_NAMES[p]}
                  </span>
                  <span className="font-semibold tabular-nums">{overview.platformCounts[p]}</span>
                </span>
                <span aria-hidden className="h-1.5 rounded-full bg-ink/6">
                  <span
                    className={`block h-full rounded-full ${p === "INSTAGRAM" ? "bg-instagram" : "bg-tiktok"}`}
                    style={{ width: `${(overview.platformCounts[p] / overview.count) * 100}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>

      <div className="rounded-[28px] border border-line bg-surface p-5 sm:p-6">
        <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold">
          <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-cobalt/8 text-cobalt">
            <Icon name="medal" className="size-[18px]" />
          </span>
          Top {overview.top.length} par vues
        </h2>
        <ol className="flex flex-col gap-2.5">
          {overview.top.map((row, i) => (
            <li key={row.creatorId} className="grid grid-cols-[1.25rem_auto_1fr_auto] items-center gap-3 text-sm">
              <span className="display text-xs text-muted tabular-nums">{i + 1}</span>
              <Avatar name={row.displayName} size="xs" />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-medium">{row.displayName}</span>
                <span aria-hidden className="h-2 rounded-full bg-ink/6">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-cobalt via-violet to-instagram"
                    style={{ width: `${(row.views30d / topMax) * 100}%` }}
                  />
                </span>
              </span>
              <span className="font-semibold tabular-nums">{formatCompact(row.views30d)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
