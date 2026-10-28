"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { setBrandPlan } from "@/lib/data/brands";
import { isPlan } from "@/lib/plans";
import { requireRole } from "@/lib/session";

export async function choosePlanAction(formData: FormData): Promise<void> {
  const user = await requireRole("BRAND");
  const plan = formData.get("plan");
  // Toute valeur autre que FREE / BASIC / PREMIUM est ignorée.
  if (!isPlan(plan)) redirect("/marque/plans");
  await setBrandPlan(user.id, plan);
  // Le plan est affiché dans l'en-tête (partagé entre les pages) : on le fait recalculer lui aussi.
  refresh();
  redirect("/marque?success=plan");
}
