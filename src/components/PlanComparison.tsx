import { PLANS, PLAN_COMPARISON, PLAN_LABELS, canAccess } from "@/lib/plans";
import type { Plan } from "@/lib/types";

/** Tableau comparatif des plans ; `current` met en évidence le plan de la marque connectée. */
export function PlanComparison({ current }: { current?: Plan }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[440px] border-collapse text-left text-[15px]">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="p-3 font-medium text-muted sm:p-4">
              Ce que la marque voit
            </th>
            {PLANS.map((plan) => (
              <th
                key={plan}
                scope="col"
                className={`w-20 p-3 text-center sm:w-28 sm:p-4 ${plan === current ? "bg-signal/40" : ""}`}
              >
                <span className="display block text-lg font-bold">{PLAN_LABELS[plan].name}</span>
                <span className="text-xs font-normal text-muted">
                  {plan === "FREE" ? "Gratuit" : "Gratuit au lancement"}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAN_COMPARISON.map(({ label, feature }) => (
            <tr key={label} className="border-b border-line last:border-0">
              <th scope="row" className="p-3 font-normal sm:p-4">
                {label}
              </th>
              {PLANS.map((plan) => {
                const included = feature === null || canAccess(plan, feature);
                return (
                  <td
                    key={plan}
                    className={`p-3 text-center sm:p-4 ${plan === current ? "bg-signal/20" : ""}`}
                  >
                    {included ? (
                      <span className="font-bold text-cobalt" aria-label="Inclus">
                        ✓
                      </span>
                    ) : (
                      <span className="text-muted/60" aria-label="Non inclus">
                        –
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
