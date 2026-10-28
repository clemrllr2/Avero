import { expect, test } from "vitest";
import { avatarColors, countryFlag, initials, sparklinePath, thumbColors } from "@/lib/visual";

test("avatarColors : toujours les mêmes couleurs pour un même nom, différentes d'un nom à l'autre", () => {
  expect(avatarColors("Léa Martin")).toEqual(avatarColors("Léa Martin"));
  expect(avatarColors("Léa Martin")).not.toEqual(avatarColors("Hugo Bernard"));
  expect(avatarColors("")).toHaveLength(2);
});

/** Contraste du blanc sur une couleur hsl(h s% l%) (formule WCAG). */
function whiteContrast(hsl: string): number {
  const [h, s, l] = hsl.match(/[\d.]+/g)!.map(Number);
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = 0.2126 * lin(f(0)) + 0.7152 * lin(f(8)) + 0.0722 * lin(f(4));
  return 1.05 / (lum + 0.05);
}

test("avatarColors : initiales blanches lisibles quel que soit le nom (contraste ≥ 3,5 et ≥ 4,5)", () => {
  for (let i = 0; i < 300; i++) {
    const [light, dark] = avatarColors(`Créateur ${i}`);
    expect(whiteContrast(light)).toBeGreaterThanOrEqual(3.5);
    expect(whiteContrast(dark)).toBeGreaterThanOrEqual(4.5);
  }
});

test("thumbColors : vignettes de toutes les teintes, stables pour une même graine", () => {
  expect(thumbColors("@lea.martin")).toEqual(thumbColors("@lea.martin"));
  const hues = new Set(Array.from({ length: 60 }, (_, i) => Math.floor(Number(thumbColors(`post-${i}`)[0].match(/\d+/)![0]) / 60)));
  expect(hues.size).toBeGreaterThanOrEqual(5);
});

test("initials : première lettre du premier et du dernier mot, en majuscules", () => {
  expect(initials("Léa Martin")).toBe("LM");
  expect(initials("nike")).toBe("N");
  expect(initials("Jean Pierre Dupont")).toBe("JD");
  expect(initials("  ")).toBe("?");
  expect(initials("🦄 Studio")).toBe("🦄S");
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
