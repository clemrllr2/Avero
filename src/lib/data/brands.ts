import { getCurrentUser, writeSession } from "@/lib/session";
import type { Plan } from "@/lib/types";

/**
 * Change le plan d'une marque. Phase A : met à jour la session de démo ; phase B : Prisma.
 * C'est ici que le paiement Stripe sera branché plus tard.
 */
export async function setBrandPlan(userId: string, plan: Plan): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BRAND" || user.id !== userId) {
    throw new Error("Seule la marque connectée peut changer son propre plan.");
  }
  await writeSession({ role: "BRAND", name: user.name, plan });
}
