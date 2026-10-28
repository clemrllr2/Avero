"use client";

import { useState } from "react";
import { KpiGrid, type KpiSparks } from "@/components/creator/KpiGrid";
import { Icon } from "@/components/visual/Icon";
import { PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import type { CreatorKpis, Platform } from "@/lib/types";

type Tab = "ALL" | Platform;

/** Onglets « Tous / Instagram / TikTok » au-dessus de la grille de KPI. */
export function KpiTabs({
  all,
  byPlatform,
  sparks = {},
}: {
  all: CreatorKpis;
  byPlatform: Partial<Record<Platform, CreatorKpis>>;
  /** Mini-courbes de chaque onglet */
  sparks?: Partial<Record<Tab, KpiSparks>>;
}) {
  const platforms = Object.keys(byPlatform) as Platform[];
  const [tab, setTab] = useState<Tab>("ALL");
  const tabs: { value: Tab; label: string; icon: "sparkle" | "instagram" | "tiktok" }[] = [
    { value: "ALL", label: "Tous les réseaux", icon: "sparkle" },
    ...platforms.map((p) => ({ value: p, label: PLATFORM_NAMES[p], icon: p === "INSTAGRAM" ? ("instagram" as const) : ("tiktok" as const) })),
  ];
  const kpis = tab === "ALL" ? all : (byPlatform[tab] ?? all);

  return (
    <div className="flex flex-col gap-5">
      {platforms.length > 1 && (
        <div role="tablist" aria-label="Réseau affiché" className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === t.value ? "bg-night text-paper" : "text-muted hover:text-ink"
              }`}
            >
              <Icon name={t.icon} className="size-4" />
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div role={platforms.length > 1 ? "tabpanel" : undefined}>
        <KpiGrid kpis={kpis} sparks={sparks[tab]} />
      </div>
    </div>
  );
}
