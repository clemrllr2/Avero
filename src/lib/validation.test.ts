import { describe, expect, test } from "vitest";
import { validateSignIn, validateSignUp } from "@/lib/validation";

const valid = { role: "CREATOR", name: "Léa Martin", email: "lea@exemple.fr", password: "motdepasse" };

describe("validateSignUp", () => {
  test("données correctes → valeurs nettoyées", () => {
    expect(validateSignUp({ ...valid, name: "  Léa Martin ", email: " Lea@Exemple.FR " })).toEqual({
      ok: true,
      data: { role: "CREATOR", name: "Léa Martin", email: "lea@exemple.fr", password: "motdepasse" },
    });
  });

  test("rôle inconnu ou absent → refus", () => {
    expect(validateSignUp({ ...valid, role: "ADMIN" })).toEqual({ ok: false, error: "Choisissez un type de compte." });
    expect(validateSignUp({ ...valid, role: null }).ok).toBe(false);
  });

  test("nom vide → message selon le rôle", () => {
    expect(validateSignUp({ ...valid, name: " " })).toEqual({ ok: false, error: "Indique ton nom d'affichage." });
    expect(validateSignUp({ ...valid, role: "BRAND", name: "" })).toEqual({
      ok: false,
      error: "Indiquez le nom de votre entreprise.",
    });
  });

  test("e-mail invalide → refus", () => {
    expect(validateSignUp({ ...valid, email: "pas-un-email" })).toEqual({
      ok: false,
      error: "Cette adresse e-mail n'est pas valide.",
    });
  });

  test("mot de passe de moins de 8 caractères → refus", () => {
    expect(validateSignUp({ ...valid, password: "1234567" })).toEqual({
      ok: false,
      error: "Le mot de passe doit contenir au moins 8 caractères.",
    });
  });
});

describe("validateSignIn", () => {
  test("e-mail et mot de passe requis", () => {
    expect(validateSignIn({ email: "", password: "" })).toEqual({
      ok: false,
      error: "Renseignez votre e-mail et votre mot de passe.",
    });
    expect(validateSignIn({ email: "a@b.fr", password: "x" })).toEqual({
      ok: true,
      data: { email: "a@b.fr", password: "x" },
    });
  });
});
