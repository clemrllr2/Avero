import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { STATS_BAND } from "@/lib/landing-content";

/** Quatre faits sur le produit, en très grand, entre le hero et le bloc Créateurs. */
export function StatsBand() {
  return (
    <section aria-label="AVERO en chiffres" className="dot-grid-ink border-b border-line bg-paper">
      <Reveal stagger={0.08} className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-8 lg:grid-cols-4">
        {STATS_BAND.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-2 py-12 sm:py-16 ${i % 2 === 1 ? "pl-6 sm:pl-10" : ""} ${
              i > 0 ? "lg:border-l lg:border-line lg:pl-10" : ""
            } ${i % 2 === 1 ? "border-l border-line" : ""} ${i < 2 ? "border-b border-line lg:border-b-0" : ""}`}
          >
            <span className="display text-gradient-ink w-fit text-[52px] leading-none font-extrabold whitespace-nowrap sm:text-[72px] xl:text-[88px]">
              <CountUp value={stat.value} format="number" duration={1.6} />
              {stat.suffix}
            </span>
            <span className="text-lg text-muted">{stat.label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
