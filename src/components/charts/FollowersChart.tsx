"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import type { FollowersPoint } from "@/lib/charts";
import { formatCompact, formatNumber } from "@/lib/format";
import type { Platform } from "@/lib/types";

const MUTED = "#5e6178";
const GRID = "#e8e9f0";

// Couleurs validées (skill dataviz) ; TikTok en pointillés comme second repère pour le daltonisme.
const SERIES: Record<Platform, { color: string; dash?: string }> = {
  INSTAGRAM: { color: "#d6336c" },
  TIKTOK: { color: "#0e9f9a", dash: "6 4" },
};

const dayLabel = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const formatDay = (iso: string) => dayLabel.format(new Date(`${iso}T00:00:00Z`));

/** Abonnés dans le temps, une courbe par réseau, sur une seule échelle. */
export function FollowersChart({ data, platforms }: { data: FollowersPoint[]; platforms: Platform[] }) {
  return (
    <div className="flex flex-col gap-3">
      {platforms.length > 1 && (
        <ul className="flex gap-5 text-sm text-muted" aria-label="Légende">
          {platforms.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <svg width="22" height="8" aria-hidden>
                <line
                  x1="1"
                  y1="4"
                  x2="21"
                  y2="4"
                  stroke={SERIES[p].color}
                  strokeWidth="2"
                  strokeDasharray={SERIES[p].dash}
                  strokeLinecap="round"
                />
              </svg>
              {PLATFORM_NAMES[p]}
            </li>
          ))}
        </ul>
      )}
      <div role="img" aria-label="Évolution des abonnés par réseau" className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              {platforms.map((p) => (
                <linearGradient key={p} id={`followers-${p}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIES[p].color} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={SERIES[p].color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 4" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDay}
              tickLine={false}
              axisLine={false}
              tick={{ fill: MUTED, fontSize: 12 }}
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: MUTED, fontSize: 12 }}
              tickFormatter={(v: number) => formatCompact(v)}
              width={52}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value, name) => [formatNumber(Number(value)), PLATFORM_NAMES[name as Platform] ?? name]}
              labelFormatter={(label) => formatDay(String(label))}
              contentStyle={{ borderRadius: 14, borderColor: GRID, fontSize: 13, boxShadow: "0 12px 30px -12px rgba(25,25,52,0.25)" }}
            />
            {platforms.map((p) => (
              <Area
                key={p}
                type="monotone"
                dataKey={p}
                stroke={SERIES[p].color}
                fill={`url(#followers-${p})`}
                strokeWidth={2}
                strokeDasharray={SERIES[p].dash}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                connectNulls
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
