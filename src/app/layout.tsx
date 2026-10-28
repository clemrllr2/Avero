import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "AVERO",
  description: "Les statistiques des créateurs, lues directement sur Instagram et TikTok.",
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
