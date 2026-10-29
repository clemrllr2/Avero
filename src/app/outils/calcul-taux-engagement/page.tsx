import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection, PageShell } from "@/components/content/PageShell";
import { EngagementCalculator } from "@/components/tools/EngagementCalculator";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Calcul du taux d'engagement Instagram et TikTok";
const DESCRIPTION =
  "Calculateur gratuit du taux d'engagement Instagram et TikTok : saisissez vues, likes, commentaires et partages, obtenez le taux par vues et par abonnés.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/outils/calcul-taux-engagement" });

/** Outil gratuit décrit pour Google (application web, sans inscription). */
const TOOL_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculateur de taux d'engagement",
  url: `${SITE_URL}/outils/calcul-taux-engagement`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "fr-FR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  provider: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
};

export default function EngagementCalculatorPage() {
  return (
    <PageShell
      crumbs={[
        { name: "Guides", path: "/guides" },
        { name: "Calcul du taux d'engagement", path: "/outils/calcul-taux-engagement" },
      ]}
      title="Calculateur de taux d'engagement"
      intro="Instagram ou TikTok : saisissez les chiffres moyens d'une publication et obtenez le taux d'engagement par vues et par abonnés. Gratuit, sans inscription, rien n'est enregistré."
      jsonLd={[TOOL_JSON_LD]}
    >
      <EngagementCalculator />

      <ContentSection title="Comment le taux est calculé">
        <p>
          <strong className="font-semibold text-ink">Par vues</strong> : (likes + commentaires + partages) ÷ vues. C&apos;est la
          méthode la plus juste pour TikTok et les Reels, souvent vus par des personnes qui ne sont pas abonnées.
        </p>
        <p>
          <strong className="font-semibold text-ink">Par abonnés</strong> : (likes + commentaires + partages) ÷ abonnés. C&apos;est la
          méthode historique d&apos;Instagram, utile pour mesurer la réaction de sa propre communauté.
        </p>
        <p>
          Pour un résultat fiable, utilisez la moyenne de plusieurs publications récentes plutôt qu&apos;une seule. Le guide{" "}
          <Link href="/guides/taux-engagement" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            Taux d&apos;engagement : définition et calcul
          </Link>{" "}
          détaille un exemple pas à pas.
        </p>
      </ContentSection>

      <ContentSection title="Des chiffres sûrs, sans calcul à la main">
        <p>
          Sur AVERO, le taux d&apos;engagement est calculé automatiquement sur les 30 derniers jours, à partir des statistiques lues
          directement sur Instagram et TikTok. Les créateurs n&apos;ont plus de captures d&apos;écran à envoyer, et les marques comparent des
          chiffres impossibles à retoucher.
        </p>
        <p className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/createurs" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            AVERO pour les créateurs
          </Link>
          <Link href="/marques" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            AVERO pour les marques
          </Link>
        </p>
      </ContentSection>
    </PageShell>
  );
}
