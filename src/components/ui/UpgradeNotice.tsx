import Link from "next/link";
import { Icon } from "@/components/visual/Icon";
import { PLAN_LABELS } from "@/lib/plans";

/** Barres décoratives floutées : évoquent ce qui est verrouillé, sans rien montrer. */
const TEASER = [62, 38, 80, 52, 70];

export function UpgradeNotice({
  requiredPlan,
  children,
}: {
  requiredPlan: "BASIC" | "PREMIUM";
  children?: React.ReactNode;
}) {
  const name = PLAN_LABELS[requiredPlan].name;
  return (
    <div className="relative isolate flex flex-col gap-4 overflow-hidden rounded-[28px] border border-cobalt/15 bg-gradient-to-br from-cobalt/[0.06] via-violet/[0.06] to-instagram/[0.05] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div aria-hidden className="pointer-events-none absolute top-1/2 right-40 -z-10 hidden -translate-y-1/2 gap-2 blur-[3px] md:flex">
        {TEASER.map((h, i) => (
          <span key={i} className="w-3 rounded-full bg-gradient-to-t from-cobalt/30 to-violet/30" style={{ height: h }} />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cobalt to-violet text-white shadow-[0_12px_24px_-10px_rgba(124,92,255,0.8)]">
          <Icon name="lock" className="size-5" />
        </span>
        <p className="text-[15px]">{children ?? <>Disponible avec le plan {name}.</>}</p>
      </div>
      <Link
        href="/marque/plans"
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-night px-4 py-2.5 text-sm font-semibold text-paper hover:bg-night-soft sm:self-auto"
      >
        <Icon name="sparkle" className="size-4 text-signal" />
        Passer à {name}
      </Link>
    </div>
  );
}
