"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Palette validée (skill dataviz) : cobalt, ambre, gris neutre pour « Non précisé ». Les libellés sont toujours affichés.
const COLORS = ["#3b46f1", "#e8890c", "#9a9db0"];

/** Répartition par genre en anneau, avec la légende chiffrée à côté. */
export function GenderDonut({ items }: { items: { label: string; percent: number }[] }) {
  return (
    <div className="flex items-center gap-5">
      <div
        role="img"
        aria-label={`Genre : ${items.map((i) => `${i.label} ${i.percent} %`).join(", ")}`}
        className="relative size-32 shrink-0"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="percent"
              nameKey="label"
              innerRadius="64%"
              outerRadius="100%"
              paddingAngle={3}
              cornerRadius={6}
              stroke="#ffffff"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {items.map((item, i) => (
                <Cell key={item.label} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} %`, name]}
              contentStyle={{ borderRadius: 14, borderColor: "#e8e9f0", fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col gap-2 text-sm" aria-hidden>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-muted">{item.label}</span>
            <span className="font-semibold tabular-nums">{item.percent} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
