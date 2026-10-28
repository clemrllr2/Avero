import { slugFor } from "@/lib/sync/platforms";
import type { Platform } from "@/lib/types";

/** Adresse du bouton « Connecter » : démarre le parcours OAuth (simulé ou réel selon OAUTH2_MODE). */
export function connectHref(platform: Platform): string {
  return `/api/connect/${slugFor(platform)}`;
}
