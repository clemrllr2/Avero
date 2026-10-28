import { expect, test } from "vitest";
import { homePathFor } from "@/lib/roles";

test("chaque rôle a son espace", () => {
  expect(homePathFor("CREATOR")).toBe("/createur");
  expect(homePathFor("BRAND")).toBe("/marque");
});
