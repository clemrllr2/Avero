import type { Metadata } from "next";
import { SpaceLayout } from "@/components/SpaceLayout";

// Espace connecté : jamais dans les moteurs de recherche.
export const metadata: Metadata = { robots: { index: false, follow: false } };

const LINKS = [
  { href: "/createur", label: "Tableau de bord" },
  { href: "/createur/reseaux", label: "Mes réseaux" },
];

export default function CreatorLayout({ children }: LayoutProps<"/createur">) {
  return <SpaceLayout links={LINKS}>{children}</SpaceLayout>;
}
