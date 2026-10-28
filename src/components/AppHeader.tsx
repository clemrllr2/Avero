import Link from "next/link";
import type { ReactNode } from "react";

export function Logo() {
  return (
    <Link href="/" className="display text-xl font-extrabold tracking-tight">
      AVERO
    </Link>
  );
}

/** En-tête commun ; la zone de droite (connexion, menu) est fournie par la page. */
export function AppHeader({ nav, right }: { nav?: ReactNode; right?: ReactNode }) {
  return (
    <header className="border-b border-line bg-paper/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          {nav && <nav className="hidden items-center gap-6 text-[15px] sm:flex">{nav}</nav>}
        </div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}
