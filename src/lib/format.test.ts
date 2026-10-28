import { describe, expect, test } from "vitest";
import { formatCompact, formatDate, formatGrowth, formatNumber, formatPercent } from "@/lib/format";

// Intl insère des espaces insécables : on les normalise pour comparer.
const plain = (s: string) => s.replace(/ | /g, " ");

describe("format", () => {
  test("formatNumber : séparateur de milliers français", () => {
    expect(plain(formatNumber(1234567))).toBe("1 234 567");
    expect(plain(formatNumber(2000.4))).toBe("2 000");
  });

  test("formatCompact : k et M", () => {
    expect(plain(formatCompact(12345))).toBe("12,3 k");
    expect(plain(formatCompact(1_200_000))).toBe("1,2 M");
    expect(plain(formatCompact(850))).toBe("850");
  });

  test("formatPercent : une décimale, — si null", () => {
    expect(plain(formatPercent(0.0625))).toBe("6,3 %");
    expect(formatPercent(null)).toBe("—");
  });

  test("formatGrowth : signe explicite, message si null", () => {
    expect(plain(formatGrowth(200))).toBe("+200");
    expect(plain(formatGrowth(-15))).toBe("-15");
    expect(formatGrowth(0)).toBe("0");
    expect(formatGrowth(null)).toBe("Données insuffisantes");
  });

  test("formatDate : jour mois abrégé année", () => {
    expect(plain(formatDate(new Date("2026-10-26T12:00:00Z")))).toBe("26 oct. 2026");
  });
});
