import { Suspense } from "react";
import { SpaceLoading } from "@/components/SpaceLayout";
import { NetworkCard } from "@/components/creator/NetworkCard";
import { getCreatorDashboard } from "@/lib/data/creators";
import { networkMessage } from "@/lib/network-messages";
import { requireRole } from "@/lib/session";
import type { Platform } from "@/lib/types";

const PLATFORMS: Platform[] = ["INSTAGRAM", "TIKTOK"];

const TONES = {
  success: "bg-tiktok/15 text-ink",
  error: "bg-danger/10 text-danger",
  info: "bg-cobalt/10 text-ink",
};

export default function NetworksPage({ searchParams }: PageProps<"/createur/reseaux">) {
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="display text-3xl font-extrabold sm:text-4xl">Mes réseaux</h1>
        <p className="max-w-[60ch] text-muted">
          Tes statistiques sont lues directement sur Instagram et TikTok. Elles se mettent à jour quand
          tu ouvres ton tableau de bord, ou quand tu cliques sur « Actualiser ».
        </p>
      </header>
      {/* Session et ?error= / ?success= : lus dans des Suspense (règle Next 16). */}
      <Suspense fallback={null}>
        <Message searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<SpaceLoading />}>
        <Networks />
      </Suspense>
    </>
  );
}

async function Networks() {
  const user = await requireRole("CREATOR");
  const dashboard = await getCreatorDashboard(user.id);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {PLATFORMS.map((platform) => (
        <NetworkCard
          key={platform}
          platform={platform}
          network={dashboard?.networks.find((n) => n.platform === platform)}
        />
      ))}
    </div>
  );
}

async function Message({ searchParams }: Pick<PageProps<"/createur/reseaux">, "searchParams">) {
  const message = networkMessage(await searchParams);
  if (!message) return null;
  return (
    <p role={message.tone === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 ${TONES[message.tone]}`}>
      {message.text}
    </p>
  );
}
