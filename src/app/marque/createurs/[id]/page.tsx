import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CreatorStats } from "@/components/creator/CreatorStats";
import { SpaceLoading } from "@/components/SpaceLayout";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { UpgradeNotice } from "@/components/ui/UpgradeNotice";
import { Aurora } from "@/components/visual/Aurora";
import { Avatar } from "@/components/visual/Avatar";
import { Icon } from "@/components/visual/Icon";
import { getCreatorDetailForBrand } from "@/lib/data/creators";
import { formatDate } from "@/lib/format";
import { canAccess } from "@/lib/plans";
import { requireRole } from "@/lib/session";
import { avatarColors } from "@/lib/visual";

export default function CreatorDetailPage({ params }: PageProps<"/marque/createurs/[id]">) {
  return (
    <>
      <Link href="/marque" className="inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-ink">
        <Icon name="arrow-right" className="size-4 rotate-180" />
        Tous les créateurs
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
  const cover = avatarColors(dashboard.displayName);

  return (
    <>
      <section className="overflow-hidden rounded-[32px] border border-line bg-surface">
        <div
          aria-hidden
          className="relative isolate h-32 overflow-hidden sm:h-40"
          style={{ backgroundImage: `linear-gradient(120deg, ${cover[0]}, ${cover[1]})` }}
        >
          <div className="dot-grid absolute inset-0" />
          <Aurora className="opacity-60" />
        </div>
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar name={dashboard.displayName} size="xl" ring className="-mt-12 shadow-lg" />
            <div className="flex flex-col gap-2">
              <h1 className="display text-3xl font-extrabold sm:text-4xl">{dashboard.displayName}</h1>
              <div className="flex flex-wrap items-center gap-3">
                {dashboard.networks.map((n) => (
                  <span key={n.platform} className="flex items-center gap-2 text-sm text-muted">
                    <PlatformBadge platform={n.platform} />@{n.username}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {dashboard.lastSyncedAt && (
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Icon name="calendar" className="size-4" />
              Mis à jour le {formatDate(dashboard.lastSyncedAt)}
            </span>
          )}
        </div>
      </section>
      <CreatorStats dashboard={dashboard} now={new Date()} />
    </>
  );
}
