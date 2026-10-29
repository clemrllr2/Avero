"use client";

import Link from "next/link";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/components/motion/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Avatar } from "@/components/visual/Avatar";
import { Icon } from "@/components/visual/Icon";
import { RadialGauge } from "@/components/visual/RadialGauge";
import { Sparkline } from "@/components/visual/Sparkline";
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

      // Ordinateur, en deux temps :
      // 1. pendant que la section entre à l'écran, le texte, la carte et les KPI se construisent au défilement.
      //    Tout est visible avant que la section n'atteigne le haut : jamais d'écran vide, même en arrivant
      //    directement par le lien « Créateurs » du menu (qui s'arrête 72 px sous le haut de l'écran) ;
      // 2. la section est ensuite épinglée le temps de dessiner la courbe d'abonnés.
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const path = ref.current?.querySelector<SVGPathElement>("[data-curve]");
        const length = path?.getTotalLength() ?? 0;
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 20%", scrub: 0.4 } })
          .fromTo("[data-copy]", { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.3 })
          .fromTo("[data-preview]", { autoAlpha: 0, y: 48, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 }, "<")
          .fromTo("[data-kpi]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.3 }, "<0.15");
        gsap.fromTo(
          path ?? [],
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "+=400", pin: true, scrub: 0.4 },
          },
        );
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
    <section id="createurs" ref={ref} className="dot-grid-ink relative isolate overflow-hidden bg-paper">
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
                <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-cobalt/10 text-cobalt">
                  <Icon name="check" className="size-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div data-motion data-copy className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href="/inscription?role=createur" className="px-6 py-3.5">
              Créer mon compte créateur
            </ButtonLink>
            <Link href="/createurs" className="font-semibold text-cobalt underline-offset-4 hover:underline">
              AVERO pour les créateurs
            </Link>
          </div>
        </div>

        <div data-motion data-preview className="relative isolate">
          <div aria-hidden className="absolute -inset-8 -z-10 rounded-[48px] bg-gradient-to-br from-cobalt/25 via-violet/20 to-instagram/20 blur-3xl" />
          <div
            className="rounded-[32px] border border-white bg-surface/90 p-5 shadow-[0_40px_80px_-40px_rgba(25,25,52,0.45)] backdrop-blur sm:p-7"
            aria-label="Aperçu du tableau de bord créateur"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <Avatar name="Léa Martin" size="md" />
                <span className="flex flex-col leading-tight">
                  <span className="display text-lg font-bold">Léa Martin</span>
                  <span className="text-xs text-muted">Mis à jour il y a 2 min</span>
                </span>
              </span>
              <span className="flex gap-2">
                <PlatformBadge platform="INSTAGRAM" />
                <PlatformBadge platform="TIKTOK" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CREATOR_PREVIEW_KPIS.map((kpi) => (
                <div
                  key={kpi.label}
                  data-motion
                  data-kpi
                  className="flex flex-col-reverse gap-2 overflow-hidden rounded-2xl p-4"
                  style={{ backgroundColor: `${kpi.color}0f` }}
                >
                  {kpi.spark ? (
                    <Sparkline values={kpi.spark} color={kpi.color} className="-mx-4 -mb-4 h-10 w-[calc(100%+2rem)]" />
                  ) : (
                    <RadialGauge value={kpi.gauge ?? 0} size={44} color={kpi.color} track={`${kpi.color}22`} />
                  )}
                  <span className="text-sm text-muted">{kpi.label}</span>
                  <span className="display text-[24px] leading-none font-bold sm:text-[28px]">{kpi.value}</span>
                  <span aria-hidden className="grid size-8 place-items-center rounded-xl text-white" style={{ backgroundColor: kpi.color }}>
                    <Icon name={kpi.icon} className="size-4" />
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-paper p-4">
              <p className="mb-3 flex items-center justify-between text-sm text-muted">
                Abonnés sur 60 jours
                <span className="flex items-center gap-1 font-semibold text-tiktok">
                  <Icon name="arrow-up" className="size-3.5" />
                  +7,6 %
                </span>
              </p>
              <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="h-24 w-full sm:h-28" role="img" aria-label="Courbe d'abonnés en hausse">
                <defs>
                  <linearGradient id="preview-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="preview-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b46f1" />
                    <stop offset="60%" stopColor="#7c5cff" />
                    <stop offset="100%" stopColor="#d6336c" />
                  </linearGradient>
                </defs>
                <path d={`${CURVE} L 400 140 L 0 140 Z`} fill="url(#preview-area)" />
                <path data-curve d={CURVE} fill="none" stroke="url(#preview-line)" strokeWidth={3.5} strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
