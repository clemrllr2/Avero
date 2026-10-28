"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { homePathFor, parseRole } from "@/lib/roles";
import { validateSignIn, validateSignUp } from "@/lib/validation";

export interface FormState {
  error?: string;
  /** Nom et e-mail saisis, réaffichés après une erreur (React vide le formulaire). Jamais le mot de passe. */
  values?: { name: string; email: string };
}

function keptValues(formData: FormData): FormState["values"] {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return { name: text("name"), email: text("email") };
}

function errorState(error: unknown, formData: FormData): FormState {
  if (!(error instanceof APIError)) console.error(error);
  return {
    error: authErrorMessage(error instanceof APIError ? error.body?.code : undefined),
    values: keptValues(formData),
  };
}

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = validateSignUp(Object.fromEntries(formData));
  if (!result.ok) return { error: result.error, values: keptValues(formData) };

  const { role, name, email, password } = result.data;
  try {
    // Crée le compte, son profil (créateur ou marque) et ouvre la session.
    await auth.api.signUpEmail({ body: { email, password, name, role }, headers: await headers() });
  } catch (error) {
    return errorState(error, formData);
  }
  redirect(homePathFor(role));
}

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = validateSignIn(Object.fromEntries(formData));
  if (!result.ok) return { error: result.error, values: keptValues(formData) };

  let role;
  try {
    const { user } = await auth.api.signInEmail({ body: result.data, headers: await headers() });
    role = parseRole(user.role);
  } catch (error) {
    return errorState(error, formData);
  }
  // L'espace dépend du compte, pas de l'onglet choisi sur la page.
  redirect(role ? homePathFor(role) : "/");
}

export async function signOutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
