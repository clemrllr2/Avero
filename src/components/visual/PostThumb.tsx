import type { ReactNode } from "react";
import { Icon } from "@/components/visual/Icon";
import { formatCompact } from "@/lib/format";
import type { Platform } from "@/lib/types";
import { seededPick, thumbColors } from "@/lib/visual";

/** Quatre « scènes » abstraites (viewBox 90 × 160) qui évoquent une vidéo sans en être une. */
function Scene({ variant }: { variant: number }) {
  switch (variant) {
    case 0: // Soleil couchant sur des collines
      return (
        <>
          <circle cx="62" cy="58" r="22" fill="white" fillOpacity="0.35" />
          <path d="M0 112 C 20 96, 40 100, 58 108 S 80 118, 90 104 V160 H0Z" fill="black" fillOpacity="0.18" />
          <path d="M0 128 C 24 114, 46 122, 64 128 S 84 132, 90 124 V160 H0Z" fill="black" fillOpacity="0.22" />
        </>
      );
    case 1: // Ondes concentriques
      return (
        <g fill="none" stroke="white" strokeOpacity="0.28" strokeWidth="2">
          <circle cx="30" cy="70" r="14" />
          <circle cx="30" cy="70" r="28" />
          <circle cx="30" cy="70" r="44" />
          <circle cx="30" cy="70" r="62" />
        </g>
      );
    case 2: // Rayures diagonales
      return (
        <g fill="white" fillOpacity="0.16">
          <path d="M-20 60 L60 -20 L74 -6 L-6 74Z" />
          <path d="M-20 104 L100 -16 L114 -2 L-6 118Z" />
          <path d="M10 160 L110 60 L124 74 L24 174Z" />
        </g>
      );
    default: // Formes souples
      return (
        <>
          <ellipse cx="24" cy="44" rx="30" ry="26" fill="white" fillOpacity="0.22" />
          <ellipse cx="72" cy="96" rx="26" ry="34" fill="black" fillOpacity="0.14" />
          <rect x="20" y="86" width="26" height="26" rx="8" fill="white" fillOpacity="0.25" transform="rotate(18 33 99)" />
        </>
      );
  }
}

/**
 * Vignette 9:16 qui imite une vidéo : dégradé et formes tirés de `seed`, pseudo en haut, vues en bas.
 * `views` peut être remplacé par un élément animé (`viewsSlot`).
 */
export function PostThumb({
  seed,
  views,
  handle,
  platform,
  viewsSlot,
  badge,
  className = "",
}: {
  seed: string;
  views?: number;
  handle?: string;
  platform?: Platform;
  viewsSlot?: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  const [from, to] = thumbColors(seed);
  return (
    <div
      className={`relative isolate aspect-[9/16] overflow-hidden rounded-2xl text-white shadow-[0_24px_50px_-20px_rgba(15,16,48,0.55)] ${className}`}
      style={{ backgroundImage: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      <svg aria-hidden viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 size-full">
        <Scene variant={seededPick(seed, 4)} />
      </svg>
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="flex h-full flex-col justify-between p-2.5 sm:p-3">
        <div className="flex items-center justify-between gap-2">
          {handle ? (
            <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium sm:text-[11px]">
              <span aria-hidden className="size-4 shrink-0 rounded-full border border-white/60 bg-white/30" />
              <span className="truncate">{handle}</span>
            </span>
          ) : (
            <span />
          )}
          {platform && <Icon name={platform === "INSTAGRAM" ? "instagram" : "tiktok"} className="size-3.5 shrink-0 opacity-90" />}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          {badge}
          {(viewsSlot !== undefined || views !== undefined) && (
            <span className="display flex items-center gap-1 text-base font-bold sm:text-xl">
              <Icon name="play" className="size-3 sm:size-3.5" />
              {viewsSlot ?? formatCompact(views ?? 0)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
