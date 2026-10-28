"use client";

import type { PointerEvent } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PlanCardView } from "@/components/ui/PlanCard";
import { Aurora } from "@/components/visual/Aurora";
import { PLANS, PLAN_LABELS } from "@/lib/plans";

/** Met à jour la position du halo lumineux qui suit la souris. */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

export function PlanCards() {
  return (
    <section id="plans" className="relative isolate overflow-hidden bg-paper">
      <Aurora tone="light" />
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

        <Reveal stagger={0.12} className="grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCardView
              key={plan}
              plan={plan}
              glow
              onPointerMove={trackPointer}
              action={
                <ButtonLink
                  href="/inscription?role=marque"
                  variant={plan === "PREMIUM" ? "primary" : "secondary"}
                  className="w-full"
                >
                  Choisir {PLAN_LABELS[plan].name}
                </ButtonLink>
              }
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
