import Link from "next/link";
import { Suspense } from "react";
import { CompareTable } from "@/components/brand/CompareTable";
import { SpaceLoading } from "@/components/SpaceLayout";
import { UpgradeNotice } from "@/components/ui/UpgradeNotice";
import { parseCompareIds } from "@/lib/compare";
import { getCreatorsForComparison } from "@/lib/data/creators";
import { canAccess } from "@/lib/plans";
import { requireRole } from "@/lib/session";

export default function ComparePage({ searchParams }: PageProps<"/marque/comparer">) {
  return (
    <>
      <header className="flex flex-col gap-2">
        <Link href="/marque" className="w-fit text-sm text-muted hover:text-ink">
          ← Tous les créateurs
        </Link>
        <h1 className="display text-3xl font-extrabold sm:text-4xl">Comparer</h1>
      </header>
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
      <p className="rounded-2xl border border-line bg-surface p-8 text-muted">
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
