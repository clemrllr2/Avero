import Link from "next/link";
import { signOutAction } from "@/app/(auth)/actions";
import { Avatar } from "@/components/visual/Avatar";
import { PLAN_LABELS } from "@/lib/plans";
import { getCurrentUser } from "@/lib/session";

/** Nom, plan (marques) et déconnexion. Lit la session : à placer dans un <Suspense>. */
export async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="flex items-center gap-2.5">
        <Avatar name={user.name} size="sm" />
        <span className="hidden font-medium sm:inline">{user.name}</span>
      </span>
      {user.plan && (
        <Link
          href="/marque/plans"
          className="rounded-full bg-signal px-2.5 py-0.5 text-xs font-semibold text-ink"
          title="Changer de plan"
        >
          {PLAN_LABELS[user.plan].name}
        </Link>
      )}
      <form action={signOutAction}>
        <button type="submit" className="rounded-full border border-paper/15 px-3 py-1.5 text-paper/70 transition-colors hover:border-paper/40 hover:text-paper">
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
