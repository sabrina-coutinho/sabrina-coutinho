import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

process.env.DATA_ENCRYPTION_KEY = randomBytes(32).toString("base64");
process.env.HMAC_SECRET = randomBytes(32).toString("base64");

const { encrypt, decrypt, blindIndex } = await import("../lib/crypto");
const { cleanText, escapeHtml, contactSchema } = await import("../lib/sanitize");

test("AES-256-GCM: ida e volta e IV único", () => {
  const a = encrypt("Sabrina <teste> 🤍"), b = encrypt("Sabrina <teste> 🤍");
  assert.notEqual(a, b);
  assert.equal(decrypt(a), "Sabrina <teste> 🤍");
});

test("AES-256-GCM: adulteração é detectada", () => {
  const [v, iv, tag, ct] = encrypt("dado sensível").split(".");
  const flipped = ct[0] === "A" ? "B" + ct.slice(1) : "A" + ct.slice(1);
  assert.throws(() => decrypt([v, iv, tag, flipped].join(".")));
});

test("Índice cego é determinístico e ignora caixa", () => {
  assert.equal(blindIndex("Marca@Ex.com "), blindIndex("marca@ex.com"));
});

test("Sanitização remove XSS e caracteres de controle", () => {
  assert.equal(cleanText('<script>alert(1)</script>Oi<img src=x onerror=alert(1)>'), "alert(1)Oi");
  assert.equal(cleanText("link javascript:alert(1)"), "link alert(1)");
  assert.equal(cleanText("a‮b\u0000c"), "abc");
  assert.equal(escapeHtml(`"><svg onload=x>`), "&quot;&gt;&lt;svg onload&#61;x&gt;");
});

const valid = {
  nome: "Mariana Lopes", marca: "Studio Bem-Estar", email: "MARI@studio.com.br", telefone: "(61) 99999-0000",
  tipo: "Stories", orcamento: "Permuta", mensagem: "Queremos uma campanha de 3 stories em novembro.",
  consentimento: true, website: "", startedAt: Date.now(), turnstileToken: "token-de-teste-123",
};

test("Schema aceita proposta válida e normaliza", () => {
  const r = contactSchema.parse(valid);
  assert.equal(r.email, "mari@studio.com.br");
  assert.equal(r.telefone, "61999990000");
});

test("Schema rejeita injeção, campos extras e falta de consentimento", () => {
  assert.equal(contactSchema.safeParse({ ...valid, email: "x' OR 1=1 --" }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, admin: true }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, consentimento: false }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, tipo: "<script>" }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, website: "spam.com" }).success, false);
});
