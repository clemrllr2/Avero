import type { CreatorRow } from "@/lib/creator-query";
import type { Platform } from "@/lib/types";

export const CSV_HEADERS = [
  "Créateur",
  "Réseaux",
  "Vues (30 j)",
  "Abonnés",
  "Vues moyennes",
  "Taux d'engagement",
  "Publications (30 j)",
  "Évolution abonnés (30 j)",
  "Mis à jour le",
] as const;

const PLATFORM_NAMES: Record<Platform, string> = { INSTAGRAM: "Instagram", TIKTOK: "TikTok" };

const percent = new Intl.NumberFormat("fr-FR", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
const day = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris" });

/** Entoure de guillemets une valeur contenant ; " ou un retour à la ligne (guillemets doublés). */
function cell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[;"\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function round(n: number | null | undefined): number | null | undefined {
  return typeof n === "number" ? Math.round(n) : n;
}

/** CSV pour Excel en français : séparateur « ; », BOM UTF-8, une ligne par créateur. */
export function toCsv(rows: CreatorRow[]): string {
  const lines = rows.map((r) =>
    [
      r.displayName,
      r.platforms.map((p) => PLATFORM_NAMES[p]).join(", "),
      r.views30d,
      r.followers,
      round(r.avgViewsPerPost),
      typeof r.engagementRate === "number" ? percent.format(r.engagementRate).replace(/ | /g, " ") : null,
      r.posts30d,
      r.followerGrowth30d,
      day.format(r.lastSyncedAt),
    ]
      .map(cell)
      .join(";"),
  );
  return `﻿${[CSV_HEADERS.join(";"), ...lines].join("\r\n")}`;
}
