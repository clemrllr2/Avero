import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { Aurora } from "@/components/visual/Aurora";
import { SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/structured-data";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Cadre des pages de contenu publiques (pages créateurs/marques, guides, outils, à propos) :
 * menu, bandeau sombre avec fil d'Ariane et titre, contenu, pied de page, données structurées.
 */
export function PageShell({
  crumbs,
  title,
  intro,
  meta,
  jsonLd = [],
  children,
}: {
  /** Fil d'Ariane sans l'accueil (ajouté automatiquement) ; le dernier élément est la page courante */
  crumbs: Crumb[];
  title: string;
  intro: ReactNode;
  /** Ligne d'informations sous l'introduction (public visé, temps de lecture…) */
  meta?: ReactNode;
  jsonLd?: object[];
  children: ReactNode;
}) {
  const trail = [{ name: "Accueil", path: "/" }, ...crumbs];
  return (
    <>
      {[breadcrumbJsonLd(SITE_URL, trail), ...jsonLd].map((data, i) => (
        // Données structurées : contenu statique, sérialisé sans « < » brut.
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
      ))}
      <SiteNav anchorsBase="/" />
      <header className="section-dark grain relative isolate overflow-hidden">
        <Aurora />
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 pt-32 pb-16 sm:px-8 sm:pt-36">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-paper/55">
              {trail.map((crumb, i) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i < trail.length - 1 ? (
                    <Link href={crumb.path} className="hover:text-paper">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-paper/80">
                      {crumb.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="display max-w-[22ch] text-[38px] leading-[1.04] font-extrabold sm:text-[54px]">{title}</h1>
          <div className="max-w-[60ch] text-lg text-paper/70 sm:text-xl">{intro}</div>
          {meta && <div className="text-sm text-paper/55">{meta}</div>}
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-16 sm:px-8 sm:py-20">{children}</main>
      <SiteFooter />
    </>
  );
}

/** Section de contenu : titre de niveau 2 et texte, colonne de lecture confortable. */
export function ContentSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="flex max-w-[70ch] flex-col gap-5">
      <h2 className="display text-[26px] leading-tight font-bold sm:text-[32px]">{title}</h2>
      <div className="flex flex-col gap-4 text-[17px] leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}
