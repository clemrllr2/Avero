import type { ContactData } from "@/lib/contact";
import { prisma } from "@/lib/db";

/** Enregistre un message du formulaire de contact (consultable dans Supabase, table ContactMessage). */
export async function saveContactMessage(data: ContactData): Promise<void> {
  await prisma.contactMessage.create({ data });
}
