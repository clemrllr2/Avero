import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Aurora } from "@/components/visual/Aurora";
import { Icon, type IconName } from "@/components/visual/Icon";
import { PhoneDashboard } from "@/components/visual/PhoneDashboard";
import { PhoneMockup } from "@/components/visual/PhoneMockup";
import { PostThumb } from "@/components/visual/PostThumb";
import { Wordmark } from "@/components/visual/Wordmark";

const STATS: { value: number; label: string; format: "compact" | "number"; icon: IconName; tone: string }[] = [
  { value: 2_870_000, label: "vues sur 30 jours, lues sur TikTok", format: "compact", icon: "eye", tone: "bg-cobalt" },
  { value: 174_000, label: "abonnés, lus sur Instagram", format: "compact", icon: "users", tone: "bg-violet" },
  { value: 12_400, label: "nouveaux abonnés ce mois-ci", format: "number", icon: "trend", tone: "bg-instagram" },
];

/** Panneau sombre à gauche des pages de connexion et d'inscription (ordinateur uniquement). */
export function AuthShowcase() {
  return (
    <aside className="section-dark grain relative isolate hidden flex-col justify-between gap-10 overflow-hidden p-12 lg:flex xl:p-16">
      <Aurora />
      <div aria-hidden className="dot-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_40%,transparent)]" />
      <Wordmark className="relative text-2xl" />

      <div className="relative flex flex-col gap-10">
        <p className="display max-w-[16ch] text-[34px] leading-[1.05] font-extrabold xl:text-[42px]">
          Les chiffres viennent des réseaux, pas des captures d&apos;écran.
        </p>

        <div className="flex items-center gap-8 xl:gap-12">
          <div className="relative ml-6 w-[160px] shrink-0 xl:w-[190px]" aria-hidden>
            <div className="absolute top-[14%] -left-[30%] w-[58%] -rotate-12">
              <PostThumb seed="@ines.danse" views={2_870_000} platform="TIKTOK" className="ring-1 ring-white/20" />
            </div>
            <div className="relative">
              <PhoneMockup>
                <PhoneDashboard />
              </PhoneMockup>
            </div>
          </div>

          <Reveal stagger={0.12} className="flex flex-col gap-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="glass flex items-center gap-4 rounded-2xl bg-night-soft/60 p-4"
                style={{ marginLeft: `${[0, 24, 8][i]}px` }}
              >
                <span aria-hidden className={`grid size-11 shrink-0 place-items-center rounded-xl ${stat.tone}`}>
                  <Icon name={stat.icon} className="size-5" />
                </span>
                <span className="flex flex-col">
                  <CountUp
                    value={stat.value}
                    format={stat.format}
                    delay={0.3 + i * 0.12}
                    className="display text-2xl font-bold xl:text-3xl"
                  />
                  <span className="text-sm text-paper/60">{stat.label}</span>
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
      <p className="relative text-sm text-paper/40">Données de démonstration.</p>
    </aside>
  );
}
