import { expect, test } from "vitest";
import { homePathFor, parseRoleSlug, roleFromSlug } from "@/lib/roles";

test("chaque rôle a son espace", () => {
  expect(homePathFor("CREATOR")).toBe("/createur");
  expect(homePathFor("BRAND")).toBe("/marque");
});

test("parseRoleSlug : « marque » ou, par défaut, « createur »", () => {
  expect(parseRoleSlug("marque")).toBe("marque");
  expect(parseRoleSlug("createur")).toBe("createur");
  expect(parseRoleSlug(undefined)).toBe("createur");
  expect(parseRoleSlug("ADMIN")).toBe("createur");
  expect(parseRoleSlug(["marque", "createur"])).toBe("createur");
});

test("roleFromSlug", () => {
  expect(roleFromSlug("marque")).toBe("BRAND");
  expect(roleFromSlug("createur")).toBe("CREATOR");
});
