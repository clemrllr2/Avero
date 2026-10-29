import type { Metadata } from "next";
import Link from "next/link";
import { AudienceFaq } from "@/components/content/AudienceFaq";
import { ContentSection, PageShell } from "@/components/content/PageShell";
import { buttonClass } from "@/components/ui/Button";
import { PlanCardView } from "@/components/ui/PlanCard";
import { faqForTopic } from "@/lib/contact";
import { PLANS } from "@/lib/plans";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Trouver des créateurs sur des chiffres vérifiés",
  description:
    "Marques : trouvez et comparez des créateurs Instagram et TikTok sur des statistiques lues à la source. Vues, engagement, audience, sans capture d'écran.",
  path: "/marques",
});

export default function BrandsPage() {
  return (
    <PageShell
      crumbs={[{ name: "Marques", path: "/marques" }]}
      title="Trouvez des créateurs sur des statistiques vérifiées"
      intro="Sur AVERO, les créateurs relient leurs comptes Instagram et TikTok : leurs chiffres viennent directement des réseaux. Pas de capture d'écran, pas de chiffre retouché."
      meta={
        <Link href="/inscription?role=marque" className={buttonClass("primary", "mt-2 px-6 py-3.5")}>
          Créer mon compte marque
        </Link>
      }
    >
      <ContentSection title="Le problème des chiffres déclarés">
        <p>
          Choisir un créateur sur une capture d&apos;écran ou un kit média envoyé en PDF, c&apos;est faire confiance à des chiffres que
          personne n&apos;a vérifiés. Abonnés achetés, statistiques retouchées ou simplement périmées : le budget part sur une audience
          qui n&apos;est pas celle annoncée.
        </p>
        <p>
          AVERO lit les statistiques par les accès officiels d&apos;Instagram et de TikTok. Vous comparez des créateurs sur la même base,
          avec des chiffres que personne ne peut saisir à la main.{" "}
          <Link href="/guides/reperer-faux-abonnes" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            Comment repérer les faux abonnés
          </Link>
        </p>
      </ContentSection>

      <ContentSection title="Ce que vous pouvez faire">
        <ul className="flex flex-col gap-3">
          <li>
            <strong className="font-semibold text-ink">Classer les créateurs</strong> par vues sur 30 jours, gratuitement et sans limite.
          </li>
          <li>
            <strong className="font-semibold text-ink">Filtrer et trier</strong> par réseau, abonnés, engagement, vues moyennes et
            évolution des abonnés.
          </li>
          <li>
            <strong className="font-semibold text-ink">Ouvrir la fiche détaillée</strong> d&apos;un créateur : publications, graphiques et
            audience (âge, genre, pays).
          </li>
          <li>
            <strong className="font-semibold text-ink">Comparer 2 à 4 créateurs</strong> côte à côte et exporter la liste en CSV.
          </li>
        </ul>
      </ContentSection>

      <section className="flex flex-col gap-6">
        <h2 className="display text-[26px] font-bold sm:text-[32px]">Trois plans, sans engagement</h2>
        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCardView
              key={plan}
              plan={plan}
              action={
                <Link
                  href="/inscription?role=marque"
                  className={buttonClass(plan === "PREMIUM" ? "primary" : "secondary", "w-full")}
                >
                  {plan === "FREE" ? "Commencer gratuitement" : `Choisir ${plan === "BASIC" ? "Basic" : "Premium"}`}
                </Link>
              }
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="display text-[26px] font-bold sm:text-[32px]">Questions fréquentes</h2>
        <AudienceFaq items={faqForTopic("BRAND")} />
      </section>

      <aside className="flex flex-col gap-5 rounded-3xl bg-night p-7 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <p className="display text-2xl font-bold">Comparez des chiffres réels.</p>
        <Link href="/inscription?role=marque" className={buttonClass("primary", "shrink-0 px-6 py-3.5")}>
          Créer mon compte marque
        </Link>
      </aside>
    </PageShell>
  );
}
