import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Chiffrement des jetons Instagram/TikTok avant de les enregistrer (AES-256-GCM).
// Clé : TOKEN_ENCRYPTION_KEY dans .env, 32 octets en base64 (« openssl rand -base64 32 »).
// Format : "iv.tag.données", chaque partie en base64url.

function key(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  const buffer = raw ? Buffer.from(raw, "base64") : Buffer.alloc(0);
  if (buffer.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY doit contenir 32 octets en base64 (openssl rand -base64 32).");
  }
  return buffer;
}

export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((part) => part.toString("base64url")).join(".");
}

/** Lève une erreur si le texte chiffré a été altéré ou si la clé ne correspond pas. */
export function decrypt(payload: string): string {
  const [iv, tag, data] = payload.split(".").map((part) => Buffer.from(part, "base64url"));
  if (!iv || !tag || !data || iv.length !== 12 || tag.length !== 16) throw new Error("Jeton chiffré illisible.");
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
