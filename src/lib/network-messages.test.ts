import { expect, test } from "vitest";
import { networkMessage } from "@/lib/network-messages";

test("code d'erreur connu → message d'erreur", () => {
  expect(networkMessage({ error: "already_linked" })).toEqual({
    tone: "error",
    text: "Ce compte est déjà relié à un autre profil AVERO.",
  });
});

test("code de succès connu → message de succès", () => {
  expect(networkMessage({ success: "connected" })?.tone).toBe("success");
});

test("mode démo → message d'information", () => {
  expect(networkMessage({ demo: "1" })?.tone).toBe("info");
});

test("code inconnu ou absent → aucun message", () => {
  expect(networkMessage({ error: "<script>" })).toBeNull();
  expect(networkMessage({})).toBeNull();
});
