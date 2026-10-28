import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { NavLink } from "@/components/NavLink";
import { UserMenu } from "@/components/UserMenu";
import { Skeleton } from "@/components/visual/Skeleton";

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
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">Chargement…</span>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-3xl" />
    </div>
  );
}
