import { NextResponse, type NextRequest } from "next/server";
import { safeEqual } from "@/lib/crypto";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Retenção LGPD (art. 15/16): apaga propostas com mais de 12 meses.
 * Agende diariamente (Vercel Cron / Netlify Scheduled Functions) com header
 * Authorization: Bearer <CRON_SECRET>.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 12);
  const { count } = await db.proposta.deleteMany({ where: { createdAt: { lt: cutoff } } });
  return NextResponse.json({ ok: true, removidas: count });
}
