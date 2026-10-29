import Link from "next/link";
import { Suspense } from "react";
import { CreatorsTable } from "@/components/brand/CreatorsTable";
import { BrandOverview } from "@/components/brand/BrandOverview";
import { FilterPills } from "@/components/brand/FilterPills";
import { SpaceLoading } from "@/components/SpaceLayout";
import { buttonClass } from "@/components/ui/Button";
import { UpgradeNotice } from "@/components/ui/UpgradeNotice";
import { Icon } from "@/components/visual/Icon";
import { PageHero } from "@/components/visual/PageHero";
import { listOverview } from "@/lib/brand-overview";
import { effectiveQuery, listHref, parseListQuery, parseView, type ListView } from "@/lib/creator-query";
import { listCreatorsForBrand } from "@/lib/data/creators";
import { PLAN_LABELS, allowedSortKeys, canAccess } from "@/lib/plans";
import { requireRole } from "@/lib/session";

const VIEWS: { value: ListView; label: string; icon: "grid" | "chart" }[] = [
  { value: "cartes", label: "Cartes", icon: "grid" },
  { value: "tableau", label: "Tableau", icon: "chart" },
];

export default function BrandCreatorsPage({ searchParams }: PageProps<"/marque">) {
  return (
    <>
      <PageHero
        leading={
          <span aria-hidden className="grid size-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-cobalt via-violet to-instagram">
            <Icon name="users" className="size-7" />
          </span>
        }
        title="Créateurs"
        subtitle={<p>Statistiques lues directement sur Instagram et TikTok, sur les 30 derniers jours.</p>}
      />
      {/* Session et filtres de l'adresse : lus dans un Suspense (règle Next 16). */}
      <Suspense fallback={<SpaceLoading />}>
        <CreatorsList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function CreatorsList({ searchParams }: Pick<PageProps<"/marque">, "searchParams">) {
  const user = await requireRole("BRAND");
  const plan = user.plan ?? "FREE";
  const params = await searchParams;
  // Requête réellement appliquée (une adresse bricolée par une marque Free est ramenée à son plan).
  const query = effectiveQuery(plan, parseListQuery(params));
  const view = parseView(params);
  const rows = await listCreatorsForBrand(plan, query);
  const premium = canAccess(plan, "compare");
  const filters = canAccess(plan, "filters");

  return (
    <>
      {params.success === "plan" && (
        <p role="status" className="flex items-center gap-3 rounded-2xl border border-tiktok/25 bg-tiktok/10 px-4 py-3">
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-xl bg-tiktok text-white">
            <Icon name="check" className="size-4" />
          </span>
          Vous êtes maintenant sur le plan {PLAN_LABELS[plan].name}.
        </p>
      )}
      <FilterPills query={query} view={view} allowed={filters} />
      {!filters && (
        <UpgradeNotice requiredPlan="BASIC">
          Avec Basic : abonnés, engagement, évolution, et filtres par réseau et nombre d&apos;abonnés.
        </UpgradeNotice>
      )}
      <BrandOverview overview={listOverview(rows)} engagementAllowed={canAccess(plan, "engagementRate")} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Affichage" className="flex gap-1 rounded-full border border-line bg-surface p-1">
          {VIEWS.map((v) => (
            <Link
              key={v.value}
              href={listHref({ ...query, view }, { view: v.value })}
              scroll={false}
              aria-current={view === v.value ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                view === v.value ? "bg-night text-paper" : "text-muted hover:text-ink"
              }`}
            >
              <Icon name={v.icon} className="size-4" />
              {v.label}
            </Link>
          ))}
        </nav>
        {canAccess(plan, "exportCsv") && (
          <a href="/marque/export" download className={buttonClass("secondary", "px-4 py-2.5 text-sm")}>
            <Icon name="arrow-down" className="size-4" />
            Exporter en CSV
          </a>
        )}
      </div>
      <CreatorsTable rows={rows} query={query} sortable={allowedSortKeys(plan)} premium={premium} view={view} />
      {!premium && (
        <UpgradeNotice requiredPlan="PREMIUM">
          Avec Premium : fiche détaillée de chaque créateur, graphiques, audience, comparaison et export CSV.
        </UpgradeNotice>
      )}
    </>
  );
}
