import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isPlan } from "@/lib/plans";
import { homePathFor } from "@/lib/roles";
import { SESSION_COOKIE } from "@/lib/session-cookie";
import type { Plan, Role } from "@/lib/types";

export interface CurrentUser {
  id: string;
  role: Role;
  name: string;
  /** null pour un créateur */
  plan: Plan | null;
}

// Phase A : session de démonstration stockée en clair dans un cookie httpOnly.
// La phase B la remplace par Better Auth sans changer ces signatures.
const DEMO_CREATOR_ID = "c1";
const DEMO_BRAND_ID = "demo-brand";
const ONE_WEEK = 60 * 60 * 24 * 7;

interface DemoSession {
  role: Role;
  name: string;
  plan: Plan | null;
}

function parseSession(raw: string | undefined): DemoSession | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<DemoSession>;
    if (data.role !== "CREATOR" && data.role !== "BRAND") return null;
    if (typeof data.name !== "string") return null;
    const plan = data.role === "BRAND" ? (isPlan(data.plan) ? data.plan : "FREE") : null;
    return { role: data.role, name: data.name, plan };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = parseSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return {
    id: session.role === "CREATOR" ? DEMO_CREATOR_ID : DEMO_BRAND_ID,
    ...session,
  };
}

/** Renvoie l'utilisateur s'il a ce rôle ; sinon redirige vers la connexion ou vers son propre espace. */
export async function requireRole(role: Role): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.role !== role) redirect(homePathFor(user.role));
  // Les pages connectées sont calculées à chaque visite (elles utilisent la date du jour pour les 30 derniers jours).
  await connection();
  return user;
}

export async function writeSession(session: DemoSession): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK,
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
