import { Suspense } from "react";
import { choosePlanAction } from "@/app/marque/plans/actions";
import { SpaceLoading } from "@/components/SpaceLayout";
import { Button } from "@/components/ui/Button";
import { PlanCardView } from "@/components/ui/PlanCard";
import { Icon } from "@/components/visual/Icon";
import { PageHero } from "@/components/visual/PageHero";
import { PLANS, PLAN_LABELS } from "@/lib/plans";
import { requireRole } from "@/lib/session";
import type { Plan } from "@/lib/types";

export default function PlansPage() {
  return (
    <>
      <PageHero
        leading={
          <span aria-hidden className="grid size-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-cobalt via-violet to-instagram">
            <Icon name="sparkle" className="size-7" />
          </span>
        }
        title="Plans"
        subtitle={
          <p>
            Prix mensuels hors taxes. Vous pouvez changer de plan à tout moment.
          </p>
        }
      />
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
    <div className="grid items-stretch gap-5 pt-2 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <PlanCard key={plan} plan={plan} current={plan === current} />
      ))}
    </div>
  );
}

function PlanCard({ plan, current }: { plan: Plan; current: boolean }) {
  return (
    <PlanCardView
      plan={plan}
      current={current}
      heading="h2"
      action={
        current ? (
          <p className="flex items-center justify-center gap-2 rounded-xl bg-signal/25 px-4 py-3 text-center text-sm font-semibold">
            <Icon name="check" className="size-4" />
            Plan actif
          </p>
        ) : (
          <form action={choosePlanAction}>
            <input type="hidden" name="plan" value={plan} />
            <Button type="submit" variant={plan === "PREMIUM" ? "primary" : "secondary"} className="w-full">
              Choisir {PLAN_LABELS[plan].name}
            </Button>
          </form>
        )
      }
    />
  );
}
