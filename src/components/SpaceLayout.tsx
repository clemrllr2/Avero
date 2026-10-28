import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { NavLink } from "@/components/NavLink";
import { UserMenu } from "@/components/UserMenu";

/** Cadre commun des espaces créateur et marque. */
export function SpaceLayout({
  links,
  children,
}: {
  links: { href: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <AppHeader
        nav={
          // NavLink lit l'adresse (onglet actif) : dans un Suspense, avec des liens simples en attendant (règle Next 16).
          <Suspense
            fallback={links.map((l) => (
              <Link key={l.href} href={l.href} className="border-b-2 border-transparent py-1 text-muted">
                {l.label}
              </Link>
            ))}
          >
            {links.map((l) => (
              <NavLink key={l.href} href={l.href}>
                {l.label}
              </NavLink>
            ))}
          </Suspense>
        }
        right={
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        }
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </>
  );
}

export function SpaceLoading() {
  return <p className="text-muted">Chargement…</p>;
}
