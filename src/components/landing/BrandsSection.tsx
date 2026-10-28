"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/components/motion/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { formatCompact } from "@/lib/format";
import { BRAND_PREVIEW_ROWS } from "@/lib/landing-content";

const ROW_HEIGHT = 68;

// Le DOM contient la liste déjà triée (lisible sans animation) ;
// l'animation part de l'ordre d'arrivée et la remet dans l'ordre.
const SORTED = [...BRAND_PREVIEW_ROWS].sort((a, b) => b.views - a.views);
const ARRIVAL_INDEX = SORTED.map((row) => BRAND_PREVIEW_ROWS.indexOf(row));

const POINTS = [
  "Des chiffres lus à la source, impossibles à retoucher",
  "Classement par vues gratuit, sans limite de créateurs",
  "Engagement, audience et comparaison avec Basic et Premium",
];

export function BrandsSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
        gsap.fromTo(
          "[data-copy]",
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 70%", once: true } },
        );
        gsap.set("[data-list]", { visibility: "visible" });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-list]", start: "top 80%", end: "bottom 35%", scrub: 0.8 },
        });
        tl.fromTo(
          rows,
          { autoAlpha: 0, y: (i: number) => (ARRIVAL_INDEX[i] - i) * ROW_HEIGHT + 30 },
          { autoAlpha: 1, y: (i: number) => (ARRIVAL_INDEX[i] - i) * ROW_HEIGHT, stagger: 0.08, duration: 0.4 },
        )
          .to(rows, { y: 0, duration: 1, ease: "power2.inOut" })
          .fromTo("[data-rank]", { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.05, duration: 0.3 })
          .fromTo("[data-badge]", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="marques" ref={ref} className="section-dark grain overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-28 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:py-36">
        <div className="flex flex-col gap-7">
          <p data-motion data-copy className="text-[15px] font-semibold text-signal">
            Pour les marques
          </p>
          <h2 data-motion data-copy className="display text-[34px] leading-[1.05] font-extrabold sm:text-[48px]">
            Choisissez vos créateurs sur des chiffres réels.
          </h2>
          <ul data-motion data-copy className="flex flex-col gap-3 text-lg text-paper/70">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal" />
                {point}
              </li>
            ))}
          </ul>
          <div data-motion data-copy>
            <ButtonLink href="/inscription?role=marque" className="px-6 py-3.5">
              Créer mon compte marque
            </ButtonLink>
          </div>
        </div>

        <div
          data-motion
          data-list
          className="rounded-[28px] border border-paper/10 bg-night-soft p-5 sm:p-7"
          aria-label="Aperçu du classement des créateurs par vues"
        >
          <div className="mb-3 flex justify-between px-3 text-sm text-paper/50">
            <span>Créateur</span>
            <span>Vues sur 30 jours</span>
          </div>
          <ol className="relative">
            {SORTED.map((row, rank) => (
              <li
                key={row.name}
                data-motion
                data-row
                // Fond opaque + premier plan pour les mieux classés : les lignes se croisent proprement pendant le tri.
                style={{ height: ROW_HEIGHT, zIndex: SORTED.length - rank }}
                className="relative flex items-center justify-between gap-4 rounded-xl border-t border-paper/10 bg-night-soft px-3"
              >
                <span className="flex items-center gap-4">
                  <span data-motion data-rank className="display w-5 text-sm text-paper/40">
                    {rank + 1}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-semibold">{row.name}</span>
                    <span className="text-xs text-paper/50">{PLATFORM_NAMES[row.platform]}</span>
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  {rank === 0 && (
                    <span data-motion data-badge className="rounded-md bg-signal px-1.5 py-0.5 text-[11px] font-semibold text-ink">
                      Lu sur {PLATFORM_NAMES[row.platform]}
                    </span>
                  )}
                  <span className="display text-xl font-bold">{formatCompact(row.views)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
