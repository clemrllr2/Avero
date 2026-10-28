import { Suspense } from "react";
import { choosePlanAction } from "@/app/marque/plans/actions";
import { SpaceLoading } from "@/components/SpaceLayout";
import { Button } from "@/components/ui/Button";
import { PLANS, PLAN_LABELS, planCardFeatures } from "@/lib/plans";
import { requireRole } from "@/lib/session";
import type { Plan } from "@/lib/types";

export default function PlansPage() {
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="display text-3xl font-extrabold sm:text-4xl">Plans</h1>
        <p className="max-w-[60ch] text-muted">
          Basic et Premium sont gratuits pendant la phase de lancement. Vous pouvez changer de plan à
          tout moment.
        </p>
      </header>
      {/* Plan actuel lu dans la session : dans un Suspense (règle Next 16). */}
      <Suspense fallback={<SpaceLoading />}>
        <PlanChoice />
      </Suspense>
    </>
  );
}

async function PlanChoice() {
  const user = await requireRole("BRAND");
  const current = user.plan ?? "FREE";
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <PlanCard key={plan} plan={plan} current={plan === current} />
      ))}
    </div>
  );
}

function PlanCard({ plan, current }: { plan: Plan; current: boolean }) {
  const { name, description } = PLAN_LABELS[plan];
  return (
    <article
      className={`flex flex-col gap-7 rounded-[24px] border p-7 ${
        current ? "border-cobalt bg-surface ring-2 ring-cobalt/20" : "border-line bg-surface"
      }`}
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="display text-2xl font-bold">{name}</h2>
          {current && (
            <span className="rounded-full bg-signal px-2.5 py-1 text-xs font-semibold text-ink">Votre plan actuel</span>
          )}
        </div>
        <p className="text-muted">{description}</p>
      </header>
      <p className="flex flex-col gap-1">
        <span className="display text-[36px] leading-none font-extrabold">{plan === "FREE" ? "Gratuit" : "0 €"}</span>
        <span className="text-sm text-muted">{plan === "FREE" ? "Pour toujours" : "Gratuit pendant le lancement"}</span>
      </p>
      <ul className="flex flex-1 flex-col gap-3 text-[15px]">
        {planCardFeatures(plan).map((feature) => (
          <li key={feature} className="flex gap-3">
            <span aria-hidden className="text-cobalt">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {current ? (
        <p className="rounded-xl bg-ink/5 px-4 py-3 text-center text-sm font-semibold text-muted">Plan actif</p>
      ) : (
        <form action={choosePlanAction}>
          <input type="hidden" name="plan" value={plan} />
          <Button type="submit" variant={plan === "PREMIUM" ? "primary" : "secondary"} className="w-full">
            Choisir {name}
          </Button>
        </form>
      )}
    </article>
  );
}
