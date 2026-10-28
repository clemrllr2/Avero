import { randomBytes } from "node:crypto";
import { beforeAll, expect, test } from "vitest";
import { decrypt, encrypt } from "@/lib/crypto";

beforeAll(() => {
  process.env.TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("base64");
});

test("déchiffrer un texte chiffré redonne le texte d'origine", () => {
  expect(decrypt(encrypt("abc"))).toBe("abc");
  expect(decrypt(encrypt("jeton-éàü-🔐"))).toBe("jeton-éàü-🔐");
});

test("deux chiffrements du même texte donnent des résultats différents", () => {
  expect(encrypt("abc")).not.toBe(encrypt("abc"));
});

test("un texte chiffré modifié fait lever une erreur", () => {
  const [iv, tag, data] = encrypt("abc").split(".");
  const altered = data.startsWith("A") ? `B${data.slice(1)}` : `A${data.slice(1)}`;
  expect(() => decrypt(`${iv}.${tag}.${altered}`)).toThrow();
  expect(() => decrypt("pas-un-jeton")).toThrow();
});

test("clé absente ou de mauvaise taille → erreur explicite", () => {
  const saved = process.env.TOKEN_ENCRYPTION_KEY;
  process.env.TOKEN_ENCRYPTION_KEY = Buffer.from("trop courte").toString("base64");
  expect(() => encrypt("abc")).toThrow(/TOKEN_ENCRYPTION_KEY/);
  delete process.env.TOKEN_ENCRYPTION_KEY;
  expect(() => encrypt("abc")).toThrow(/TOKEN_ENCRYPTION_KEY/);
  process.env.TOKEN_ENCRYPTION_KEY = saved;
});
