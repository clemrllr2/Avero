import { SpaceLayout } from "@/components/SpaceLayout";

const LINKS = [
  { href: "/createur", label: "Tableau de bord" },
  { href: "/createur/reseaux", label: "Mes réseaux" },
];

export default function CreatorLayout({ children }: LayoutProps<"/createur">) {
  return <SpaceLayout links={LINKS}>{children}</SpaceLayout>;
}
