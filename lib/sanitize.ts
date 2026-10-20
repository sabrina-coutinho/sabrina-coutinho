import { z } from "zod";

/**
 * Sanitização + validação de entrada (OWASP A03: Injection / XSS).
 * Estratégia: validar por allowlist (formato e tamanho), normalizar e remover marcação.
 * Saída continua sendo escapada no ponto de uso (React escapa por padrão; e-mails usam escapeHtml).
 * SQL Injection é evitado pelo Prisma (consultas parametrizadas) — nunca concatenamos SQL.
 */

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g;

export function cleanText(input: string): string {
  return input
    .normalize("NFKC")
    .replace(CONTROL, "")          // caracteres de controle e de direção (bidi spoofing)
    .replace(/<[^>]*>?/g, "")       // qualquer tag HTML
    .replace(/[<>]/g, "")           // sobras de < >
    .replace(/javascript:|data:|vbscript:/gi, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"'`=/]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;", "=": "&#61;", "/": "&#47;" }[c]!));
}

const text = (min: number, max: number, msg: string) =>
  z.string({ required_error: msg }).transform(cleanText).pipe(z.string().min(min, msg).max(max, `Máximo de ${max} caracteres.`));

export const TIPOS = ["Publi no feed / Reels", "Stories", "Cupom de desconto", "Evento / experiência", "Embaixadora de marca"] as const;
export const ORCAMENTOS = ["", "Até R$ 1.000", "R$ 1.000 a R$ 3.000", "Acima de R$ 3.000", "Permuta"] as const;

export const contactSchema = z.object({
  nome: text(2, 80, "Informe seu nome."),
  marca: text(2, 80, "Informe a marca ou empresa."),
  email: z.string().trim().toLowerCase().max(120).email("Use um e-mail válido."),
  telefone: z
    .string()
    .optional()
    .transform(v => (v ?? "").replace(/\D/g, ""))
    .refine(v => v === "" || (v.length >= 10 && v.length <= 13), "Inclua o DDD, ex.: (61) 90000-0000."),
  tipo: z.enum(TIPOS, { errorMap: () => ({ message: "Escolha o tipo de parceria." }) }),
  orcamento: z.enum(ORCAMENTOS).default(""),
  mensagem: text(20, 1500, "Conte um pouco mais (mínimo de 20 caracteres)."),
  consentimento: z.literal(true, { errorMap: () => ({ message: "O consentimento LGPD é obrigatório." }) }),
  website: z.string().max(0).optional(),           // honeypot: humanos não preenchem
  startedAt: z.number().int().positive(),           // tempo mínimo de preenchimento
  turnstileToken: z.string().min(10).max(2048),
}).strict(); // rejeita campos inesperados (mass assignment)

export type ContactInput = z.infer<typeof contactSchema>;
