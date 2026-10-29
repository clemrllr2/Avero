import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const DESCRIPTION =
  "Créateurs : reliez Instagram et TikTok et prouvez votre influence avec des statistiques vérifiées. Marques : choisissez vos créateurs sur des chiffres réels.";

/** Valeurs par défaut ; chaque page publique précise son titre, sa description et son adresse canonique. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Statistiques Instagram et TikTok vérifiées | AVERO",
    template: "%s | AVERO",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: "Statistiques Instagram et TikTok vérifiées | AVERO",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

// Pose la classe "motion" avant le premier affichage si les animations sont autorisées (voir globals.css).
const MOTION_SCRIPT = `try{if(matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.classList.add("motion")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${archivo.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
