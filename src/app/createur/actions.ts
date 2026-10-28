"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import type { Platform } from "@/lib/types";

// Phase A : pas encore de vraie connexion aux réseaux (tâche B6) ; on affiche le message démo.

export async function refreshAction(platform: Platform): Promise<void> {
  await requireRole("CREATOR");
  void platform;
  redirect("/createur/reseaux?demo=1");
}

export async function disconnectAction(platform: Platform): Promise<void> {
  await requireRole("CREATOR");
  void platform;
  redirect("/createur/reseaux?demo=1");
}
