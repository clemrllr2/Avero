"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { COMPARE_COLORS } from "@/lib/compare";

export type RadarAxis = {
  label: string;
  /** Valeur de chaque créateur ramenée sur 100 (le meilleur = 100) */
  scores: number[];
  /** Valeur réelle affichée dans l'infobulle */
  display: string[];
};

/** Toile d'araignée : un polygone par créateur, chaque axe relatif au meilleur des créateurs comparés. */
export function CompareRadar({ names, axes }: { names: string[]; axes: RadarAxis[] }) {
  const data = axes.map((axis) => {
    const point: Record<string, string | number> = { axis: axis.label };
    names.forEach((_, i) => {
      point[`c${i}`] = axis.scores[i];
      point[`d${i}`] = axis.display[i];
    });
    return point;
  });

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Légende">
        {names.map((name, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: COMPARE_COLORS[i] }} />
            {name}
          </li>
        ))}
      </ul>
      <div
        role="img"
        aria-label={`Comparaison relative de ${names.join(", ")} sur ${axes.length} indicateurs ; le détail chiffré est dans le tableau ci-dessous`}
        className="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#e8e9f0" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#5e6178", fontSize: 12 }} />
            <Tooltip
              formatter={(_value, name, item) => {
                const i = Number(String(name).slice(1));
                return [String((item.payload as Record<string, string>)[`d${i}`]), names[i]];
              }}
              contentStyle={{ borderRadius: 14, borderColor: "#e8e9f0", fontSize: 13 }}
            />
            {names.map((_, i) => (
              <Radar
                key={i}
                dataKey={`c${i}`}
                name={`c${i}`}
                stroke={COMPARE_COLORS[i]}
                fill={COMPARE_COLORS[i]}
                fillOpacity={0.12}
                strokeWidth={2}
                dot={{ r: 3, fill: COMPARE_COLORS[i], stroke: "#ffffff", strokeWidth: 2 }}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
