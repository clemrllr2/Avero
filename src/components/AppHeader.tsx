import type { ReactNode } from "react";
import { Wordmark } from "@/components/visual/Wordmark";

/** Onglet de navigation en pilule (partagé avec NavLink). */
export const NAV_PILL = "rounded-full px-4 py-2 font-semibold whitespace-nowrap transition-colors";

/** En-tête sombre commun ; la navigation et la zone de droite (connexion, menu) sont fournies par la page. */
export function AppHeader({ nav, right }: { nav?: ReactNode; right?: ReactNode }) {
  return (
    <header className="section-dark sticky top-0 z-40 border-b border-paper/10 bg-night/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-8">
          <Wordmark />
          {nav && (
            <nav className="hidden items-center gap-1 rounded-full bg-paper/6 p-1 text-sm sm:flex">{nav}</nav>
          )}
        </div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
      {nav && (
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 text-sm sm:hidden">{nav}</nav>
      )}
    </header>
  );
}
