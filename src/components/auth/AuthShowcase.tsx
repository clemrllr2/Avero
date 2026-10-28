import Link from "next/link";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

const STATS = [
  { value: 2_870_000, label: "vues sur 30 jours, lues sur TikTok", format: "compact" as const },
  { value: 174_000, label: "abonnés, lus sur Instagram", format: "compact" as const },
  { value: 12_400, label: "nouveaux abonnés ce mois-ci", format: "number" as const },
];

/** Panneau sombre à gauche des pages de connexion et d'inscription (ordinateur uniquement). */
export function AuthShowcase() {
  return (
    <aside className="section-dark grain relative hidden flex-col justify-between overflow-hidden p-12 lg:flex xl:p-16">
      <div aria-hidden className="absolute -right-32 -bottom-32 size-[520px] rounded-full bg-cobalt/30 blur-[110px]" />
      <Link href="/" className="display relative text-2xl font-extrabold tracking-tight">
        AVERO
      </Link>
      <div className="relative flex flex-col gap-12">
        <p className="display max-w-[16ch] text-[44px] leading-[1.05] font-extrabold xl:text-[52px]">
          Les chiffres viennent des réseaux, pas des captures d&apos;écran.
        </p>
        <Reveal stagger={0.12} className="flex flex-col gap-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-baseline gap-4 border-t border-paper/10 pt-5">
              <CountUp
                value={stat.value}
                format={stat.format}
                delay={0.3 + i * 0.12}
                className="display w-36 shrink-0 text-3xl font-bold"
              />
              <span className="text-paper/60">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
      <p className="relative text-sm text-paper/40">Données de démonstration.</p>
    </aside>
  );
}
