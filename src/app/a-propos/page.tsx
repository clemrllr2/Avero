import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection, PageShell } from "@/components/content/PageShell";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "À propos",
  description:
    "AVERO réunit créateurs et marques autour de statistiques Instagram et TikTok lues à la source, pour des collaborations fondées sur des chiffres réels.",
  path: "/a-propos",
});

const PRINCIPLES = [
  {
    title: "Des chiffres lus à la source",
    text: "Les statistiques viennent des accès officiels d'Instagram et de TikTok. Personne ne peut les saisir ni les modifier à la main.",
  },
  {
    title: "Le créateur garde la main",
    text: "Il choisit les comptes qu'il relie et peut les déconnecter à tout moment : les données correspondantes sont alors supprimées.",
  },
  {
    title: "Uniquement des statistiques",
    text: "Les marques voient des vues, des abonnés, de l'engagement et une audience. Jamais de messages ni d'identifiants.",
  },
  {
    title: "Des prix affichés",
    text: "Gratuit pour les créateurs. Pour les marques, trois plans aux prix publics, sans engagement.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      crumbs={[{ name: "À propos", path: "/a-propos" }]}
      title="Des collaborations fondées sur des chiffres réels"
      intro="AVERO est né d'un constat simple : entre créateurs et marques, tout commence par des chiffres, et ces chiffres circulent encore en captures d'écran."
    >
      <ContentSection title="Pourquoi AVERO">
        <p>
          Un créateur qui travaille sérieusement n&apos;a aucun moyen simple de prouver son audience. Une marque n&apos;a aucun moyen
          simple de vérifier ce qu&apos;on lui annonce. Le résultat : des collaborations choisies sur la confiance, et des créateurs
          honnêtes mis au même niveau que ceux qui gonflent leurs chiffres.
        </p>
        <p>
          AVERO relie directement les comptes Instagram et TikTok des créateurs et présente leurs statistiques aux marques telles
          qu&apos;elles sont. Les créateurs prouvent leur influence, les marques comparent des chiffres réels.
        </p>
      </ContentSection>

      <section className="flex flex-col gap-6">
        <h2 className="display text-[26px] font-bold sm:text-[32px]">Nos principes</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6">
              <span className="display text-lg font-bold">{p.title}</span>
              <span className="text-muted">{p.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <ContentSection title="Pour aller plus loin">
        <p className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/createurs" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            AVERO pour les créateurs
          </Link>
          <Link href="/marques" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            AVERO pour les marques
          </Link>
          <Link href="/guides" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            Nos guides
          </Link>
          <Link href="/contact" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            Nous écrire
          </Link>
        </p>
      </ContentSection>
    </PageShell>
  );
}
