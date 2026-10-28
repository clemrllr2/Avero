import { buildDashboard, buildFullRow, type CreatorDashboard } from "@/lib/aggregate";
import { MAX_COMPARED } from "@/lib/compare";
import { queryCreatorRows, type CreatorListQuery, type CreatorRow } from "@/lib/creator-query";
import { canAccess } from "@/lib/plans";
import type { CreatorSource, Plan } from "@/lib/types";

/** Charge les créateurs qui ont au moins un réseau relié (tous, ou seulement ceux demandés). */
export type CreatorSourceLoader = (where?: { creatorIds?: string[] }) => Promise<CreatorSource[]>;

/**
 * Les 4 fonctions de lecture des pages, indépendantes de l'endroit où sont stockées les données :
 * la base en production, les créateurs d'exemple dans les tests.
 */
export function createCreatorData(load: CreatorSourceLoader) {
  async function getCreatorDashboard(creatorId: string): Promise<CreatorDashboard | null> {
    const [source] = await load({ creatorIds: [creatorId] });
    return source ? buildDashboard(source, new Date()) : null;
  }

  async function listCreatorsForBrand(plan: Plan, query: CreatorListQuery): Promise<CreatorRow[]> {
    const now = new Date();
    const rows = (await load()).map((s) => buildFullRow(s, now));
    return queryCreatorRows(rows, plan, query);
  }

  async function getCreatorDetailForBrand(plan: Plan, creatorId: string): Promise<CreatorDashboard | null> {
    if (!canAccess(plan, "creatorDetail")) return null;
    return getCreatorDashboard(creatorId);
  }

  async function getCreatorsForComparison(plan: Plan, ids: string[]): Promise<CreatorDashboard[]> {
    if (!canAccess(plan, "compare")) return [];
    const unique = [...new Set(ids)];
    const sources = await load({ creatorIds: unique });
    const now = new Date();
    return unique
      .map((id) => sources.find((s) => s.creatorId === id))
      .filter((s): s is CreatorSource => s !== undefined)
      .slice(0, MAX_COMPARED)
      .map((s) => buildDashboard(s, now));
  }

  return { getCreatorDashboard, listCreatorsForBrand, getCreatorDetailForBrand, getCreatorsForComparison };
}
