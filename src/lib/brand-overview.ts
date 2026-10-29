import type { CreatorRow } from "@/lib/creator-query";
import type { Platform } from "@/lib/types";

const TOP = 10;

/** Chiffres de la vue d'ensemble, calculés sur la liste affichée (filtres compris). */
export interface ListOverview {
  count: number;
  totalViews: number;
  /** Moyenne des taux connus ; null si aucun (plan Free : le champ est retiré des lignes) */
  avgEngagement: number | null;
  /** Nombre de créateurs présents sur chaque réseau */
  platformCounts: Record<Platform, number>;
  /** Les 10 créateurs aux vues les plus élevées, quel que soit le tri de la liste */
  top: CreatorRow[];
}

export function listOverview(rows: CreatorRow[]): ListOverview {
  const rates = rows.map((r) => r.engagementRate).filter((v): v is number => typeof v === "number");
  return {
    count: rows.length,
    totalViews: rows.reduce((sum, r) => sum + r.views30d, 0),
    avgEngagement: rates.length === 0 ? null : rates.reduce((a, b) => a + b, 0) / rates.length,
    platformCounts: {
      INSTAGRAM: rows.filter((r) => r.platforms.includes("INSTAGRAM")).length,
      TIKTOK: rows.filter((r) => r.platforms.includes("TIKTOK")).length,
    },
    top: [...rows].sort((a, b) => b.views30d - a.views30d).slice(0, TOP),
  };
}
