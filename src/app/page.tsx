import { BrandsSection } from "@/components/landing/BrandsSection";
import { CreatorsSection } from "@/components/landing/CreatorsSection";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { PlanCards } from "@/components/landing/PlanCards";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { StatsBand } from "@/components/landing/StatsBand";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
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
