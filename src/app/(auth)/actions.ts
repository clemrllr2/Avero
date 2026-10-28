"use server";

import { redirect } from "next/navigation";
import { homePathFor } from "@/lib/roles";
import { clearSession, writeSession } from "@/lib/session";
import { validateSignIn, validateSignUp } from "@/lib/validation";

export interface FormState {
  error?: string;
}

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = validateSignUp(Object.fromEntries(formData));
  if (!result.ok) return { error: result.error };

  const { role, name } = result.data;
  await writeSession({ role, name, plan: role === "BRAND" ? "FREE" : null });
  redirect(homePathFor(role));
}

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = validateSignIn(Object.fromEntries(formData));
  if (!result.ok) return { error: result.error };

  // Mode démo : le rôle est choisi dans le formulaire (retiré en phase B).
  const role = formData.get("demoRole") === "BRAND" ? "BRAND" : "CREATOR";
  await writeSession(
    role === "CREATOR"
      ? { role, name: "Léa Martin", plan: null }
      : { role, name: "Marque démo", plan: "FREE" },
  );
  redirect(homePathFor(role));
}

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
