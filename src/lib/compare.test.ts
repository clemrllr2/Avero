import { expect, test } from "vitest";
import { bestIndex, normalizeForRadar, parseCompareIds } from "@/lib/compare";

test("normalizeForRadar : chaque indicateur ramené sur 100 par rapport au meilleur créateur", () => {
  expect(normalizeForRadar([[10, null], [20, 0]])).toEqual([[50, 0], [100, 0]]);
  expect(normalizeForRadar([[-5, 3], [-10, 6]])).toEqual([[0, 50], [0, 100]]);
  expect(normalizeForRadar([])).toEqual([]);
});

test("bestIndex : plus grande valeur, valeurs absentes ignorées", () => {
  expect(bestIndex([10, 30, 20])).toBe(1);
  expect(bestIndex([null, 5, null])).toBe(1);
  expect(bestIndex([-20, -5])).toBe(1);
});

test("bestIndex : égalité ou aucune valeur → pas de mise en avant", () => {
  expect(bestIndex([30, 30, 10])).toBeNull();
  expect(bestIndex([null, null])).toBeNull();
  expect(bestIndex([])).toBeNull();
});

test("parseCompareIds : liste séparée par des virgules, sans doublon, 4 au maximum", () => {
  expect(parseCompareIds("c1,c2,c1, c3 ,,c4,c5")).toEqual(["c1", "c2", "c3", "c4"]);
  expect(parseCompareIds(undefined)).toEqual([]);
  expect(parseCompareIds(["c1,c2", "c3"])).toEqual(["c1", "c2"]);
});
