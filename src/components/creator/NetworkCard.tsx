import { disconnectAction, refreshAction } from "@/app/createur/actions";
import { Button, buttonClass } from "@/components/ui/Button";
import { PLATFORM_BANNERS, PLATFORM_ICONS, PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { Icon } from "@/components/visual/Icon";
import { connectHref } from "@/lib/connect";
import { formatCompact, formatDate } from "@/lib/format";
import type { NetworkData, Platform } from "@/lib/types";

/** Un réseau dans « Mes réseaux » : connecté (état, actualiser, déconnecter) ou à connecter. */
export function NetworkCard({ platform, network }: { platform: Platform; network?: NetworkData }) {
  const name = PLATFORM_NAMES[platform];
  const followers = network?.snapshots.at(-1)?.followers;
  const status = !network ? "Non connecté" : network.status === "ACTIVE" ? "Connecté" : "À reconnecter";

  return (
    <article className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_24px_60px_-48px_rgba(25,25,52,0.5)]">
      <header className={`relative isolate flex min-h-[120px] items-start justify-between gap-4 overflow-hidden p-6 text-white ${PLATFORM_BANNERS[platform]}`}>
        {/* Voile sombre : texte blanc lisible sur la partie claire du dégradé Instagram. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/20" />
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <Icon name={PLATFORM_ICONS[platform]} className="size-6" />
          </span>
          <div className="flex flex-col">
            <h2 className="display text-xl font-bold">{name}</h2>
            {network && <span className="text-sm text-white/75">@{network.username}</span>}
          </div>
          {network?.simulated && (
            <span title="Compte relié en mode simulé" className="rounded-full bg-signal px-2 py-0.5 text-xs font-semibold text-ink">
              Simulé
            </span>
          )}
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            !network ? "bg-white/15 text-white" : network.status === "ACTIVE" ? "bg-white text-ink" : "bg-danger text-white"
          }`}
        >
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${!network ? "bg-white/70" : network.status === "ACTIVE" ? "bg-[#12a150]" : "bg-white"}`}
          />
          {status}
        </span>
        <Icon name={PLATFORM_ICONS[platform]} className="pointer-events-none absolute -right-6 -bottom-10 -z-10 size-40 opacity-15" />
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {network ? (
          <>
            {network.status === "EXPIRED" && (
              <p role="alert" className="flex gap-3 rounded-2xl bg-danger/8 px-4 py-3 text-sm text-danger">
                <Icon name="refresh" className="mt-0.5 size-4 shrink-0" />
                <span>
                  L&apos;accès à ton compte {name} a expiré. Reconnecte ton compte {name} pour mettre tes
                  statistiques à jour. Les anciennes données restent affichées.
                </span>
              </p>
            )}
            <dl className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted">Abonnés</dt>
                <dd className="display text-[32px] leading-none font-bold">
                  {followers === undefined ? "—" : formatCompact(followers)}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted">Mis à jour le</dt>
                <dd className="font-semibold">{formatDate(network.lastSyncedAt)}</dd>
              </div>
            </dl>
            <div className="mt-auto flex flex-wrap gap-3">
              {network.status === "EXPIRED" ? (
                // Lien classique (pas de préchargement) : il lance le parcours d'autorisation.
                <a href={connectHref(platform)} className={buttonClass()}>
                  <Icon name="link" className="size-4" />
                  Reconnecter {name}
                </a>
              ) : (
                <form action={refreshAction.bind(null, platform)}>
                  <Button type="submit">
                    <Icon name="refresh" className="size-4" />
                    Actualiser
                  </Button>
                </form>
              )}
              <form action={disconnectAction.bind(null, platform)}>
                <Button type="submit" variant="secondary">
                  <Icon name="unlink" className="size-4" />
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
            <a href={connectHref(platform)} className={buttonClass("primary", "mt-auto w-fit")}>
              <Icon name="link" className="size-4" />
              Connecter {name}
            </a>
          </>
        )}
      </div>
    </article>
  );
}
