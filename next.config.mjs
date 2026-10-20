/** @type {import('next').NextConfig} */

// Headers estáticos aplicados a TODAS as rotas.
// A Content-Security-Policy é dinâmica (nonce por requisição) e fica no middleware.ts.
const securityHeaders = [
  // HSTS: 2 anos, subdomínios, elegível para a lista de preload dos navegadores
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig = {
  poweredByHeader: false, // não anunciar "X-Powered-By: Next.js"
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Respostas da API nunca são cacheadas
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [], // só imagens próprias em /public
  },
};

export default nextConfig;
