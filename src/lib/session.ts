import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { homePathFor, parseRole } from "@/lib/roles";
import type { Plan, Role } from "@/lib/types";

export interface CurrentUser {
  /** Identifiant du compte Better Auth */
  id: string;
  role: Role;
  name: string;
  /** null pour un créateur */
  plan: Plan | null;
}

/**
 * Utilisateur connecté (session Better Auth + profil créateur ou marque), ou null.
 * `cache` : l'en-tête et la page le demandent tous les deux, la base n'est interrogée qu'une fois par affichage.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { id } = session.user;
  const role = parseRole(session.user.role);
  if (role === "CREATOR") {
    const profile = await prisma.creatorProfile.findUnique({ where: { userId: id } });
    return profile && { id, role, name: profile.displayName, plan: null };
  }
  if (role === "BRAND") {
    const profile = await prisma.brandProfile.findUnique({ where: { userId: id } });
    return profile && { id, role, name: profile.companyName, plan: profile.plan };
  }
  return null;
});

/** Renvoie l'utilisateur s'il a ce rôle ; sinon redirige vers la connexion ou vers son propre espace. */
export async function requireRole(role: Role): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.role !== role) redirect(homePathFor(user.role));
  // Les pages connectées sont calculées à chaque visite (elles utilisent la date du jour pour les 30 derniers jours).
  await connection();
  return user;
}
