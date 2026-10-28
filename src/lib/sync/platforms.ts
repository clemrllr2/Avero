import type { Platform } from "@/lib/types";

const SLUGS = { INSTAGRAM: "instagram", TIKTOK: "tiktok" } as const satisfies Record<Platform, string>;

/** Nom du réseau dans les adresses (/api/connect/instagram…). */
export function slugFor(platform: Platform): string {
  return SLUGS[platform];
}

/** Réseau correspondant à un nom d'adresse ; null si inconnu. */
export function platformFromSlug(slug: string): Platform | null {
  return slug === "instagram" ? "INSTAGRAM" : slug === "tiktok" ? "TIKTOK" : null;
}
