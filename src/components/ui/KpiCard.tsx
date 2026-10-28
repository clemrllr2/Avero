/** Un chiffre clé : grand nombre en Archivo élargi, libellé en dessous, précision facultative. */
export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "muted";
}) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-ink/10 pl-4">
      <span
        className={
          tone === "muted"
            ? "display text-[18px] leading-tight font-semibold text-muted"
            : "display text-[28px] leading-tight font-bold sm:text-[32px]"
        }
      >
        {value}
      </span>
      <span className="text-sm text-muted">{label}</span>
      {hint && <span className="text-xs text-muted/80">{hint}</span>}
    </div>
  );
}
