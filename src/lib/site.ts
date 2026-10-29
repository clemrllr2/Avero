/**
 * Adresse publique du site (balises canoniques, sitemap, partage sur les réseaux).
 * À changer via NEXT_PUBLIC_SITE_URL le jour où AVERO aura son propre nom de domaine.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://avero-omega.vercel.app").replace(/\/$/, "");

export const SITE_NAME = "AVERO";
export const SITE_TAGLINE = "Statistiques Instagram et TikTok vérifiées";

/**
 * Métadonnées d'une page publique : titre, description, adresse canonique et aperçu de partage cohérents.
 * (Sans cela, le titre de partage resterait celui de l'accueil : Next.js ne le recopie pas depuis le titre de la page.)
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      locale: "fr_FR",
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
    },
  };
}
