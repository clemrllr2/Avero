"use client";

import { useEffect, useState } from "react";
import { formatCompact } from "@/lib/format";
import type { Platform } from "@/lib/types";

interface Frame {
  handle: string;
  platform: Platform;
  views: number;
  fill: string;
  offset: string;
}

const FRAMES: Frame[] = [
  { handle: "@lea.martin", platform: "TIKTOK", views: 1_240_000, fill: "bg-tiktok", offset: "mt-10" },
  { handle: "@hugo.cuisine", platform: "INSTAGRAM", views: 386_000, fill: "bg-instagram", offset: "" },
  { handle: "@ines.danse", platform: "TIKTOK", views: 2_870_000, fill: "bg-cobalt", offset: "mt-20" },
];

const DURATION_MS = 1400;

/** Compteurs de vues qui montent une seule fois au chargement (désactivé si l'utilisateur limite les animations). */
function useCountUp(target: number): number {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return value;
}

function VideoFrame({ frame, verified }: { frame: Frame; verified?: boolean }) {
  const views = useCountUp(frame.views);
  return (
    <figure
      className={`relative aspect-[9/16] w-full overflow-hidden rounded-[14px] ${frame.fill} ${frame.offset}`}
    >
      <figcaption className="absolute inset-0 flex flex-col justify-between p-3 text-white">
        <span className="text-xs font-medium opacity-90">{frame.handle}</span>
        <span className="flex flex-col items-start gap-1.5">
          {verified && (
            <span className="rounded-md bg-signal px-1.5 py-0.5 text-[11px] font-semibold text-ink">
              Lu sur {frame.platform === "TIKTOK" ? "TikTok" : "Instagram"}
            </span>
          )}
          <span className="display flex items-center gap-1 text-lg font-bold sm:text-xl">
            <span aria-hidden className="text-xs">▶</span>
            {formatCompact(views)}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function ViewCounterFrames() {
  return (
    <div className="grid grid-cols-3 items-start gap-3 sm:gap-4" aria-label="Exemples de publications avec leur nombre de vues">
      {FRAMES.map((frame, i) => (
        <VideoFrame key={frame.handle} frame={frame} verified={i === 2} />
      ))}
    </div>
  );
}
