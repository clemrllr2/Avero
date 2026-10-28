import { expect, test } from "vitest";
import { avatarColors, countryFlag, initials, sparklinePath } from "@/lib/visual";

test("avatarColors : toujours les mêmes couleurs pour un même nom, différentes d'un nom à l'autre", () => {
  expect(avatarColors("Léa Martin")).toEqual(avatarColors("Léa Martin"));
  expect(avatarColors("Léa Martin")).not.toEqual(avatarColors("Hugo Bernard"));
  expect(avatarColors("")).toHaveLength(2);
});

test("initials : première lettre du premier et du dernier mot, en majuscules", () => {
  expect(initials("Léa Martin")).toBe("LM");
  expect(initials("nike")).toBe("N");
  expect(initials("Jean Pierre Dupont")).toBe("JD");
  expect(initials("  ")).toBe("?");
});

test("sparklinePath : liste vide, un seul point ou valeurs égales → ligne plate sans NaN", () => {
  expect(sparklinePath([], 100, 20).line).not.toContain("NaN");
  expect(sparklinePath([7], 100, 20).line).toBe("M0 10 L100 10");
  expect(sparklinePath([5, 5, 5], 100, 20).line).toBe("M0 10 L50 10 L100 10");
});

test("sparklinePath : la plus petite valeur en bas, la plus grande en haut ; l'aire se referme en bas", () => {
  const { line, area } = sparklinePath([0, 10], 100, 20);
  expect(line).toBe("M0 20 L100 0");
  expect(area).toBe("M0 20 L100 0 L100 20 L0 20 Z");
});

test("countryFlag : drapeau emoji pour un code pays à 2 lettres, rien sinon", () => {
  expect(countryFlag("FR")).toBe("🇫🇷");
  expect(countryFlag("fr")).toBe("🇫🇷");
  expect(countryFlag("FRA")).toBe("");
  expect(countryFlag("")).toBe("");
  expect(countryFlag("1A")).toBe("");
});
