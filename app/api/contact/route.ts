import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, escapeHtml } from "@/lib/sanitize";
import { blindIndex, encrypt } from "@/lib/crypto";
import { CSRF_COOKIE, CSRF_HEADER, sameOrigin, verifyCsrf } from "@/lib/csrf";
import { clientIp, limiters } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POLICY_VERSION = "2026-10";
const MAX_BODY_BYTES = 8 * 1024;
const MIN_FILL_MS = 3000;

const fail = (status: number, error: string, extra?: Record<string, unknown>) =>
  NextResponse.json({ ok: false, error, ...extra }, { status });

export async function POST(req: NextRequest) {
  // 1) Origem + CSRF
  if (!sameOrigin(req.headers)) return fail(403, "Origem não permitida.");
  if (!verifyCsrf(req.cookies.get(CSRF_COOKIE)?.value, req.headers.get(CSRF_HEADER)))
    return fail(403, "Sessão expirada. Recarregue a página e tente de novo.");

  // 2) Tipo e tamanho do corpo
  if (!req.headers.get("content-type")?.startsWith("application/json")) return fail(415, "Formato não suportado.");
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413, "Mensagem grande demais.");

  // 3) Rate limit específico do formulário
  const ip = clientIp(req.headers);
  const rl = await limiters.contact.limit(ip);
  if (!rl.success) return fail(429, "Você já enviou várias propostas. Tente de novo em uma hora ou fale pelo WhatsApp.");

  // 4) Validação + sanitização (allowlist)
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return fail(400, "Dados inválidos."); }
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map(i => [i.path.join("."), i.message]));
    return fail(422, "Revise os campos destacados.", { fields });
  }
  const data = parsed.data;

  // 5) Anti-bot: honeypot, tempo mínimo e Turnstile
  if (data.website || Date.now() - data.startedAt < MIN_FILL_MS) return NextResponse.json({ ok: true }); // resposta silenciosa para bots
  if (!(await verifyTurnstile(data.turnstileToken, ip))) return fail(400, "Não conseguimos confirmar que você é humano. Atualize a página e tente de novo.");

  // 6) Persistência cifrada (Prisma = consultas parametrizadas, sem SQL injection)
  try {
    await db.proposta.create({
      data: {
        nomeEnc: encrypt(data.nome),
        emailEnc: encrypt(data.email),
        telefoneEnc: data.telefone ? encrypt(data.telefone) : null,
        mensagemEnc: encrypt(data.mensagem),
        emailHash: blindIndex(data.email),
        marca: data.marca,
        tipo: data.tipo,
        orcamento: data.orcamento || "A combinar",
        consentAt: new Date(),
        policyVersion: POLICY_VERSION,
      },
    });
  } catch (err) {
    // Log sem dados pessoais (LGPD: minimização)
    console.error("[contact] falha ao salvar", (err as Error).name);
    return fail(500, "Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.");
  }

  // 7) Notificação para a assessoria (conteúdo escapado; chave só no servidor)
  if (process.env.RESEND_API_KEY && process.env.CONTACT_INBOX) {
    const h = escapeHtml;
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Site Sabrina <propostas@sabrinacoutinho.com.br>",
        to: [process.env.CONTACT_INBOX],
        reply_to: data.email,
        subject: `Nova proposta: ${data.marca} · ${data.tipo}`.slice(0, 140),
        html: `<p><b>${h(data.nome)}</b> (${h(data.marca)})<br>${h(data.email)}${data.telefone ? " · " + h(data.telefone) : ""}</p>
               <p>Tipo: ${h(data.tipo)}<br>Orçamento: ${h(data.orcamento || "A combinar")}</p>
               <p style="white-space:pre-wrap">${h(data.mensagem)}</p>`,
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => console.error("[contact] falha ao notificar"));
  }

  return NextResponse.json({ ok: true });
}

// Qualquer outro método é recusado
export function GET() { return fail(405, "Método não permitido."); }
