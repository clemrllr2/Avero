import type { Role } from "@/lib/types";

export type Validation<T> = { ok: true; data: T } | { ok: false; error: string };

export interface SignUpData {
  role: Role;
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 80;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateSignUp(input: Record<string, unknown>): Validation<SignUpData> {
  const role = input.role;
  if (role !== "CREATOR" && role !== "BRAND") return { ok: false, error: "Choisissez un type de compte." };

  const name = text(input.name).slice(0, MAX_NAME_LENGTH);
  if (!name) {
    return {
      ok: false,
      error: role === "CREATOR" ? "Indique ton nom d'affichage." : "Indiquez le nom de votre entreprise.",
    };
  }

  const email = text(input.email).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: "Cette adresse e-mail n'est pas valide." };

  const password = typeof input.password === "string" ? input.password : "";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.` };
  }

  return { ok: true, data: { role, name, email, password } };
}

export function validateSignIn(input: Record<string, unknown>): Validation<SignInData> {
  const email = text(input.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";
  if (!email || !password) return { ok: false, error: "Renseignez votre e-mail et votre mot de passe." };
  return { ok: true, data: { email, password } };
}
