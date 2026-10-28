import type { Platform } from "@/lib/types";

/**
 * Adresse du bouton « Connecter ». Phase A : renvoie sur « Mes réseaux » avec le message démo.
 * Tâche B6 : `/api/connect/${platform === "INSTAGRAM" ? "instagram" : "tiktok"}`.
 */
export function connectHref(platform: Platform): string {
  void platform;
  return "/createur/reseaux?demo=1";
}
