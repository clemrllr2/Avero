import type { Metadata } from "next";
import { SpaceLayout } from "@/components/SpaceLayout";

// Espace connecté : jamais dans les moteurs de recherche.
export const metadata: Metadata = { robots: { index: false, follow: false } };

const LINKS = [
  { href: "/marque", label: "Créateurs" },
  { href: "/marque/plans", label: "Plans" },
];

export default function BrandLayout({ children }: LayoutProps<"/marque">) {
  return <SpaceLayout links={LINKS}>{children}</SpaceLayout>;
}
