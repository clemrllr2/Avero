"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatNumber } from "@/lib/format";

const COBALT = "#3b46f1";
const VIOLET = "#7c5cff";
const MUTED = "#5e6178";
const GRID = "#e8e9f0";

/** Vues par semaine de publication (une seule série : pas de légende, le titre la nomme). */
export function ViewsChart({ data }: { data: { week: string; views: number }[] }) {
  const total = data.reduce((sum, w) => sum + w.views, 0);
  return (
    <div role="img" aria-label={`Vues par semaine sur 8 semaines, ${formatNumber(total)} au total`} className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -12 }} barCategoryGap={6}>
          <defs>
            <linearGradient id="views-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={VIOLET} />
              <stop offset="100%" stopColor={COBALT} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 4" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: MUTED, fontSize: 12 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: MUTED, fontSize: 12 }}
            tickFormatter={(v: number) => formatCompact(v)}
            width={52}
          />
          <Tooltip
            cursor={{ fill: "rgba(59,70,241,0.06)" }}
            formatter={(value) => [formatNumber(Number(value)), "Vues"]}
            labelFormatter={(label) => `Semaine du ${label}`}
            contentStyle={{ borderRadius: 14, borderColor: GRID, fontSize: 13, boxShadow: "0 12px 30px -12px rgba(25,25,52,0.25)" }}
          />
          <Bar dataKey="views" fill="url(#views-bar)" radius={[8, 8, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
