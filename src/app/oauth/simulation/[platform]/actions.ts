"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { platformFromSlug, slugFor } from "@/lib/sync/platforms";
import { encodeSimulatedCode, parseConsentForm } from "@/lib/sync/simulated";

export interface ConsentState {
  error?: string;
  /** Choix réaffichés après une erreur (React vide le formulaire). */
  values?: { username: string; size: string; scenario: string };
}

/**
 * Réponse de l'écran d'autorisation simulé : renvoie vers le même retour que les vrais réseaux,
 * avec un code (« Autoriser ») ou error=access_denied (« Refuser »). L'adresse de retour est
 * toujours celle d'AVERO, jamais une adresse reçue dans le formulaire.
 */
export async function simulatedConsentAction(_prev: ConsentState, formData: FormData): Promise<ConsentState> {
  await requireRole("CREATOR");
  const platform = platformFromSlug(String(formData.get("platform") ?? ""));
  if (!platform) redirect("/createur/reseaux");

  const callback = `/api/connect/${slugFor(platform)}/callback`;
  const state = String(formData.get("state") ?? "");
  if (formData.get("decision") !== "allow") {
    redirect(`${callback}?${new URLSearchParams({ error: "access_denied", state })}`);
  }

  const result = parseConsentForm(Object.fromEntries(formData), platform, new Date());
  if (!result.ok) {
    const text = (key: string) => String(formData.get(key) ?? "");
    return { error: result.error, values: { username: text("username"), size: text("size"), scenario: text("scenario") } };
  }
  redirect(`${callback}?${new URLSearchParams({ code: encodeSimulatedCode(result.grant), state })}`);
}
