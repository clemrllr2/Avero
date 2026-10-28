"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/components/motion/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { CREATOR_PREVIEW_KPIS } from "@/lib/landing-content";

// Courbe d'abonnés de l'aperçu (viewBox 0 0 400 140).
const CURVE = "M0 118 C 40 112, 70 108, 100 100 S 160 92, 190 80 S 250 70, 280 52 S 340 34, 400 18";

const POINTS = [
  "Instagram et TikTok réunis, sans saisie ni capture d'écran",
  "Vues, abonnés, engagement et audience, mis à jour à chaque visite",
  "Gratuit, pour toujours",
];

export function CreatorsSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Ordinateur : la section est épinglée et le tableau de bord se construit au défilement.
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const path = ref.current?.querySelector<SVGPathElement>("[data-curve]");
        const length = path?.getTotalLength() ?? 0;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: "+=1200", pin: true, scrub: 0.8 },
        });
        tl.fromTo("[data-copy]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.6 })
          .fromTo("[data-preview]", { autoAlpha: 0, y: 60, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }, "<0.2")
          .fromTo("[data-kpi]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.35, duration: 0.5 })
          .fromTo(path ?? [], { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.4, ease: "none" }, "<0.2");
      });

      // Mobile et tablette : simple apparition au défilement, sans épinglage.
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        gsap.fromTo(
          "[data-copy], [data-preview], [data-kpi]",
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="createurs" ref={ref} className="bg-paper">
      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-14 px-4 py-24 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-7">
          <p data-motion data-copy className="text-[15px] font-semibold text-cobalt">
            Pour les créateurs
          </p>
          <h2 data-motion data-copy className="display text-[34px] leading-[1.05] font-extrabold sm:text-[48px]">
            Tous tes chiffres, enfin au même endroit.
          </h2>
          <ul data-motion data-copy className="flex flex-col gap-3 text-lg text-muted">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-cobalt" />
                {point}
              </li>
            ))}
          </ul>
          <div data-motion data-copy>
            <ButtonLink href="/inscription?role=createur" className="px-6 py-3.5">
              Créer mon compte créateur
            </ButtonLink>
          </div>
        </div>

        <div
          data-motion
          data-preview
          className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_40px_80px_-40px_rgba(25,25,52,0.35)] sm:p-8"
          aria-label="Aperçu du tableau de bord créateur"
        >
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="display text-xl font-bold">Léa Martin</span>
            <span className="flex gap-2">
              <PlatformBadge platform="INSTAGRAM" />
              <PlatformBadge platform="TIKTOK" />
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
            {CREATOR_PREVIEW_KPIS.map((kpi) => (
              <div key={kpi.label} data-motion data-kpi className="flex flex-col-reverse gap-1 border-l-2 border-cobalt/25 pl-4">
                <dt className="text-sm text-muted">{kpi.label}</dt>
                <dd className="display text-[26px] font-bold sm:text-[30px]">{kpi.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <p className="mb-3 text-sm text-muted">Abonnés sur 60 jours</p>
            <svg viewBox="0 0 400 140" className="h-auto w-full" role="img" aria-label="Courbe d'abonnés en hausse">
              <path d={`${CURVE} L 400 140 L 0 140 Z`} className="fill-cobalt/8" />
              <path data-curve d={CURVE} className="fill-none stroke-cobalt" strokeWidth={3} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
