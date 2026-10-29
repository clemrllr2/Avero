import type { Validation } from "@/lib/validation";

export type ContactTopic = "CREATOR" | "BRAND" | "OTHER";

/** Sujets proposés dans le formulaire, dans l'ordre d'affichage. */
export const CONTACT_TOPICS: { value: ContactTopic; label: string }[] = [
  { value: "CREATOR", label: "Je suis créateur" },
  { value: "BRAND", label: "Je suis une marque" },
  { value: "OTHER", label: "Autre demande" },
];

export const CONTACT_MESSAGE_MIN = 10;
export const CONTACT_MESSAGE_MAX = 2000;
const MAX_NAME_LENGTH = 80;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactData {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(input: Record<string, unknown>): Validation<ContactData> {
  const name = text(input.name).slice(0, MAX_NAME_LENGTH);
  if (!name) return { ok: false, error: "Indiquez votre nom." };

  const email = text(input.email).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: "Cette adresse e-mail n'est pas valide." };

  const topic = CONTACT_TOPICS.find((t) => t.value === input.topic)?.value;
  if (!topic) return { ok: false, error: "Choisissez un sujet." };

  const message = text(input.message);
  if (message.length < CONTACT_MESSAGE_MIN) {
    return { ok: false, error: `Votre message doit contenir au moins ${CONTACT_MESSAGE_MIN} caractères.` };
  }
  if (message.length > CONTACT_MESSAGE_MAX) {
    return { ok: false, error: `Votre message ne doit pas dépasser ${CONTACT_MESSAGE_MAX} caractères.` };
  }

  return { ok: true, data: { name, email, topic, message } };
}

/** Champ invisible pour les humains : s'il est rempli, c'est un robot (le message est ignoré sans le dire). */
export function isSpam(input: Record<string, unknown>): boolean {
  return text(input.website) !== "";
}
