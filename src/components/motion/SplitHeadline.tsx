"use client";

import { useRef } from "react";
import { MOTION_OK, SplitText, gsap, useGSAP } from "@/components/motion/gsap";

/** Titre révélé ligne par ligne, chaque ligne sortant d'un masque. */
export function SplitHeadline({
  as: Tag = "h1",
  className,
  delay = 0.1,
  children,
}: {
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
  children: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // autoSplit recalcule les lignes au redimensionnement et après le chargement de la police.
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.08,
              delay,
            });
          },
        });
        return () => split.revert();
      });
      if (!window.matchMedia(MOTION_OK).matches) gsap.set(el, { visibility: "visible" });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-motion="">
      {children}
    </Tag>
  );
}
