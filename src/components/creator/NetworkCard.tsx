import { disconnectAction, refreshAction } from "@/app/createur/actions";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { connectHref } from "@/lib/connect";
import { formatCompact, formatDate } from "@/lib/format";
import type { NetworkData, Platform } from "@/lib/types";

const DOT: Record<Platform, string> = { INSTAGRAM: "bg-instagram", TIKTOK: "bg-tiktok" };

/** Un réseau dans « Mes réseaux » : connecté (état, actualiser, déconnecter) ou à connecter. */
export function NetworkCard({ platform, network }: { platform: Platform; network?: NetworkData }) {
  const name = PLATFORM_NAMES[platform];
  const followers = network?.snapshots.at(-1)?.followers;

  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden className={`size-3 rounded-full ${DOT[platform]}`} />
          <h2 className="display text-xl font-bold">{name}</h2>
          {network?.simulated && (
            <span title="Compte relié en mode simulé" className="rounded-full bg-signal px-2 py-0.5 text-xs font-semibold text-ink">
              Simulé
            </span>
          )}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            !network ? "bg-ink/5 text-muted" : network.status === "ACTIVE" ? "bg-tiktok/15 text-ink" : "bg-danger/10 text-danger"
          }`}
        >
          {!network ? "Non connecté" : network.status === "ACTIVE" ? "Connecté" : "À reconnecter"}
        </span>
      </header>

      {network ? (
        <>
          {network.status === "EXPIRED" && (
            <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
              L&apos;accès à ton compte {name} a expiré. Reconnecte ton compte {name} pour mettre tes
              statistiques à jour. Les anciennes données restent affichées.
            </p>
          )}
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted">Compte</dt>
              <dd className="font-semibold">@{network.username}</dd>
            </div>
            <div>
              <dt className="text-muted">Abonnés</dt>
              <dd className="font-semibold">{followers === undefined ? "—" : formatCompact(followers)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted">Mis à jour le</dt>
              <dd className="font-semibold">{formatDate(network.lastSyncedAt)}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3">
            {network.status === "EXPIRED" ? (
              <ButtonLink href={connectHref(platform)}>Reconnecter {name}</ButtonLink>
            ) : (
              <form action={refreshAction.bind(null, platform)}>
                <Button type="submit">Actualiser</Button>
              </form>
            )}
            <form action={disconnectAction.bind(null, platform)}>
              <Button type="submit" variant="secondary">
                Déconnecter
              </Button>
            </form>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-muted">
            {platform === "INSTAGRAM"
              ? "Compte professionnel requis (Créateur ou Entreprise). Le passage en compte professionnel est gratuit et se fait dans les paramètres de l'application Instagram."
              : "Connecte ton compte TikTok pour importer tes vues, likes, commentaires et partages."}
          </p>
          <ButtonLink href={connectHref(platform)} className="w-fit">
            Connecter {name}
          </ButtonLink>
        </>
      )}
    </article>
  );
}
