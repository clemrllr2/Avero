import { expect, test } from "vitest";
import { engagementRates, parseCount } from "@/lib/engagement-calculator";

test("taux par vues (méthode AVERO) et par abonnés, à partir des moyennes par publication", () => {
  expect(engagementRates({ followers: 20_000, views: 8_000, likes: 500, comments: 40, shares: 60 })).toEqual({
    interactions: 600,
    byViews: 0.075,
    byFollowers: 0.03,
  });
});

test("sans vues ou sans abonnés, le taux correspondant n'est pas calculable (null, jamais Infinity)", () => {
  expect(engagementRates({ followers: 0, views: 0, likes: 10, comments: 0, shares: 0 })).toEqual({
    interactions: 10,
    byViews: null,
    byFollowers: null,
  });
});

test("parseCount accepte les écritures courantes : espaces, 12k, 1,5 M", () => {
  expect(parseCount("12 400")).toBe(12_400);
  expect(parseCount("12 400")).toBe(12_400);
  expect(parseCount("12k")).toBe(12_000);
  expect(parseCount("1,5 M")).toBe(1_500_000);
  expect(parseCount("2.3K")).toBe(2_300);
  expect(parseCount("")).toBe(0);
  expect(parseCount("abc")).toBe(0);
  expect(parseCount("-5")).toBe(0);
});
