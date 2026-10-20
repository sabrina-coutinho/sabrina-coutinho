import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "@fontsource/bodoni-moda/400.css";
import "@fontsource/bodoni-moda/400-italic.css";
import "@fontsource/bodoni-moda/500-italic.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./globals.css";
import { Toaster } from "@/components/Toast";
import { CookieBanner } from "@/components/CookieBanner";

const SITE = process.env.SITE_URL ?? "https://sabrinacoutinho.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Sabrina Coutinho · Mãe, fitness, moda e lifestyle", template: "%s · Sabrina Coutinho" },
  description: "Mãe, atleta híbrida em construção e criadora de conteúdo em Brasília - DF. Cupons exclusivos, rotina de treinos, estilo e parcerias.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Sabrina Coutinho", url: SITE },
  robots: { index: true, follow: true },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F4EFE8" }, { media: "(prefers-color-scheme: dark)", color: "#161410" }],
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster />
        <CookieBanner />
        {/* Turnstile: único script de terceiros, autorizado pelo nonce da CSP */}
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" nonce={nonce} />
      </body>
    </html>
  );
}
