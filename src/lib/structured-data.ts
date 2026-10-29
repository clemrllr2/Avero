import type { Guide } from "@/content/guides";
import { FAQ_ITEMS } from "@/lib/landing-content";
import { PLAN_LABELS, PLAN_MONTHLY_PRICE_EUR, PLANS } from "@/lib/plans";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

type JsonLdNode = Record<string, unknown> & { "@type": string };

/**
 * Données structurées de la page d'accueil (schema.org) : qui est AVERO, ce que fait le logiciel,
 * ses prix et la FAQ. Lues par Google et les assistants IA ; reprennent le contenu affiché, sans rien ajouter.
 */
export function homeJsonLd(siteUrl: string): { "@context": string; "@graph": JsonLdNode[] } {
  const url = `${siteUrl}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${url}#organisation`, name: SITE_NAME, url },
      {
        "@type": "WebSite",
        "@id": `${url}#site`,
        name: SITE_NAME,
        url,
        inLanguage: "fr-FR",
        publisher: { "@id": `${url}#organisation` },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: `${SITE_TAGLINE} : les créateurs relient leurs comptes, les marques comparent des chiffres lus à la source.`,
        offers: PLANS.map((plan) => ({
          "@type": "Offer",
          name: PLAN_LABELS[plan].name,
          price: String(PLAN_MONTHLY_PRICE_EUR[plan]),
          priceCurrency: "EUR",
          description: PLAN_LABELS[plan].description,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

/** Fil d'Ariane (Accueil › Guides › …) : aide Google à comprendre la place de la page dans le site. */
export function breadcrumbJsonLd(siteUrl: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

/** Article d'un guide : titre, description, date de mise à jour, publié par AVERO. */
export function guideJsonLd(siteUrl: string, guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.heading,
    description: guide.description,
    inLanguage: "fr-FR",
    datePublished: guide.updatedOn,
    dateModified: guide.updatedOn,
    author: { "@type": "Organization", name: SITE_NAME, url: `${siteUrl}/` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: `${siteUrl}/` },
    mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`,
  };
}

/** JSON prêt à placer dans <script type="application/ld+json"> : « < » échappé (recommandation Next.js). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
