import { NextResponse } from "next/server";
import { CSRF_COOKIE, issueCsrfToken } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Emite o token CSRF: vai no cookie HttpOnly e no corpo (o front reenvia no header). */
export async function GET() {
  const token = issueCsrfToken();
  const res = NextResponse.json({ token });
  res.cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1h
  });
  return res;
}
