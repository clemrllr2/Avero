import { Suspense } from "react";
import { CreatorStats } from "@/components/creator/CreatorStats";
import { CountUp } from "@/components/motion/CountUp";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PLATFORM_ICONS, PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { Avatar } from "@/components/visual/Avatar";
import { Icon } from "@/components/visual/Icon";
import { PageHero } from "@/components/visual/PageHero";
import { getCreatorDashboard } from "@/lib/data/creators";
import { formatDate } from "@/lib/format";
import { requireRole } from "@/lib/session";
import { syncStaleConnections } from "@/lib/sync/sync";
import { SpaceLoading } from "@/components/SpaceLayout";

export default function CreatorDashboardPage() {
  // Données liées à la session : chargées dans un Suspense (règle Next 16).
  return (
    <Suspense fallback={<SpaceLoading />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireRole("CREATOR");
  // Données de plus de 24 h : mises à jour avant l'affichage.
  await syncStaleConnections(user.profileId);
  const dashboard = await getCreatorDashboard(user.profileId);
  const firstName = user.name.split(" ")[0];

  if (!dashboard || dashboard.networks.length === 0) {
    return (
      <EmptyState
        title={`Bienvenue ${firstName}`}
        action={<ButtonLink href="/createur/reseaux">Connecter un réseau</ButtonLink>}
      >
        Relie Instagram ou TikTok pour voir tes vues, tes abonnés, ton engagement et ton audience.
      </EmptyState>
    );
  }

  return (
    <>
      <PageHero
        leading={<Avatar name={user.name} size="xl" ring />}
        title={`Bonjour ${firstName}`}
        subtitle={dashboard.lastSyncedAt && <p>Mis à jour le {formatDate(dashboard.lastSyncedAt)}</p>}
        aside={
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="flex flex-col lg:items-end">
              <CountUp
                value={dashboard.kpis.views30d}
                className="display text-gradient text-[48px] leading-none font-extrabold sm:text-[60px]"
              />
              <span className="text-sm text-paper/70">vues sur 30 jours</span>
            </p>
            <ButtonLink href="/createur/reseaux" variant="light" className="px-4 py-2.5 text-sm">
              <Icon name="link" className="size-4" />
              Gérer mes réseaux
            </ButtonLink>
          </div>
        }
      >
        <ul className="mt-2 flex flex-wrap gap-2">
          {dashboard.networks.map((n) => (
            <li key={n.platform} className="glass flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm">
              <span
                aria-hidden
                className={`grid size-6 place-items-center rounded-full ${n.platform === "INSTAGRAM" ? "bg-instagram" : "bg-tiktok"}`}
              >
                <Icon name={PLATFORM_ICONS[n.platform]} className="size-3.5" />
              </span>
              <span className="sr-only">{PLATFORM_NAMES[n.platform]} :</span>@{n.username}
            </li>
          ))}
        </ul>
      </PageHero>
      <CreatorStats dashboard={dashboard} now={new Date()} />
    </>
  );
}
