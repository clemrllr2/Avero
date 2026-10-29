import Link from "next/link";
import type { ReactNode } from "react";
import { PLATFORM_ICONS, PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { Icon } from "@/components/visual/Icon";
import {
  FOLLOWER_RANGES,
  followerRangeOf,
  listHref,
  type CreatorListQuery,
  type ListView,
} from "@/lib/creator-query";
import type { Platform } from "@/lib/types";

const PLATFORMS: Platform[] = ["INSTAGRAM", "TIKTOK"];

const PILL = "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors";

function Pill({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`${PILL} ${
        active ? "border-night bg-night text-paper" : "border-line bg-surface text-ink hover:border-cobalt/40 hover:text-cobalt"
      }`}
    >
      {children}
    </Link>
  );
}

/** Pastille verrouillée (plan Free) : montre le filtre et mène à la page des plans. */
function LockedPill({ children }: { children: ReactNode }) {
  return (
    <Link href="/marque/plans" className={`${PILL} border-dashed border-line bg-surface/60 text-muted hover:text-cobalt`}>
      <Icon name="lock" className="size-3.5" />
      {children}
    </Link>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-muted">{label}</span>
      {children}
    </div>
  );
}

/**
 * Filtres en pastilles (de simples liens : l'état reste dans l'adresse, sans JavaScript).
 * Sans le plan Basic, les pastilles sont affichées verrouillées.
 */
export function FilterPills({ query, view, allowed }: { query: CreatorListQuery; view: ListView; allowed: boolean }) {
  const state = { ...query, view };
  const range = followerRangeOf(query);
  const field =
    "w-36 rounded-xl border border-line bg-surface px-3 py-2 text-[15px] transition-shadow outline-none focus:border-cobalt focus:ring-4 focus:ring-cobalt/15";

  return (
    <section
      aria-label="Filtres"
      className="glass-light flex flex-col gap-4 rounded-[28px] p-4 shadow-[0_24px_60px_-48px_rgba(25,25,52,0.5)] sm:p-5"
    >
      <Group label="Réseau">
        {allowed ? (
          <>
            <Pill href={listHref(state, { platform: undefined })} active={!query.platform}>
              <Icon name="sparkle" className="size-4" />
              Tous
            </Pill>
            {PLATFORMS.map((p) => (
              <Pill key={p} href={listHref(state, { platform: p })} active={query.platform === p}>
                <Icon name={PLATFORM_ICONS[p]} className={`size-4 ${query.platform === p ? "" : p === "INSTAGRAM" ? "text-instagram" : "text-tiktok"}`} />
                {PLATFORM_NAMES[p]}
              </Pill>
            ))}
          </>
        ) : (
          PLATFORMS.map((p) => <LockedPill key={p}>{PLATFORM_NAMES[p]}</LockedPill>)
        )}
      </Group>

      <Group label="Abonnés">
        {allowed ? (
          <>
            <Pill href={listHref(state, { minFollowers: undefined, maxFollowers: undefined })} active={range === "all"}>
              Tous
            </Pill>
            {FOLLOWER_RANGES.map((r) => (
              <Pill
                key={r.key}
                href={listHref(state, { minFollowers: "min" in r ? r.min : undefined, maxFollowers: "max" in r ? r.max : undefined })}
                active={range === r.key}
              >
                {r.label}
              </Pill>
            ))}
            <details className="group relative" open={range === "custom"}>
              <summary
                className={`${PILL} cursor-pointer list-none [&::-webkit-details-marker]:hidden ${
                  range === "custom" ? "border-night bg-night text-paper" : "border-line bg-surface hover:border-cobalt/40"
                }`}
              >
                Personnalisé
                <Icon name="arrow-down" className="size-3.5 transition-transform group-open:rotate-180" />
              </summary>
              {/* Formulaire GET : garde le tri, le réseau et la vue. */}
              <form method="get" className="mt-3 flex flex-wrap items-end gap-3">
                <input type="hidden" name="sort" value={query.sort} />
                <input type="hidden" name="order" value={query.order} />
                {query.platform && <input type="hidden" name="platform" value={query.platform} />}
                {view === "tableau" && <input type="hidden" name="vue" value="tableau" />}
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium">Minimum</span>
                  <input name="minFollowers" type="number" min={0} step={1000} defaultValue={query.minFollowers} className={field} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium">Maximum</span>
                  <input name="maxFollowers" type="number" min={0} step={1000} defaultValue={query.maxFollowers} className={field} />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-4 py-2 text-sm font-semibold text-white hover:bg-cobalt-deep"
                >
                  <Icon name="check" className="size-4" />
                  Appliquer
                </button>
              </form>
            </details>
          </>
        ) : (
          FOLLOWER_RANGES.map((r) => <LockedPill key={r.key}>{r.label}</LockedPill>)
        )}
      </Group>

      {allowed && (query.platform || range !== "all") && (
        <Link
          href={listHref(state, { platform: undefined, minFollowers: undefined, maxFollowers: undefined })}
          scroll={false}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-ink"
        >
          <Icon name="refresh" className="size-3.5" />
          Réinitialiser les filtres
        </Link>
      )}
    </section>
  );
}
