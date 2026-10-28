import Link from "next/link";
import { PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { Avatar } from "@/components/visual/Avatar";
import { Icon } from "@/components/visual/Icon";
import type { CreatorRow } from "@/lib/creator-query";

const PLACES = [
  { medal: "bg-signal text-ink", ring: "gradient-border", lift: "sm:-translate-y-4", order: "sm:order-2" },
  { medal: "bg-[#d9dcec] text-ink", ring: "", lift: "", order: "sm:order-1" },
  { medal: "bg-[#e2a072] text-ink", ring: "", lift: "", order: "sm:order-3" },
];

/**
 * Les trois premiers de la liste triée, en cartes (le premier au centre, surélevé).
 * N'affiche que les places existantes (1 ou 2 créateurs → 1 ou 2 cartes).
 */
export function Podium({
  rows,
  metricLabel,
  render,
  linkable,
}: {
  rows: CreatorRow[];
  metricLabel: string;
  render: (row: CreatorRow) => string;
  linkable: boolean;
}) {
  const top = rows.slice(0, 3);
  if (top.length === 0) return null;
  return (
    <ol aria-label="Les trois premiers" className="grid gap-4 pt-4 sm:grid-cols-3 sm:items-end">
      {top.map((row, i) => {
        const place = PLACES[i];
        const name = linkable ? (
          <Link href={`/marque/createurs/${row.creatorId}`} className="hover:text-cobalt">
            {row.displayName}
          </Link>
        ) : (
          row.displayName
        );
        return (
          <li
            key={row.creatorId}
            className={`relative isolate flex flex-col items-center gap-3 overflow-hidden rounded-[28px] border border-line bg-surface px-5 pt-6 pb-5 text-center shadow-[0_30px_60px_-40px_rgba(25,25,52,0.5)] ${place.ring} ${place.lift} ${place.order}`}
          >
            {i === 0 && (
              <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-signal/25 to-transparent" />
            )}
            <span className="relative">
              <Avatar name={row.displayName} size="lg" ring />
              <span
                className={`display absolute -right-1 -bottom-1 grid size-7 place-items-center rounded-full text-xs font-bold ring-2 ring-white ${place.medal}`}
              >
                <span className="sr-only">Place </span>
                {i + 1}
              </span>
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-semibold">{name}</span>
              <span className="flex justify-center gap-1.5 text-muted">
                {row.platforms.map((p) => (
                  <span key={p}>
                    <Icon name={p === "INSTAGRAM" ? "instagram" : "tiktok"} className="size-3.5" />
                    <span className="sr-only">{PLATFORM_NAMES[p]}</span>
                  </span>
                ))}
              </span>
            </span>
            <span className="flex flex-col">
              <span className="display text-2xl font-bold">{render(row)}</span>
              <span className="text-xs text-muted">{metricLabel}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
