"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, gsap, showNow, useGSAP } from "@/components/motion/gsap";

/**
 * Fait apparaître le bloc (ou chacun de ses enfants directs si `stagger` est fourni)
 * quand il entre dans l'écran. Une seule fois.
 */
export function Reveal({
  children,
  y = 32,
  delay = 0,
  stagger,
  className,
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const byChild = stagger !== undefined;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const targets = byChild ? Array.from(root.children) : root;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay,
            stagger,
            scrollTrigger: { trigger: root, start: "top 85%", once: true },
          },
        );
      });
      // Sécurité : si la condition n'est pas remplie, on affiche tout de suite.
      if (!window.matchMedia(MOTION_OK).matches) showNow(targets);
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={className}
      {...(byChild ? { "data-motion-children": "" } : { "data-motion": "" })}
    >
      {children}
    </div>
  );
}
