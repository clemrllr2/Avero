"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Toutes les animations sont déclarées sous cette condition (spec 3.2). */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Rend visible un élément caché par l'anti-flash (globals.css), sans animation. */
export function showNow(targets: gsap.TweenTarget) {
  gsap.set(targets, { visibility: "visible" });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
