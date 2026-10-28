import { Icon, type IconName } from "@/components/visual/Icon";
import { RadialGauge } from "@/components/visual/RadialGauge";
import { Sparkline } from "@/components/visual/Sparkline";

/**
 * Un chiffre clé en tuile : icône dans la couleur du KPI, grand nombre, libellé,
 * et selon le cas une mini-courbe (`spark`), une jauge (`gauge`, 0 à 1) ou une flèche de tendance.
 */
export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
  color = "#3b46f1",
  spark,
  gauge,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "muted";
  icon?: IconName;
  color?: string;
  spark?: number[];
  gauge?: number | null;
  trend?: "up" | "down" | null;
}) {
  const hasSpark = spark !== undefined && spark.length > 1 && spark.some((v) => v > 0);
  return (
    <div
      className="relative flex min-h-[150px] flex-col gap-3 overflow-hidden rounded-3xl border border-line bg-surface p-5"
      style={{ backgroundImage: `radial-gradient(120% 90% at 100% 0%, ${color}14, transparent 60%)` }}
    >
      <div className="flex items-start justify-between gap-3">
        {icon && (
          <span aria-hidden className="grid size-10 place-items-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: color }}>
            <Icon name={icon} className="size-5" />
          </span>
        )}
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              trend === "up" ? "bg-[#12a150]/12 text-[#0d7a3c]" : "bg-danger/10 text-danger"
            }`}
          >
            <Icon name={trend === "up" ? "arrow-up" : "arrow-down"} className="size-3" />
            {trend === "up" ? "En hausse" : "En baisse"}
          </span>
        )}
        {gauge !== undefined && gauge !== null && (
          <RadialGauge value={gauge} size={52} color={color} track={`${color}22`} />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={
            tone === "muted"
              ? "display text-[20px] leading-tight font-semibold text-muted"
              : "display text-[28px] leading-none font-bold sm:text-[32px]"
          }
        >
          {value}
        </span>
        <span className="text-sm text-muted">{label}</span>
        {hint && <span className="text-xs text-muted/80">{hint}</span>}
      </div>
      {hasSpark && <Sparkline values={spark} color={color} className="-mx-5 mt-auto -mb-5 h-12 w-[calc(100%+2.5rem)]" />}
    </div>
  );
}
