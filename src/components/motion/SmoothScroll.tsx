"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { MOTION_OK, ScrollTrigger, gsap } from "@/components/motion/gsap";

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Défile vers une ancre : en douceur avec Lenis, sinon avec le défilement natif. */
export function useScrollTo() {
  const lenisRef = useContext(LenisContext);
  return (target: string, offset = 0) => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(target, { offset });
      return;
    }
    const el = document.querySelector(target);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  };
}

/** Défilement fluide synchronisé avec ScrollTrigger. Réservé à la landing. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;

    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext value={lenisRef}>{children}</LenisContext>;
}
