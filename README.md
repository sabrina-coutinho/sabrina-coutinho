# Sabrina Coutinho · site oficial

Site da criadora de conteúdo **Sabrina Coutinho** ([@sabrinaa.coutinho](https://instagram.com/sabrinaa.coutinho)) — mãe, fitness, moda e lifestyle em Brasília - DF.

Next.js 15 (App Router) · React 19 · Framer Motion · Prisma/PostgreSQL · Cloudflare Turnstile · Upstash Redis

## O que tem aqui

```
app/
  page.tsx               página única: hero, cupons, sobre, feed, contato
  layout.tsx             fontes self-hosted, Turnstile com nonce, toast e banner de cookies
  globals.css            design system (tokens claro/escuro, animações)
  privacidade/ termos/   páginas legais (LGPD)
  api/csrf               emite token CSRF
  api/contact            recebe propostas: CSRF, rate limit, Zod, Turnstile, AES-256-GCM
  api/cron/purge         apaga propostas com mais de 12 meses
components/
  CouponCard.tsx         cupom-ticket animado (copiar → check desenhado + faíscas + toast)
  Coupons.tsx            grade com filtro animado por categoria
  Hero, About, Feed, Contact, Footer, Nav, CookieBanner, Toast, Reveal
lib/
  content.ts             cupons, destaques, reels — edite aqui
  sanitize.ts            validação por allowlist + sanitização
  crypto.ts              AES-256-GCM e índice cego HMAC
  csrf.ts  rate-limit.ts  turnstile.ts  db.ts
middleware.ts            CSP com nonce, HTTPS forçado, rate limiting
next.config.mjs          HSTS, X-Frame-Options, nosniff, Referrer-Policy etc.
prisma/schema.prisma     tabela de propostas com campos cifrados
prototipo/index.html     protótipo estático (abre direto no navegador)
docs/SEGURANCA.md        mapa OWASP / LGPD / ISO 27001 e checklist de publicação
```

## Rodar localmente

```bash
npm install
cp .env.example .env.local      # preencha as chaves (veja comentários no arquivo)
npx prisma migrate dev --name init
npm run dev                     # http://localhost:3000
npm test                        # testes de criptografia e sanitização
```

Sem `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e sem Upstash, o projeto roda em modo de desenvolvimento (Turnstile simulado, rate limit em memória).

## Site no ar (GitHub Pages)

A pasta `estatico/` é a versão do site que roda sem servidor: mesmo visual, fotos em `estatico/fotos/`, e o formulário de parcerias abre o WhatsApp da assessoria com a proposta já escrita. A cada push na `main`, o workflow `.github/workflows/pages.yml` publica essa pasta.

Para ativar (uma vez só): repositório público → *Settings → Pages → Source: GitHub Actions*.

## Publicar a versão completa (com backend)

Vercel ou Netlify, com as variáveis de `.env.example` cadastradas no painel. O `vercel.json` agenda a limpeza diária de dados antigos. Antes de abrir ao público, siga o checklist em [`docs/SEGURANCA.md`](docs/SEGURANCA.md).

## Personalizar

- **Fotos:** ficam em `public/fotos/` (Next.js) e `estatico/fotos/` (GitHub Pages). O feed é definido em `lib/content.ts` → `POSTS`.
- **Cupons e parceiros:** `lib/content.ts` → `COUPONS` e `PARTNERS` (no site estático, os mesmos dados ficam no `<script>` de `estatico/index.html`).
- **Cores e fontes:** tokens no topo de `app/globals.css`.
