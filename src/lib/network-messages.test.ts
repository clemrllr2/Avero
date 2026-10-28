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

test("nouveaux codes de la connexion réelle et simulée", () => {
  expect(networkMessage({ error: "not_configured" })?.text).toBe(
    "La connexion à ce réseau n'est pas encore configurée. Réessaie plus tard.",
  );
  expect(networkMessage({ error: "connect_failed" })?.tone).toBe("error");
  expect(networkMessage({ error: "expired" })?.tone).toBe("error");
  expect(networkMessage({ success: "up_to_date" })?.text).toBe("Tes statistiques sont déjà à jour.");
});

test("l'ancien message de démonstration a disparu", () => {
  expect(networkMessage({ demo: "1" })).toBeNull();
});

test("code inconnu ou absent → aucun message", () => {
  expect(networkMessage({ error: "<script>" })).toBeNull();
  expect(networkMessage({})).toBeNull();
});
