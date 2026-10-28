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
        nav={links.map((l) => (
          <NavLink key={l.href} href={l.href}>
            {l.label}
          </NavLink>
        ))}
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
