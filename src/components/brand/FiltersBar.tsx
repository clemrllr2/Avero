import Link from "next/link";
import { Icon } from "@/components/visual/Icon";
import type { CreatorListQuery } from "@/lib/creator-query";

/** Filtres réseau + tranche d'abonnés (formulaire GET : l'état reste dans l'adresse). */
export function FiltersBar({ query }: { query: CreatorListQuery }) {
  const field =
    "rounded-xl border border-line bg-surface px-3 py-2.5 text-[15px] transition-shadow outline-none focus:border-cobalt focus:ring-4 focus:ring-cobalt/15";
  return (
    <form
      method="get"
      className="glass-light flex flex-wrap items-end gap-3 rounded-[28px] p-4 shadow-[0_24px_60px_-48px_rgba(25,25,52,0.5)] sm:p-5"
    >
      <span aria-hidden className="hidden size-11 shrink-0 place-items-center self-center rounded-2xl bg-cobalt/8 text-cobalt sm:grid">
        <Icon name="grid" className="size-5" />
      </span>
      <input type="hidden" name="sort" value={query.sort} />
      <input type="hidden" name="order" value={query.order} />
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Réseau</span>
        <select name="platform" defaultValue={query.platform ?? ""} className={field}>
          <option value="">Tous</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="TIKTOK">TikTok</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Abonnés minimum</span>
        <input name="minFollowers" type="number" min={0} step={1000} defaultValue={query.minFollowers} className={`${field} w-40`} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Abonnés maximum</span>
        <input name="maxFollowers" type="number" min={0} step={1000} defaultValue={query.maxFollowers} className={`${field} w-40`} />
      </label>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-cobalt-deep"
      >
        <Icon name="check" className="size-4" />
        Filtrer
      </button>
      <Link href="/marque" className="px-2 py-2.5 text-sm text-muted hover:text-ink">
        Réinitialiser
      </Link>
    </form>
  );
}
