import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { safeEqual } from "./crypto";

/**
 * Proteção CSRF em camadas (OWASP A01):
 *  1. Cookie de sessão SameSite=Strict + __Host- (só HTTPS, sem Domain, Path=/)
 *  2. Token sincronizado: valor aleatório assinado com HMAC, enviado no cookie HttpOnly
 *     e repetido no header X-CSRF-Token pelo front. O servidor compara em tempo constante.
 *  3. Checagem de Origin/Sec-Fetch-Site em toda requisição que muda estado.
 */
export const CSRF_COOKIE = process.env.NODE_ENV === "production" ? "__Host-csrf" : "csrf";
export const CSRF_HEADER = "x-csrf-token";

function sign(nonce: string): string {
  const secret = process.env.HMAC_SECRET;
  if (!secret) throw new Error("HMAC_SECRET ausente");
  return createHmac("sha256", secret).update(`csrf:${nonce}`).digest("base64url");
}

export function issueCsrfToken(): string {
  const nonce = randomBytes(24).toString("base64url");
  return `${nonce}.${sign(nonce)}`;
}

export function verifyCsrf(cookieToken: string | undefined, headerToken: string | null): boolean {
  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) return false;
  const [nonce, mac] = cookieToken.split(".");
  return !!nonce && !!mac && safeEqual(mac, sign(nonce));
}

export function sameOrigin(headers: Headers): boolean {
  const site = headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = headers.get("origin");
  if (!origin) return false;
  const allowed = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : null;
  const host = headers.get("host");
  return origin === allowed || (!!host && new URL(origin).host === host);
}
