import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting (OWASP A04/A07, anti brute force, spam e scraping).
 * Produção: Upstash Redis (compartilhado entre todas as instâncias serverless / edge).
 * Dev: janela deslizante em memória (NÃO usar em produção, cada instância teria seu contador).
 */
type Result = { success: boolean; limit: number; remaining: number; reset: number };
type Limiter = { limit: (id: string) => Promise<Result> };

const hasRedis = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = hasRedis ? Redis.fromEnv() : null;

function memoryLimiter(max: number, windowMs: number): Limiter {
  const hits = new Map<string, number[]>();
  return {
    async limit(id) {
      const now = Date.now();
      const arr = (hits.get(id) ?? []).filter(t => now - t < windowMs);
      arr.push(now); hits.set(id, arr);
      if (hits.size > 10_000) hits.clear(); // evita crescimento ilimitado
      return { success: arr.length <= max, limit: max, remaining: Math.max(0, max - arr.length), reset: now + windowMs };
    },
  };
}

function make(prefix: string, max: number, window: `${number} ${"s" | "m" | "h"}`, windowMs: number): Limiter {
  return redis
    ? new Ratelimit({ redis, prefix: `rl:${prefix}`, limiter: Ratelimit.slidingWindow(max, window), analytics: false })
    : memoryLimiter(max, windowMs);
}

export const limiters = {
  /** Todas as rotas /api: 60 req/min por IP */
  api: make("api", 60, "1 m", 60_000),
  /** Formulário de proposta: 5 envios/hora por IP (anti-spam) */
  contact: make("contact", 5, "1 h", 3_600_000),
  /** Páginas: 300 req/min por IP (freia scraping agressivo sem afetar humanos) */
  pages: make("pages", 300, "1 m", 60_000),
};

export function clientIp(headers: Headers): string {
  // Em Vercel/Netlify/Cloudflare o primeiro IP de x-forwarded-for é definido pela borda confiável.
  return headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? "anon";
}
