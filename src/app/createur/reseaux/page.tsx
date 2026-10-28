import { Suspense } from "react";
import { SpaceLoading } from "@/components/SpaceLayout";
import { NetworkCard } from "@/components/creator/NetworkCard";
import { Icon } from "@/components/visual/Icon";
import { PageHero } from "@/components/visual/PageHero";
import { getCreatorDashboard } from "@/lib/data/creators";
import { networkMessage } from "@/lib/network-messages";
import { requireRole } from "@/lib/session";
import type { Platform } from "@/lib/types";

const PLATFORMS: Platform[] = ["INSTAGRAM", "TIKTOK"];

const TONES = {
  success: { box: "border-tiktok/25 bg-tiktok/10 text-ink", icon: "check" as const, chip: "bg-tiktok text-white" },
  error: { box: "border-danger/20 bg-danger/8 text-danger", icon: "refresh" as const, chip: "bg-danger text-white" },
  info: { box: "border-cobalt/20 bg-cobalt/8 text-ink", icon: "bolt" as const, chip: "bg-cobalt text-white" },
};

export default function NetworksPage({ searchParams }: PageProps<"/createur/reseaux">) {
  return (
    <>
      <PageHero
        leading={
          <span aria-hidden className="grid size-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-cobalt via-violet to-instagram">
            <Icon name="link" className="size-7" />
          </span>
        }
        title="Mes réseaux"
        subtitle={
          <p>
            Tes statistiques sont lues directement sur Instagram et TikTok. Elles se mettent à jour quand
            tu ouvres ton tableau de bord, ou quand tu cliques sur « Actualiser ».
          </p>
        }
      />
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
  const dashboard = await getCreatorDashboard(user.profileId);
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
    <p
      role={message.tone === "error" ? "alert" : "status"}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${TONES[message.tone].box}`}
    >
      <span aria-hidden className={`grid size-8 shrink-0 place-items-center rounded-xl ${TONES[message.tone].chip}`}>
        <Icon name={TONES[message.tone].icon} className="size-4" />
      </span>
      {message.text}
    </p>
  );
}
