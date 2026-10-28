import { Suspense } from "react";
import { CreatorsTable } from "@/components/brand/CreatorsTable";
import { FiltersBar } from "@/components/brand/FiltersBar";
import { SpaceLoading } from "@/components/SpaceLayout";
import { buttonClass } from "@/components/ui/Button";
import { UpgradeNotice } from "@/components/ui/UpgradeNotice";
import { effectiveQuery, parseListQuery } from "@/lib/creator-query";
import { listCreatorsForBrand } from "@/lib/data/creators";
import { PLAN_LABELS, allowedSortKeys, canAccess } from "@/lib/plans";
import { requireRole } from "@/lib/session";

export default function BrandCreatorsPage({ searchParams }: PageProps<"/marque">) {
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="display text-3xl font-extrabold sm:text-4xl">Créateurs</h1>
        <p className="max-w-[60ch] text-muted">
          Statistiques lues directement sur Instagram et TikTok, sur les 30 derniers jours.
        </p>
      </header>
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
  const rows = await listCreatorsForBrand(plan, query);
  const premium = canAccess(plan, "compare");

  return (
    <>
      {params.success === "plan" && (
        <p role="status" className="rounded-xl bg-tiktok/15 px-4 py-3">
          Vous êtes maintenant sur le plan {PLAN_LABELS[plan].name}.
        </p>
      )}
      {canAccess(plan, "filters") ? (
        <FiltersBar query={query} />
      ) : (
        <UpgradeNotice requiredPlan="BASIC">
          Avec Basic : abonnés, engagement, évolution, et filtres par réseau et nombre d&apos;abonnés.
        </UpgradeNotice>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {rows.length} créateur{rows.length > 1 ? "s" : ""}
        </p>
        {canAccess(plan, "exportCsv") && (
          <a href="/marque/export" download className={buttonClass("secondary", "px-4 py-2.5 text-sm")}>
            Exporter en CSV
          </a>
        )}
      </div>
      <CreatorsTable rows={rows} query={query} sortable={allowedSortKeys(plan)} premium={premium} />
      {!premium && (
        <UpgradeNotice requiredPlan="PREMIUM">
          Avec Premium : fiche détaillée de chaque créateur, graphiques, audience, comparaison et export CSV.
        </UpgradeNotice>
      )}
    </>
  );
}
