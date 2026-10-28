import { Suspense } from "react";
import { CreatorStats } from "@/components/creator/CreatorStats";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCreatorDashboard } from "@/lib/data/creators";
import { formatDate } from "@/lib/format";
import { requireRole } from "@/lib/session";
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
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="display text-3xl font-extrabold sm:text-4xl">Bonjour {firstName}</h1>
          {dashboard.lastSyncedAt && (
            <p className="text-muted">Mis à jour le {formatDate(dashboard.lastSyncedAt)}</p>
          )}
        </div>
        <ButtonLink href="/createur/reseaux" variant="secondary">
          Gérer mes réseaux
        </ButtonLink>
      </header>
      <CreatorStats dashboard={dashboard} now={new Date()} />
    </>
  );
}
