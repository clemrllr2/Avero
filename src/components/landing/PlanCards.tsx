"use client";

import type { PointerEvent } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PLANS, PLAN_LABELS, planCardFeatures } from "@/lib/plans";

/** Met à jour la position du halo lumineux qui suit la souris. */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

export function PlanCards() {
  return (
    <section id="plans" className="bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-28 sm:px-8 lg:py-36">
        <Reveal className="flex max-w-2xl flex-col gap-5">
          <h2 className="display text-[34px] leading-[1.05] font-extrabold sm:text-[48px]">
            Trois plans pour les marques.
          </h2>
          <p className="text-lg text-muted">
            Commencez gratuitement avec le classement par vues. Basic et Premium sont offerts
            pendant la phase de lancement.
          </p>
        </Reveal>

        <Reveal stagger={0.12} className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const featured = plan === "PREMIUM";
            const { name, description } = PLAN_LABELS[plan];
            return (
              <article
                key={plan}
                onPointerMove={trackPointer}
                className={`group relative flex flex-col gap-8 overflow-hidden rounded-[28px] border p-7 sm:p-8 ${
                  featured ? "section-dark grain border-paper/10" : "border-line bg-surface"
                }`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), ${
                      featured ? "rgba(59,70,241,0.35)" : "rgba(59,70,241,0.10)"
                    }, transparent 60%)`,
                  }}
                />
                <header className="relative flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="display text-2xl font-bold">{name}</h3>
                    {featured && (
                      <span className="rounded-full bg-signal px-2.5 py-1 text-xs font-semibold text-ink">
                        Le plus complet
                      </span>
                    )}
                  </div>
                  <p className={featured ? "text-paper/70" : "text-muted"}>{description}</p>
                </header>

                <p className="relative flex flex-col gap-1">
                  <span className="display text-[40px] leading-none font-extrabold">
                    {plan === "FREE" ? "Gratuit" : "0 €"}
                  </span>
                  <span className={`text-sm ${featured ? "text-paper/60" : "text-muted"}`}>
                    {plan === "FREE" ? "Pour toujours" : "Gratuit pendant le lancement"}
                  </span>
                </p>

                <ul className="relative flex flex-1 flex-col gap-3 text-[15px]">
                  {planCardFeatures(plan).map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span aria-hidden className={featured ? "text-signal" : "text-cobalt"}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="/inscription?role=marque"
                  variant={featured ? "primary" : "secondary"}
                  className="relative w-full"
                >
                  Choisir {name}
                </ButtonLink>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
