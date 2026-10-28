import { expect, test } from "vitest";
import { platformFromSlug, slugFor } from "@/lib/sync/platforms";

test("platformFromSlug : 'instagram' et 'tiktok' reconnus, le reste → null", () => {
  expect(platformFromSlug("instagram")).toBe("INSTAGRAM");
  expect(platformFromSlug("tiktok")).toBe("TIKTOK");
  for (const slug of ["facebook", "Instagram", "", "INSTAGRAM", "__proto__"]) expect(platformFromSlug(slug)).toBeNull();
});

test("slugFor est l'inverse de platformFromSlug", () => {
  expect(slugFor("INSTAGRAM")).toBe("instagram");
  expect(slugFor("TIKTOK")).toBe("tiktok");
});
