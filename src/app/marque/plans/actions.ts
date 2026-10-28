"use server";

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
  redirect("/marque?success=plan");
}
