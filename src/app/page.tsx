import type { Metadata } from "next";
import { BrandsSection } from "@/components/landing/BrandsSection";
import { CreatorsSection } from "@/components/landing/CreatorsSection";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { PlanCards } from "@/components/landing/PlanCards";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { StatsBand } from "@/components/landing/StatsBand";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SITE_URL } from "@/lib/site";
import { homeJsonLd, serializeJsonLd } from "@/lib/structured-data";


export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <SmoothScroll>
      {/* Données structurées (schema.org) : contenu statique, sérialisé sans « < » brut. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd(SITE_URL)) }} />
      <SiteNav />
      <main>
        <Hero />
        <StatsBand />
        <CreatorsSection />
        <BrandsSection />
        <PlanCards />
        <Faq />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
