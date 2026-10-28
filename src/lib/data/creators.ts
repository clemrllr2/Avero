import { buildDashboard, buildFullRow, type CreatorDashboard } from "@/lib/aggregate";
import { queryCreatorRows, type CreatorListQuery, type CreatorRow } from "@/lib/creator-query";
import { generateMockCreators } from "@/lib/data/mock/generate";
import { canAccess } from "@/lib/plans";
import type { CreatorSource, Plan } from "@/lib/types";

// Phase A : données de démonstration. La phase B remplacera loadSources par Prisma.
async function loadSources(): Promise<CreatorSource[]> {
  return generateMockCreators(new Date()).filter((c) => c.networks.length > 0);
}

async function findSource(creatorId: string): Promise<CreatorSource | null> {
  return (await loadSources()).find((c) => c.creatorId === creatorId) ?? null;
}

export async function getCreatorDashboard(creatorId: string): Promise<CreatorDashboard | null> {
  const source = await findSource(creatorId);
  return source ? buildDashboard(source, new Date()) : null;
}

export async function listCreatorsForBrand(plan: Plan, query: CreatorListQuery): Promise<CreatorRow[]> {
  const now = new Date();
  const rows = (await loadSources()).map((s) => buildFullRow(s, now));
  return queryCreatorRows(rows, plan, query);
}

export async function getCreatorDetailForBrand(
  plan: Plan,
  creatorId: string,
): Promise<CreatorDashboard | null> {
  if (!canAccess(plan, "creatorDetail")) return null;
  return getCreatorDashboard(creatorId);
}

export const MAX_COMPARED = 4;

export async function getCreatorsForComparison(plan: Plan, ids: string[]): Promise<CreatorDashboard[]> {
  if (!canAccess(plan, "compare")) return [];
  const sources = await loadSources();
  const now = new Date();
  return [...new Set(ids)]
    .map((id) => sources.find((s) => s.creatorId === id))
    .filter((s): s is CreatorSource => s !== undefined)
    .slice(0, MAX_COMPARED)
    .map((s) => buildDashboard(s, now));
}
