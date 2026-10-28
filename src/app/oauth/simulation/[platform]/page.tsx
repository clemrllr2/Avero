import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SimulatedConsent } from "@/components/oauth/SimulatedConsent";
import { requireRole } from "@/lib/session";
import { platformFromSlug } from "@/lib/sync/platforms";

export const metadata: Metadata = { title: "Autorisation simulée · AVERO" };

/** Écran d'autorisation du mode simulé (OAUTH2_MODE=simulated), à la place de celui d'Instagram ou TikTok. */
export default function SimulatedConsentPage({ params, searchParams }: PageProps<"/oauth/simulation/[platform]">) {
  return (
    <main className="flex min-h-dvh items-start justify-center bg-paper px-4 py-10 sm:items-center">
      {/* Session, réseau et ?state= : lus dans un Suspense (règle Next 16). */}
      <Suspense fallback={<p className="text-muted">Chargement…</p>}>
        <Consent params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Consent({ params, searchParams }: PageProps<"/oauth/simulation/[platform]">) {
  const user = await requireRole("CREATOR");
  const platform = platformFromSlug((await params).platform);
  if (!platform) notFound();
  const { state } = await searchParams;

  // Nom proposé : celui du créateur, au format d'un nom d'utilisateur (« Léa Martin » → « lea.martin »).
  const suggested = user.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "")
    .slice(0, 30);

  return <SimulatedConsent platform={platform} state={typeof state === "string" ? state : ""} suggestedUsername={suggested} />;
}
