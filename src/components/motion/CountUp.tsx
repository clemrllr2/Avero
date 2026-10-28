"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/components/motion/gsap";
import { formatCompact, formatNumber } from "@/lib/format";

/** Compteur de 0 à `value` au premier affichage ; affiche directement `value` sans animation. */
export function CountUp({
  value,
  format = "compact",
  duration = 1.4,
  delay = 0,
  className,
}: {
  value: number;
  format?: "compact" | "number";
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const render = format === "compact" ? formatCompact : formatNumber;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = { n: 0 };
        el.textContent = render(0);
        gsap.to(counter, {
          n: value,
          duration,
          delay,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = render(Math.round(counter.n));
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        return () => {
          el.textContent = render(value);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [value, format], scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {render(value)}
    </span>
  );
}
