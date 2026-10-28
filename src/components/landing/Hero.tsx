"use client";

import Link from "next/link";
import { useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { MOTION_OK, gsap, useGSAP } from "@/components/motion/gsap";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { ButtonLink } from "@/components/ui/Button";
import { HERO_FRAMES } from "@/lib/landing-content";

/** Profondeur de parallaxe de chaque vignette (en pixels au bord de l'écran). */
const DEPTH = [10, 16, 12];

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
          .fromTo(
            frames,
            { autoAlpha: 0, y: 120, rotate: (i: number) => [-6, 3, 7][i] },
            { autoAlpha: 1, y: 0, rotate: (i: number) => [-3, 1, 4][i], duration: 1.3, ease: "expo.out", stagger: 0.12 },
            "<0.1",
          )
          .fromTo("[data-hero-glow]", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out" }, "<");

        // Les vignettes suivent légèrement la souris.
        const movers = frames.map((frame, i) => ({
          x: gsap.quickTo(frame, "x", { duration: 0.8, ease: "power3" }),
          y: gsap.quickTo(frame, "y", { duration: 0.8, ease: "power3" }),
          depth: DEPTH[i] ?? 10,
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
    <section ref={ref} className="section-dark grain relative overflow-hidden">
      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-14 px-4 pt-32 pb-20 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:pt-36">
        <div className="flex flex-col gap-8">
          <SplitHeadline className="display text-[36px] leading-[1.04] font-extrabold sm:text-[52px] lg:text-[58px] xl:text-[66px]">
            Les statistiques des créateurs, lues directement sur Instagram et TikTok.
          </SplitHeadline>
          <p data-motion data-hero-copy className="max-w-[46ch] text-lg text-paper/70 sm:text-xl">
            Les créateurs relient leurs comptes en un clic. Les marques comparent des chiffres qui
            viennent des réseaux, pas de captures d&apos;écran.
          </p>
          <div data-motion data-hero-copy className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/inscription?role=createur" className="px-6 py-3.5">
                Je suis créateur
              </ButtonLink>
              <ButtonLink href="/inscription?role=marque" variant="light" className="px-6 py-3.5">
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

        <div className="relative mx-auto w-full max-w-[520px]">
          <div
            data-motion
            data-hero-glow
            aria-hidden
            className="absolute inset-[-15%] rounded-full bg-cobalt/35 blur-[90px]"
          />
          <div
            className="relative grid grid-cols-3 items-start gap-3 sm:gap-5"
            aria-label="Exemples de publications avec leur nombre de vues"
          >
            {HERO_FRAMES.map((frame, i) => (
              <figure
                key={frame.handle}
                data-motion
                data-frame
                className={`relative aspect-[9/16] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ${frame.fill} ${
                  ["mt-12", "", "mt-24"][i]
                }`}
              >
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
                <figcaption className="relative flex h-full flex-col justify-between p-3 text-white sm:p-4">
                  <span className="flex items-center gap-2 text-[11px] font-medium sm:text-xs">
                    <span aria-hidden className="size-5 rounded-full border border-white/50 bg-white/25" />
                    {frame.handle}
                  </span>
                  <span className="flex flex-col items-start gap-2">
                    {i === 2 && (
                      <span className="rounded-md bg-signal px-1.5 py-0.5 text-[10px] font-semibold text-ink sm:text-[11px]">
                        Lu sur TikTok
                      </span>
                    )}
                    <span className="display flex items-center gap-1.5 text-lg font-bold sm:text-2xl">
                      <span aria-hidden className="text-[10px] sm:text-xs">▶</span>
                      <CountUp value={frame.views} delay={0.9 + i * 0.12} duration={1.8} />
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
