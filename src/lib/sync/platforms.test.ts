import { expect, test } from "vitest";
import { isPlatform, platformFromSlug, slugFor } from "@/lib/sync/platforms";

test("platformFromSlug : 'instagram' et 'tiktok' reconnus, le reste → null", () => {
  expect(platformFromSlug("instagram")).toBe("INSTAGRAM");
  expect(platformFromSlug("tiktok")).toBe("TIKTOK");
  for (const slug of ["facebook", "Instagram", "", "INSTAGRAM", "__proto__"]) expect(platformFromSlug(slug)).toBeNull();
});

test("slugFor est l'inverse de platformFromSlug", () => {
  expect(slugFor("INSTAGRAM")).toBe("instagram");
  expect(slugFor("TIKTOK")).toBe("tiktok");
});

test("isPlatform : uniquement INSTAGRAM ou TIKTOK (valeur reçue d'un bouton, donc trafiquable)", () => {
  expect(isPlatform("INSTAGRAM")).toBe(true);
  expect(isPlatform("TIKTOK")).toBe(true);
  for (const value of ["instagram", "FACEBOOK", "", null, undefined, 1]) expect(isPlatform(value)).toBe(false);
});
