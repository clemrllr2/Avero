import { SpaceLayout } from "@/components/SpaceLayout";

const LINKS = [
  { href: "/marque", label: "Créateurs" },
  { href: "/marque/plans", label: "Plans" },
];

export default function BrandLayout({ children }: LayoutProps<"/marque">) {
  return <SpaceLayout links={LINKS}>{children}</SpaceLayout>;
}
