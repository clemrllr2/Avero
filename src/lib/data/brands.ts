import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { Plan } from "@/lib/types";

/**
 * Change le plan d'une marque (enregistré en base).
 * C'est ici que le paiement Stripe sera branché plus tard.
 */
export async function setBrandPlan(userId: string, plan: Plan): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BRAND" || user.id !== userId) {
    throw new Error("Seule la marque connectée peut changer son propre plan.");
  }
  await prisma.brandProfile.update({ where: { userId }, data: { plan } });
}
