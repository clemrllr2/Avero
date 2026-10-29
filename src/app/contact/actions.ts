"use server";

import { headers } from "next/headers";
import { isSpam, validateContact } from "@/lib/contact";
import { saveContactMessage } from "@/lib/data/contact";
import { TURNSTILE_FIELD, turnstileConfig, verifyTurnstile } from "@/lib/turnstile";

/** Adresse IP du visiteur (transmise à Cloudflare pour une vérification plus fiable). */
async function visitorIp(): Promise<string | undefined> {
  const h = await headers();
  return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
}

export interface ContactState {
  sent?: boolean;
  /** Adresse à laquelle on répondra, rappelée dans la confirmation */
  replyTo?: string;
  error?: string;
  /** Saisie réaffichée après une erreur (React vide le formulaire). */
  values?: { name: string; email: string; topic: string; message: string };
}

export async function contactAction(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const input = Object.fromEntries(formData);
  // Robot : on fait comme si tout s'était bien passé, sans rien enregistrer.
  if (isSpam(input)) return { sent: true };

  const text = (key: string) => (typeof input[key] === "string" ? (input[key] as string) : "");
  const values = { name: text("name"), email: text("email"), topic: text("topic"), message: text("message") };

  const result = validateContact(input);
  if (!result.ok) return { error: result.error, values };

  // Vérification anti-robot Cloudflare, après les champs : un jeton n'est valable qu'une fois.
  const turnstile = turnstileConfig(process.env);
  if (turnstile.status === "misconfigured") {
    console.error("Turnstile : il faut les deux clés NEXT_PUBLIC_TURNSTILE_SITE_KEY et TURNSTILE_SECRET_KEY.");
    return { error: "Le formulaire est momentanément indisponible. Réessayez plus tard.", values };
  }
  if (turnstile.status === "enabled") {
    const human = await verifyTurnstile(input[TURNSTILE_FIELD], { secret: turnstile.secret, remoteIp: await visitorIp() });
    if (!human) return { error: "La vérification anti-robot n'a pas abouti. Réessayez.", values };
  }

  try {
    await saveContactMessage(result.data);
  } catch (error) {
    console.error("Message de contact non enregistré :", error instanceof Error ? error.message : error);
    return { error: "L'envoi a échoué. Réessayez dans un instant.", values };
  }
  return { sent: true, replyTo: result.data.email };
}
