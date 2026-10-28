"use client";

import { useState } from "react";
import { KpiGrid } from "@/components/creator/KpiGrid";
import { PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import type { CreatorKpis, Platform } from "@/lib/types";

type Tab = "ALL" | Platform;

/** Onglets « Tous / Instagram / TikTok » au-dessus de la grille de KPI. */
export function KpiTabs({
  all,
  byPlatform,
}: {
  all: CreatorKpis;
  byPlatform: Partial<Record<Platform, CreatorKpis>>;
}) {
  const platforms = Object.keys(byPlatform) as Platform[];
  const [tab, setTab] = useState<Tab>("ALL");
  const tabs: { value: Tab; label: string }[] = [
    { value: "ALL", label: "Tous les réseaux" },
    ...platforms.map((p) => ({ value: p, label: PLATFORM_NAMES[p] })),
  ];
  const kpis = tab === "ALL" ? all : (byPlatform[tab] ?? all);

  return (
    <div className="flex flex-col gap-8">
      {platforms.length > 1 && (
        <div role="tablist" aria-label="Réseau affiché" className="flex w-fit gap-1 rounded-2xl bg-ink/5 p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div role={platforms.length > 1 ? "tabpanel" : undefined}>
        <KpiGrid kpis={kpis} />
      </div>
    </div>
  );
}
