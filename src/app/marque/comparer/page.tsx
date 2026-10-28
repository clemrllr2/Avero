import Link from "next/link";
import { Suspense } from "react";
import { CompareTable } from "@/components/brand/CompareTable";
import { SpaceLoading } from "@/components/SpaceLayout";
import { UpgradeNotice } from "@/components/ui/UpgradeNotice";
import { Icon } from "@/components/visual/Icon";
import { PageHero } from "@/components/visual/PageHero";
import { parseCompareIds } from "@/lib/compare";
import { getCreatorsForComparison } from "@/lib/data/creators";
import { canAccess } from "@/lib/plans";
import { requireRole } from "@/lib/session";

export default function ComparePage({ searchParams }: PageProps<"/marque/comparer">) {
  return (
    <>
      <Link href="/marque" className="inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-ink">
        <Icon name="arrow-right" className="size-4 rotate-180" />
        Tous les créateurs
      </Link>
      <PageHero
        leading={
          <span aria-hidden className="grid size-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-cobalt via-violet to-instagram">
            <Icon name="chart" className="size-7" />
          </span>
        }
        title="Comparer"
        subtitle={<p>De 2 à 4 créateurs côte à côte, sur les mêmes indicateurs.</p>}
      />
      {/* Session et ?ids= : lus dans un Suspense (règle Next 16). */}
      <Suspense fallback={<SpaceLoading />}>
        <Comparison searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Comparison({ searchParams }: Pick<PageProps<"/marque/comparer">, "searchParams">) {
  const user = await requireRole("BRAND");
  const plan = user.plan ?? "FREE";

  // Sans PREMIUM : aucune donnée n'est chargée.
  if (!canAccess(plan, "compare")) {
    return (
      <UpgradeNotice requiredPlan="PREMIUM">
        La comparaison de 2 à 4 créateurs côte à côte est disponible avec le plan Premium.
      </UpgradeNotice>
    );
  }

  const creators = await getCreatorsForComparison(plan, parseCompareIds((await searchParams).ids));
  if (creators.length < 2) {
    return (
      <p className="rounded-[28px] border border-line bg-surface p-8 text-muted">
        Sélectionnez 2 à 4 créateurs dans la{" "}
        <Link href="/marque" className="font-semibold text-cobalt underline-offset-4 hover:underline">
          liste des créateurs
        </Link>{" "}
        pour les comparer.
      </p>
    );
  }
  return <CompareTable creators={creators} />;
}
