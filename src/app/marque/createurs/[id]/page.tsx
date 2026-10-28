import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CreatorStats } from "@/components/creator/CreatorStats";
import { SpaceLoading } from "@/components/SpaceLayout";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { UpgradeNotice } from "@/components/ui/UpgradeNotice";
import { getCreatorDetailForBrand } from "@/lib/data/creators";
import { formatDate } from "@/lib/format";
import { canAccess } from "@/lib/plans";
import { requireRole } from "@/lib/session";

export default function CreatorDetailPage({ params }: PageProps<"/marque/createurs/[id]">) {
  return (
    <>
      <Link href="/marque" className="w-fit text-sm text-muted hover:text-ink">
        ← Tous les créateurs
      </Link>
      {/* Session et identifiant de l'adresse : lus dans un Suspense (règle Next 16). */}
      <Suspense fallback={<SpaceLoading />}>
        <CreatorDetail params={params} />
      </Suspense>
    </>
  );
}

async function CreatorDetail({ params }: Pick<PageProps<"/marque/createurs/[id]">, "params">) {
  const user = await requireRole("BRAND");
  const plan = user.plan ?? "FREE";

  // Sans PREMIUM : aucune donnée n'est chargée.
  if (!canAccess(plan, "creatorDetail")) {
    return (
      <UpgradeNotice requiredPlan="PREMIUM">
        La fiche détaillée d&apos;un créateur (publications, graphiques, audience) est disponible avec le
        plan Premium.
      </UpgradeNotice>
    );
  }

  const { id } = await params;
  const dashboard = await getCreatorDetailForBrand(plan, id);
  if (!dashboard) notFound();

  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="display text-3xl font-extrabold sm:text-4xl">{dashboard.displayName}</h1>
        <div className="flex flex-wrap items-center gap-3">
          {dashboard.networks.map((n) => (
            <span key={n.platform} className="flex items-center gap-2 text-sm text-muted">
              <PlatformBadge platform={n.platform} />@{n.username}
            </span>
          ))}
          {dashboard.lastSyncedAt && (
            <span className="text-sm text-muted">Mis à jour le {formatDate(dashboard.lastSyncedAt)}</span>
          )}
        </div>
      </header>
      <CreatorStats dashboard={dashboard} now={new Date()} />
    </>
  );
}
