import type { ComponentProps, ReactNode } from "react";
import { Aurora } from "@/components/visual/Aurora";
import { Icon, type IconName } from "@/components/visual/Icon";
import { PLAN_LABELS, planCardFeatures } from "@/lib/plans";
import type { Plan } from "@/lib/types";

const PLAN_ICON: Record<Plan, IconName> = { FREE: "eye", BASIC: "chart", PREMIUM: "sparkle" };

/**
 * Carte d'un plan (landing et page Plans des marques). Premium : fond nuit, bordure en dégradé.
 * `glow` ajoute un halo qui suit la souris (position fournie par --x / --y sur la carte).
 */
export function PlanCardView({
  plan,
  action,
  current = false,
  glow = false,
  heading: Heading = "h3",
  onPointerMove,
}: {
  plan: Plan;
  action: ReactNode;
  current?: boolean;
  glow?: boolean;
  heading?: "h2" | "h3";
  onPointerMove?: ComponentProps<"article">["onPointerMove"];
}) {
  const featured = plan === "PREMIUM";
  const { name, description } = PLAN_LABELS[plan];

  return (
    <article
      onPointerMove={onPointerMove}
      className={`group relative isolate flex flex-col gap-8 overflow-hidden rounded-[30px] p-7 sm:p-8 ${
        featured
          ? "section-dark gradient-border shadow-[0_40px_90px_-30px_rgba(124,92,255,0.65)]"
          : "glass-light shadow-[0_30px_60px_-40px_rgba(25,25,52,0.35)]"
      } ${current ? "ring-2 ring-signal ring-offset-4 ring-offset-paper" : ""}`}
    >
      {featured && <Aurora className="opacity-70" />}
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), ${
              featured ? "rgba(124,92,255,0.45)" : "rgba(59,70,241,0.12)"
            }, transparent 60%)`,
          }}
        />
      )}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span
            aria-hidden
            className={`grid size-11 place-items-center rounded-2xl ${
              featured ? "bg-gradient-to-br from-cobalt via-violet to-instagram text-white" : "bg-cobalt/10 text-cobalt"
            }`}
          >
            <Icon name={PLAN_ICON[plan]} className="size-5" />
          </span>
          {current ? (
            <span className="rounded-full bg-signal px-2.5 py-1 text-xs font-semibold text-ink">Votre plan actuel</span>
          ) : (
            featured && <span className="rounded-full bg-signal px-2.5 py-1 text-xs font-semibold text-ink">Le plus complet</span>
          )}
        </div>
        <Heading className="display text-2xl font-bold">{name}</Heading>
        <p className={featured ? "text-paper/70" : "text-muted"}>{description}</p>
      </header>

      <p className="flex flex-col gap-1">
        <span className={`display text-[44px] leading-none font-extrabold ${featured ? "text-gradient" : ""}`}>
          {plan === "FREE" ? "Gratuit" : "0 €"}
        </span>
        <span className={`text-sm ${featured ? "text-paper/60" : "text-muted"}`}>
          {plan === "FREE" ? "Pour toujours" : "Gratuit pendant le lancement"}
        </span>
      </p>

      <ul className="flex flex-1 flex-col gap-3 text-[15px]">
        {planCardFeatures(plan).map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              aria-hidden
              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                featured ? "bg-signal text-ink" : "bg-cobalt/10 text-cobalt"
              }`}
            >
              <Icon name="check" className="size-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {action}
    </article>
  );
}
