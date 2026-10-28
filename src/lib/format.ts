const numberFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 });
const percentFormat = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Paris",
});

export function formatNumber(n: number): string {
  return numberFormat.format(n);
}

/** 12 345 → « 12,3 k » ; 1 200 000 → « 1,2 M ». */
export function formatCompact(n: number): string {
  return compactFormat.format(n);
}

export function formatPercent(rate: number | null): string {
  return rate === null ? "—" : percentFormat.format(rate);
}

export function formatGrowth(n: number | null): string {
  if (n === null) return "Données insuffisantes";
  return n > 0 ? `+${formatNumber(n)}` : formatNumber(n);
}

export function formatDate(d: Date): string {
  return dateFormat.format(d);
}
