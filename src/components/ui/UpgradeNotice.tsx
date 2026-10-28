import Link from "next/link";
import { PLAN_LABELS } from "@/lib/plans";

export function UpgradeNotice({
  requiredPlan,
  children,
}: {
  requiredPlan: "BASIC" | "PREMIUM";
  children?: React.ReactNode;
}) {
  const name = PLAN_LABELS[requiredPlan].name;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-ink/25 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15px]">
        {children ?? <>Disponible avec le plan {name}.</>}
      </p>
      <Link
        href="/marque/plans"
        className="shrink-0 font-semibold text-cobalt underline-offset-4 hover:underline"
      >
        Passer à {name}
      </Link>
    </div>
  );
}
