import type { Role } from "@/lib/types";

/** Valeur de ?role= dans l'adresse des pages de connexion et d'inscription. */
export type RoleSlug = "createur" | "marque";

/** Rôle reçu de l'extérieur (formulaire, base) : uniquement "CREATOR" ou "BRAND", sinon null. */
export function parseRole(value: unknown): Role | null {
  return value === "CREATOR" || value === "BRAND" ? value : null;
}

export function homePathFor(role: Role): "/createur" | "/marque" {
  return role === "CREATOR" ? "/createur" : "/marque";
}

/** « marque » si c'est exactement la valeur reçue ; sinon « createur » (valeur par défaut). */
export function parseRoleSlug(value: string | string[] | undefined): RoleSlug {
  return value === "marque" ? "marque" : "createur";
}

export function roleFromSlug(slug: RoleSlug): Role {
  return slug === "marque" ? "BRAND" : "CREATOR";
}
