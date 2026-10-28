"use client";

import Link from "next/link";
import { useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { MOTION_OK, gsap, useGSAP } from "@/components/motion/gsap";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { ButtonLink } from "@/components/ui/Button";
import { Aurora } from "@/components/visual/Aurora";
import { Icon } from "@/components/visual/Icon";
import { PhoneDashboard } from "@/components/visual/PhoneDashboard";
import { PhoneMockup } from "@/components/visual/PhoneMockup";
import { PostThumb } from "@/components/visual/PostThumb";
import { HERO_FRAMES } from "@/lib/landing-content";

/** Position et inclinaison de chaque vignette autour du téléphone. */
const FRAME_LAYOUT = [
  { place: "left-0 top-[6%] w-[29%]", tilt: "-rotate-6", depth: 18 },
  { place: "right-0 top-[0%] w-[27%]", tilt: "rotate-[5deg]", depth: 24 },
  { place: "right-[1%] bottom-[4%] w-[31%]", tilt: "rotate-3", depth: 14 },
];

/** Bulles de chiffres en verre. */
const CHIPS = [
  { place: "left-[-4%] bottom-[8%]", icon: "users" as const, tone: "bg-violet", value: "+12 400", label: "abonnés ce mois-ci", depth: 28 },
  { place: "left-[-8%] top-[54%]", icon: "heart" as const, tone: "bg-instagram", value: "6,4 %", label: "d'engagement", depth: 32 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const frames = gsap.utils.toArray<HTMLElement>("[data-frame]");
        const intro = gsap.timeline({ delay: 0.35 });
        intro
          .fromTo("[data-hero-copy]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 })
          .fromTo("[data-phone]", { autoAlpha: 0, y: 140 }, { autoAlpha: 1, y: 0, duration: 1.4, ease: "expo.out" }, "<0.05")
          .fromTo(
            frames,
            { autoAlpha: 0, y: 90, scale: 0.85 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out", stagger: 0.09 },
            "<0.25",
          );

        // Le téléphone, les vignettes et les bulles suivent la souris, chacun à sa profondeur.
        const movers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
          depth: Number(el.dataset.depth),
        }));
        const onMove = (e: PointerEvent) => {
          const dx = e.clientX / window.innerWidth - 0.5;
          const dy = e.clientY / window.innerHeight - 0.5;
          for (const m of movers) {
            m.x(dx * m.depth * 2);
            m.y(dy * m.depth * 2);
          }
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="section-dark grain relative isolate overflow-hidden">
      <Aurora />
      <div aria-hidden className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-16 px-4 pt-32 pb-20 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:pt-36">
        <div className="flex flex-col gap-8">
          <SplitHeadline className="display text-[36px] leading-[1.03] font-extrabold sm:text-[50px] lg:text-[50px] xl:text-[60px]">
            Les statistiques des créateurs, lues directement sur Instagram et TikTok.
          </SplitHeadline>
          <p data-motion data-hero-copy className="max-w-[46ch] text-lg text-paper/70 sm:text-xl">
            Les créateurs relient leurs comptes en un clic. Les marques comparent des chiffres qui
            viennent des réseaux, pas de captures d&apos;écran.
          </p>
          <div data-motion data-hero-copy className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/inscription?role=createur" className="px-6 py-3.5 shadow-[0_12px_40px_-8px_rgba(59,70,241,0.8)]">
                Je suis créateur
              </ButtonLink>
              <ButtonLink href="/inscription?role=marque" variant="light" className="px-6 py-3.5 backdrop-blur">
                Je suis une marque
              </ButtonLink>
            </div>
            <p className="text-sm text-paper/60">
              Déjà inscrit ?{" "}
              <Link href="/connexion" className="font-semibold text-paper underline-offset-4 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div
          className="relative mx-auto aspect-[5/6] w-full max-w-[540px]"
          role="img"
          aria-label="Aperçu d'AVERO sur téléphone : vues, abonnés et engagement d'une créatrice, entourés de vidéos et de leur nombre de vues"
        >
          <div aria-hidden className="absolute inset-[12%] -z-10 rounded-full bg-cobalt/40 blur-[90px]" />
          {/* Centrage sur l'élément extérieur : GSAP anime l'élément intérieur sans écraser ce décalage. */}
          <div className="absolute top-1/2 left-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2">
            <div data-motion data-phone data-depth="6">
              <PhoneMockup>
                <PhoneDashboard />
              </PhoneMockup>
            </div>
          </div>

          {HERO_FRAMES.map((frame, i) => (
            <div key={frame.handle} data-motion data-frame data-depth={FRAME_LAYOUT[i].depth} className={`absolute z-10 ${FRAME_LAYOUT[i].place}`}>
              <div className={`float-slow ${FRAME_LAYOUT[i].tilt}`} style={{ animationDelay: `${-i * 2.2}s` }}>
                <PostThumb
                  seed={frame.handle}
                  handle={frame.handle}
                  platform={frame.platform}
                  className="ring-1 ring-white/20"
                  badge={
                    i === 2 && (
                      <span className="rounded-md bg-signal px-1.5 py-0.5 text-[10px] font-semibold text-ink sm:text-[11px]">
                        Lu sur TikTok
                      </span>
                    )
                  }
                  viewsSlot={<CountUp value={frame.views} delay={1.1 + i * 0.12} duration={1.8} />}
                />
              </div>
            </div>
          ))}

          {CHIPS.map((chip, i) => (
            <div key={chip.label} data-motion data-frame data-depth={chip.depth} className={`absolute z-20 ${chip.place} hidden sm:block`}>
              <div className="glass float-slow flex items-center gap-3 rounded-2xl bg-night-soft/80 py-2.5 pr-4 pl-2.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]" style={{ animationDelay: `${-3 - i * 2.5}s` }}>
                <span className={`grid size-9 place-items-center rounded-xl ${chip.tone}`}>
                  <Icon name={chip.icon} className="size-4.5" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="display text-lg font-bold">{chip.value}</span>
                  <span className="text-xs text-paper/60">{chip.label}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
