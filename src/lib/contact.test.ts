import { describe, expect, test } from "vitest";
import { CONTACT_MESSAGE_MAX, CONTACT_MESSAGE_MIN, faqForTopic, isSpam, validateContact } from "@/lib/contact";

const valid = { name: "Léa Martin", email: "lea@exemple.fr", topic: "BRAND", message: "Bonjour, une question sur le plan Premium." };

describe("validateContact", () => {
  test("données correctes → valeurs nettoyées", () => {
    expect(validateContact({ ...valid, name: "  Léa Martin ", email: " Lea@Exemple.FR ", message: "  Bonjour, une question sur le plan Premium.  " })).toEqual({
      ok: true,
      data: { name: "Léa Martin", email: "lea@exemple.fr", topic: "BRAND", message: "Bonjour, une question sur le plan Premium." },
    });
  });

  test("nom absent → message", () => {
    expect(validateContact({ ...valid, name: "   " })).toEqual({ ok: false, error: "Indiquez votre nom." });
  });

  test("e-mail invalide → message", () => {
    expect(validateContact({ ...valid, email: "lea@" })).toEqual({ ok: false, error: "Cette adresse e-mail n'est pas valide." });
  });

  test("sujet inconnu ou absent → message", () => {
    for (const topic of ["ADMIN", "", undefined]) {
      expect(validateContact({ ...valid, topic })).toEqual({ ok: false, error: "Choisissez un sujet." });
    }
  });

  test("message trop court ou trop long → message", () => {
    expect(validateContact({ ...valid, message: "x".repeat(CONTACT_MESSAGE_MIN - 1) })).toEqual({
      ok: false,
      error: `Votre message doit contenir au moins ${CONTACT_MESSAGE_MIN} caractères.`,
    });
    expect(validateContact({ ...valid, message: "x".repeat(CONTACT_MESSAGE_MAX + 1) })).toEqual({
      ok: false,
      error: `Votre message ne doit pas dépasser ${CONTACT_MESSAGE_MAX} caractères.`,
    });
  });
});

test("isSpam : le champ caché anti-robots rempli → spam", () => {
  expect(isSpam({ website: "http://spam.test" })).toBe(true);
  expect(isSpam({ website: "" })).toBe(false);
  expect(isSpam({})).toBe(false);
});

test("faqForTopic : réponses de la FAQ utiles selon le profil choisi", () => {
  expect(faqForTopic("CREATOR").map((i) => i.question)).toEqual([
    "Faut-il un compte Instagram professionnel ?",
    "Que voient les marques de mes données ?",
    "Puis-je déconnecter un réseau ?",
  ]);
  expect(faqForTopic("BRAND").map((i) => i.question)).toEqual([
    "D'où viennent les chiffres ?",
    "Combien coûte AVERO ?",
  ]);
  expect(faqForTopic("OTHER")).toEqual([]);
  expect(faqForTopic(undefined)).toEqual([]);
});
