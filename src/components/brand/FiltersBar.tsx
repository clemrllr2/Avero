import Link from "next/link";
import type { CreatorListQuery } from "@/lib/creator-query";

/** Filtres réseau + tranche d'abonnés (formulaire GET : l'état reste dans l'adresse). */
export function FiltersBar({ query }: { query: CreatorListQuery }) {
  const field = "rounded-xl border border-line bg-surface px-3 py-2.5 text-[15px] outline-none focus:border-cobalt";
  return (
    <form method="get" className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-4">
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
      <button type="submit" className="rounded-xl bg-cobalt px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-cobalt-deep">
        Filtrer
      </button>
      <Link href="/marque" className="px-2 py-2.5 text-sm text-muted hover:text-ink">
        Réinitialiser
      </Link>
    </form>
  );
}
