"use server";

import { isSpam, validateContact } from "@/lib/contact";
import { saveContactMessage } from "@/lib/data/contact";

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

  try {
    await saveContactMessage(result.data);
  } catch (error) {
    console.error("Message de contact non enregistré :", error instanceof Error ? error.message : error);
    return { error: "L'envoi a échoué. Réessayez dans un instant.", values };
  }
  return { sent: true, replyTo: result.data.email };
}
