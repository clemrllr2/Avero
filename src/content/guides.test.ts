import { expect, test } from "vitest";
import { GUIDES, findGuide } from "@/content/guides";

/** Pages publiques existantes vers lesquelles un guide peut renvoyer. */
const KNOWN_PAGES = ["/createurs", "/marques", "/outils/calcul-taux-engagement", "/guides", ...GUIDES.map((g) => `/guides/${g.slug}`)];

test("adresses des guides uniques, en minuscules et sans accent", () => {
  const slugs = GUIDES.map((g) => g.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
  for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
});

test("titres et descriptions à la bonne longueur pour Google", () => {
  for (const guide of GUIDES) {
    // Titre affiché par Google = titre + « | AVERO » : 60 caractères au plus pour ne pas être coupé.
    expect(`${guide.title} | AVERO`.length, guide.slug).toBeLessThanOrEqual(60);
    expect(guide.description.length, guide.slug).toBeGreaterThanOrEqual(110);
    expect(guide.description.length, guide.slug).toBeLessThanOrEqual(160);
  }
});

test("aucun lien interne cassé dans les guides", () => {
  for (const guide of GUIDES) {
    for (const section of guide.sections) {
      for (const block of section.blocks) {
        if (block.type !== "links") continue;
        for (const link of block.items) expect(KNOWN_PAGES, `${guide.slug} → ${link.href}`).toContain(link.href);
      }
    }
  }
});

test("findGuide : guide connu ou undefined", () => {
  expect(findGuide("taux-engagement")?.heading).toBe("Taux d'engagement : définition et calcul");
  expect(findGuide("inconnu")).toBeUndefined();
});
