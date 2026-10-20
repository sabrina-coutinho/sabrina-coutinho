// Módulo só de servidor (usa node:crypto e segredos). Não importe em componentes "use client".
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Criptografia em repouso — AES-256-GCM (autenticada).
 * Formato salvo no banco:  v1.<iv base64url>.<authTag base64url>.<ciphertext base64url>
 * O prefixo de versão permite rotacionar a chave no futuro sem migração destrutiva.
 */
const VERSION = "v1";

function key(): Buffer {
  const raw = process.env.DATA_ENCRYPTION_KEY;
  if (!raw) throw new Error("DATA_ENCRYPTION_KEY ausente");
  const k = Buffer.from(raw, "base64");
  if (k.length !== 32) throw new Error("DATA_ENCRYPTION_KEY precisa ter 32 bytes (base64). Use: openssl rand -base64 32");
  return k;
}

export function encrypt(plain: string): string {
  const iv = randomBytes(12); // 96 bits, recomendado para GCM
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), ct.toString("base64url")].join(".");
}

export function decrypt(payload: string): string {
  const [v, iv, tag, ct] = payload.split(".");
  if (v !== VERSION || !iv || !tag || !ct) throw new Error("Payload criptografado inválido");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(ct, "base64url")), decipher.final()]).toString("utf8");
}

/** HMAC-SHA256 determinístico: permite achar/excluir registros por e-mail (direitos do titular, LGPD) sem guardar o e-mail em claro. */
export function blindIndex(value: string): string {
  const secret = process.env.HMAC_SECRET;
  if (!secret) throw new Error("HMAC_SECRET ausente");
  return createHmac("sha256", secret).update(value.trim().toLowerCase()).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
