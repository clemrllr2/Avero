import type { FullCreatorRow } from "@/lib/aggregate";
import { SORT_KEYS, allowedSortKeys, canAccess, type Feature, type SortKey } from "@/lib/plans";
import type { CreatorKpis, Plan, Platform } from "@/lib/types";

export type CreatorRow = Pick<
  FullCreatorRow,
  "creatorId" | "displayName" | "avatarUrl" | "platforms" | "lastSyncedAt" | "views30d"
> &
  Partial<Omit<CreatorKpis, "views30d">> &
  Partial<Pick<FullCreatorRow, "viewsTrend">>;

/** Affichage de la liste des marques : cartes (par défaut) ou tableau. */
export type ListView = "cartes" | "tableau";

/** Tranches d'abonnés proposées en pastilles (bornes incluses). */
export const FOLLOWER_RANGES = [
  { key: "lt10k", label: "Moins de 10 k", max: 9_999 },
  { key: "10k-100k", label: "10 k à 100 k", min: 10_000, max: 99_999 },
  { key: "100k-1m", label: "100 k à 1 M", min: 100_000, max: 999_999 },
  { key: "gt1m", label: "Plus de 1 M", min: 1_000_000 },
] as const satisfies readonly { key: string; label: string; min?: number; max?: number }[];

export type FollowerRangeKey = (typeof FOLLOWER_RANGES)[number]["key"];

export interface CreatorListQuery {
  sort: SortKey;
  order: "asc" | "desc";
  platform?: Platform;
  minFollowers?: number;
  maxFollowers?: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

const DEFAULT_QUERY: CreatorListQuery = { sort: "views30d", order: "desc" };

/** KPI retirés de la ligne quand le plan n'y donne pas accès. */
const GATED_KPIS = ["followers", "avgViewsPerPost", "engagementRate", "posts30d", "followerGrowth30d"] as const;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCount(value: string | undefined): number | undefined {
  if (value === undefined || !/^\d+$/.test(value)) return undefined;
  return Number(value);
}

export function parseListQuery(params: SearchParams): CreatorListQuery {
  const sort = first(params.sort);
  const order = first(params.order);
  const platform = first(params.platform);
  const query: CreatorListQuery = {
    sort: SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : DEFAULT_QUERY.sort,
    order: order === "asc" || order === "desc" ? order : DEFAULT_QUERY.order,
  };
  if (platform === "INSTAGRAM" || platform === "TIKTOK") query.platform = platform;
  const minFollowers = parseCount(first(params.minFollowers));
  const maxFollowers = parseCount(first(params.maxFollowers));
  if (minFollowers !== undefined) query.minFollowers = minFollowers;
  if (maxFollowers !== undefined) query.maxFollowers = maxFollowers;
  return query;
}

export function stripForPlan(row: FullCreatorRow, plan: Plan): CreatorRow {
  const stripped: CreatorRow = { ...row };
  for (const kpi of GATED_KPIS) {
    if (!canAccess(plan, kpi satisfies Feature)) delete stripped[kpi];
  }
  if (!canAccess(plan, "charts")) delete stripped.viewsTrend;
  return stripped;
}

/** Lit ?vue= : « tableau » si demandé, « cartes » sinon. */
export function parseView(params: SearchParams): ListView {
  return first(params.vue) === "tableau" ? "tableau" : "cartes";
}

/** Tranche d'abonnés correspondant aux filtres : « all » sans borne, « custom » si les bornes ne sont pas une tranche proposée. */
export function followerRangeOf(query: CreatorListQuery): FollowerRangeKey | "all" | "custom" {
  if (query.minFollowers === undefined && query.maxFollowers === undefined) return "all";
  const range = FOLLOWER_RANGES.find(
    (r) => ("min" in r ? r.min : undefined) === query.minFollowers && ("max" in r ? r.max : undefined) === query.maxFollowers,
  );
  return range?.key ?? "custom";
}

type ListState = CreatorListQuery & { view?: ListView };

/** Adresse de la liste avec l'état courant modifié par `patch` (une valeur undefined retire le paramètre). */
export function listHref(state: ListState, patch: Partial<ListState>): string {
  const next = { ...state, ...patch };
  const params = new URLSearchParams();
  params.set("sort", next.sort);
  params.set("order", next.order);
  if (next.platform) params.set("platform", next.platform);
  if (next.minFollowers !== undefined) params.set("minFollowers", String(next.minFollowers));
  if (next.maxFollowers !== undefined) params.set("maxFollowers", String(next.maxFollowers));
  if (next.view === "tableau") params.set("vue", "tableau");
  return `/marque?${params}`;
}

function matchesFilters(row: FullCreatorRow, query: CreatorListQuery): boolean {
  if (query.platform && !row.platforms.includes(query.platform)) return false;
  if (query.minFollowers !== undefined && row.followers < query.minFollowers) return false;
  if (query.maxFollowers !== undefined && row.followers > query.maxFollowers) return false;
  return true;
}

/** Trie en plaçant toujours les valeurs null en fin de liste. */
function compareBy(sort: SortKey, order: "asc" | "desc") {
  return (a: FullCreatorRow, b: FullCreatorRow) => {
    const va = a[sort];
    const vb = b[sort];
    if (va === null && vb === null) return 0;
    if (va === null) return 1;
    if (vb === null) return -1;
    return order === "asc" ? va - vb : vb - va;
  };
}

/** La requête réellement appliquée : tri autorisé par le plan (sinon vues décroissantes), filtres seulement en BASIC+. */
export function effectiveQuery(plan: Plan, query: CreatorListQuery): CreatorListQuery {
  const sorted = allowedSortKeys(plan).includes(query.sort)
    ? { sort: query.sort, order: query.order }
    : { ...DEFAULT_QUERY };
  if (!canAccess(plan, "filters")) return sorted;
  return { ...query, ...sorted };
}

export function queryCreatorRows(
  rows: FullCreatorRow[],
  plan: Plan,
  query: CreatorListQuery,
): CreatorRow[] {
  const effective = effectiveQuery(plan, query);
  const filtered = rows.filter((r) => matchesFilters(r, effective));
  return [...filtered]
    .sort(compareBy(effective.sort, effective.order))
    .map((r) => stripForPlan(r, plan));
}
