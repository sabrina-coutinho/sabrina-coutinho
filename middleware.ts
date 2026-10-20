import { NextResponse, type NextRequest } from "next/server";
import { clientIp, limiters } from "@/lib/rate-limit";

/**
 * Middleware de borda:
 *  - gera um nonce por requisição e aplica a Content-Security-Policy estrita
 *  - força HTTPS (a hospedagem também redireciona; aqui é defesa em profundidade)
 *  - aplica rate limiting em páginas e na API
 */
export async function middleware(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";

  // 1) HTTPS obrigatório
  if (isProd && req.headers.get("x-forwarded-proto") === "http") {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // 2) Rate limiting
  const ip = clientIp(req.headers);
  const isApi = req.nextUrl.pathname.startsWith("/api/");
  const { success, limit, remaining, reset } = await (isApi ? limiters.api : limiters.pages).limit(ip);
  if (!success) {
    return new NextResponse(JSON.stringify({ error: "Muitas requisições. Tente de novo em instantes." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  // 3) CSP com nonce (scripts inline só executam com o nonce desta resposta)
  const nonce = btoa(crypto.randomUUID());
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com${isProd ? "" : " 'unsafe-eval'"}`,
    `style-src 'self' 'unsafe-inline'`, // Framer Motion anima via atributo style
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `connect-src 'self' https://challenges.cloudflare.com`,
    `frame-src https://challenges.cloudflare.com`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `manifest-src 'self'`,
    `worker-src 'self' blob:`,
    isProd ? `upgrade-insecure-requests` : ``,
  ].filter(Boolean).join("; ");

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-nonce", nonce);
  reqHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({ request: { headers: reqHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-RateLimit-Remaining", String(remaining));
  return res;
}

export const config = {
  matcher: [
    // Tudo, exceto arquivos estáticos e prefetch do Next
    { source: "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|avif|svg|woff2?)$).*)",
      missing: [{ type: "header", key: "next-router-prefetch" }, { type: "header", key: "purpose", value: "prefetch" }] },
  ],
};
