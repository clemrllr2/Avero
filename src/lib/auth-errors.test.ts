import { expect, test } from "vitest";
import { authErrorMessage } from "@/lib/auth-errors";

test("e-mail déjà utilisé à l'inscription", () => {
  expect(authErrorMessage("USER_ALREADY_EXISTS")).toBe("Un compte existe déjà avec cet e-mail.");
  expect(authErrorMessage("USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL")).toBe("Un compte existe déjà avec cet e-mail.");
});

test("mauvais identifiants à la connexion", () => {
  expect(authErrorMessage("INVALID_EMAIL_OR_PASSWORD")).toBe("E-mail ou mot de passe incorrect.");
});

test("toute autre erreur → message générique, sans détail technique", () => {
  expect(authErrorMessage("SOMETHING_ELSE")).toBe("Une erreur est survenue. Réessayez dans un instant.");
  expect(authErrorMessage(undefined)).toBe("Une erreur est survenue. Réessayez dans un instant.");
});
