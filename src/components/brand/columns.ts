import type { IconName } from "@/components/visual/Icon";
import type { CreatorListQuery, CreatorRow, ListView } from "@/lib/creator-query";
import { listHref } from "@/lib/creator-query";
import { formatCompact, formatGrowth, formatNumber, formatPercent } from "@/lib/format";
import type { SortKey } from "@/lib/plans";

/** Indicateurs de la liste des marques : libellé, icône, couleur et rendu (partagés par les cartes et le tableau). */
export const COLUMNS: { key: SortKey; label: string; icon: IconName; color: string; render: (r: CreatorRow) => string }[] = [
  { key: "views30d", label: "Vues (30 j)", icon: "eye", color: "#3b46f1", render: (r) => formatCompact(r.views30d) },
  {
    key: "followers",
    label: "Abonnés",
    icon: "users",
    color: "#7c5cff",
    render: (r) => (r.followers === undefined ? "" : formatCompact(r.followers)),
  },
  {
    key: "avgViewsPerPost",
    label: "Vues moy.",
    icon: "play",
    color: "#2f7fe0",
    render: (r) => (r.avgViewsPerPost == null ? "—" : formatCompact(r.avgViewsPerPost)),
  },
  {
    key: "engagementRate",
    label: "Engagement",
    icon: "heart",
    color: "#d6336c",
    render: (r) => formatPercent(r.engagementRate ?? null),
  },
  {
    key: "posts30d",
    label: "Publications",
    icon: "grid",
    color: "#e8890c",
    render: (r) => (r.posts30d === undefined ? "" : formatNumber(r.posts30d)),
  },
  {
    key: "followerGrowth30d",
    label: "Évolution",
    icon: "trend",
    color: "#0e9f9a",
    render: (r) => (r.followerGrowth30d === null ? "—" : formatGrowth(r.followerGrowth30d ?? null)),
  },
];

/** Taux d'engagement qui remplit la jauge : 10 % et plus. */
export const FULL_ENGAGEMENT = 0.1;

/** Lien de tri sur un indicateur : inverse l'ordre si l'indicateur est déjà trié en décroissant. */
export function sortHref(query: CreatorListQuery, view: ListView, key: SortKey): string {
  return listHref({ ...query, view }, { sort: key, order: query.sort === key && query.order === "desc" ? "asc" : "desc" });
}
