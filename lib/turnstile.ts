import "server-only";

/** Verificação server-side do Cloudflare Turnstile. A chave secreta nunca sai do servidor. */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") return true; // facilita o dev local
    throw new Error("TURNSTILE_SECRET_KEY ausente");
  }
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean; action?: string; hostname?: string };
  const expectedHost = process.env.SITE_URL ? new URL(process.env.SITE_URL).hostname : undefined;
  return data.success === true && data.action === "contato" && (!expectedHost || data.hostname === expectedHost);
}
