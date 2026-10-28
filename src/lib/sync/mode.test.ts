import { expect, test } from "vitest";
import { parseOAuthMode } from "@/lib/sync/mode";

test("seule la valeur exacte « real » active le mode réel", () => {
  expect(parseOAuthMode("real")).toBe("real");
});

test("tout le reste (absent, vide, simulated, faute de frappe) → simulé", () => {
  for (const value of [undefined, "", "simulated", "REAL", "real ", "reel", "true"]) {
    expect(parseOAuthMode(value)).toBe("simulated");
  }
});
