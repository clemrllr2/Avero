"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/components/motion/gsap";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { buttonClass } from "@/components/ui/Button";
import { Aurora } from "@/components/visual/Aurora";
import { Wordmark } from "@/components/visual/Wordmark";
import { NAV_LINKS } from "@/lib/landing-content";

const NAV_OFFSET = -72;

export function SiteNav({ anchorsBase = "" }: { anchorsBase?: "" | "/" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile : Échap pour fermer, focus gardé dans le panneau, page bloquée derrière.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    // Le bouton « Fermer » (dans l'en-tête) fait partie du cycle de focus.
    const focusables = () =>
      [toggleRef.current, ...Array.from(panel?.querySelectorAll<HTMLElement>("a, button") ?? [])].filter(
        (el): el is HTMLElement => el !== null,
      );
    focusables()[1]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const items = focusables();
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open || !panelRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // opacity (et non autoAlpha) : les liens restent focalisables pendant l'animation.
        gsap.fromTo(panelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.from("[data-menu-link]", { y: 40, opacity: 0, duration: 0.6, ease: "expo.out", stagger: 0.06, delay: 0.1 });
      });
      return () => mm.revert();
    },
    { dependencies: [open], scope: panelRef },
  );

  // Sur la landing, les ancres défilent en douceur ; ailleurs (mentions légales) on revient sur la landing.
  const onAnchor = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (anchorsBase) return;
    e.preventDefault();
    scrollTo(href, NAV_OFFSET);
  };

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-300 ${
        scrolled
          ? "border-b border-paper/10 bg-night/90 py-3 backdrop-blur-xl"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 text-paper sm:px-8">
        <Wordmark />

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 text-[15px] md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={`${anchorsBase}${link.href}`}
              onClick={(e) => onAnchor(e, link.href)}
              className="text-paper/70 transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/connexion" className={buttonClass("ghost", "px-4 py-2.5 text-paper hover:bg-paper/10")}>
            Se connecter
          </Link>
          <Link href="/inscription?role=createur" className={buttonClass("primary", "px-4 py-2.5 shadow-[0_8px_30px_-6px_rgba(59,70,241,0.8)]")}>
            Créer un compte
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="rounded-xl border border-paper/20 px-4 py-2 text-sm font-semibold md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

    </header>

      {/* Hors du <header> : son flou (backdrop-filter) limiterait un élément fixe à sa propre taille. */}
      {open && (
        <div
          id="menu-mobile"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="section-dark grain fixed inset-0 z-40 isolate flex flex-col gap-8 overflow-hidden px-6 pt-28 pb-12 md:hidden"
        >
          <Aurora />
          <nav aria-label="Menu mobile" className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                data-menu-link
                href={`${anchorsBase}${link.href}`}
                onClick={(e) => onAnchor(e, link.href)}
                className="display text-4xl font-bold"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div data-menu-link className="mt-auto flex flex-col gap-3">
            <Link href="/inscription?role=createur" className={buttonClass("primary")}>
              Créer un compte
            </Link>
            <Link href="/connexion" className={buttonClass("light")}>
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
