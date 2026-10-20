# Segurança, privacidade e infraestrutura

Mapa de cada requisito (OWASP Top 10 2021, LGPD e controles ISO/IEC 27001:2022 Anexo A) para onde ele está implementado.

## 1. Comunicação e transporte

| Controle | Onde | Observação |
|---|---|---|
| HTTPS obrigatório | `middleware.ts` (redirect 308) + hospedagem | Vercel/Netlify já redirecionam; o middleware é defesa em profundidade |
| TLS 1.3 | Hospedagem / Cloudflare | TLS não é configurável pelo app. Na Vercel e Netlify o TLS 1.3 é padrão. Com Cloudflare na frente: *SSL/TLS → Edge Certificates → Minimum TLS Version = 1.2* e *TLS 1.3 = On* (1.2 como piso mantém compatibilidade com navegadores antigos) |
| HSTS com preload | `next.config.mjs` | `max-age=63072000; includeSubDomains; preload`. Depois do domínio estável, inscreva em hstspreload.org |
| Banco com TLS | `DATABASE_URL` com `sslmode=require` | |

## 2. Headers de segurança

| Header | Valor | Onde |
|---|---|---|
| Content-Security-Policy | nonce por requisição + `strict-dynamic`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` | `middleware.ts` |
| X-Frame-Options | `DENY` | `next.config.mjs` |
| X-Content-Type-Options | `nosniff` | `next.config.mjs` |
| Referrer-Policy | `strict-origin-when-cross-origin` | `next.config.mjs` |
| Permissions-Policy | câmera, microfone, localização, pagamento desativados | `next.config.mjs` |
| COOP / CORP | `same-origin` | `next.config.mjs` |
| X-Powered-By | removido | `poweredByHeader: false` |

Teste após o deploy: https://securityheaders.com e https://observatory.mozilla.org (meta: nota A+).

## 3. Entradas e injeções (OWASP A03)

- **Validação por allowlist** com Zod (`lib/sanitize.ts`): tamanho máximo por campo, e-mail validado, `tipo`/`orçamento` só aceitam valores da lista, `.strict()` rejeita campos extras (mass assignment).
- **Sanitização**: normalização NFKC, remoção de tags HTML, caracteres de controle e de direção (bidi spoofing), esquemas `javascript:`/`data:`.
- **XSS na saída**: React escapa tudo por padrão; o projeto não usa `dangerouslySetInnerHTML`. O e-mail de notificação usa `escapeHtml`.
- **SQL Injection**: Prisma gera consultas parametrizadas. Não há SQL concatenado. Se algum dia precisar de SQL cru, use apenas `prisma.$queryRaw` com template tag (nunca `$queryRawUnsafe`).
- **Corpo limitado** a 8 KB e `Content-Type` obrigatório `application/json`.

## 4. CSRF (OWASP A01)

Três camadas em `lib/csrf.ts`:
1. Cookie `__Host-csrf` (HttpOnly, Secure, SameSite=Strict, Path=/).
2. Token assinado com HMAC repetido no header `X-CSRF-Token`, comparado em tempo constante.
3. Checagem de `Origin` e `Sec-Fetch-Site` em toda requisição que altera estado.

## 5. Abuso, spam e scraping

| Camada | Limite | Onde |
|---|---|---|
| Páginas | 300 req/min por IP | `middleware.ts` |
| API geral | 60 req/min por IP | `middleware.ts` |
| Formulário | 5 envios/hora por IP | `app/api/contact/route.ts` |
| Turnstile | verificado no servidor, com `action` e `hostname` conferidos | `lib/turnstile.ts` |
| Honeypot + tempo mínimo de 3 s | resposta silenciosa para bots | rota de contato |
| E-mail e telefone ofuscados | não aparecem no HTML servido; montados no navegador | `components/Contact.tsx` |

O rate limit usa Upstash Redis em produção (contador compartilhado entre instâncias serverless). Sem as variáveis do Upstash, cai num limitador em memória, aceitável só em desenvolvimento.

Camada extra recomendada: Cloudflare na frente do domínio com *Bot Fight Mode* e uma regra WAF de rate limit em `/api/*`.

## 6. Segredos (OWASP A02/A05)

- Todos os segredos ficam em variáveis de ambiente da hospedagem, lidos apenas em rotas de servidor. Só `NEXT_PUBLIC_TURNSTILE_SITE_KEY` vai ao navegador, e ela é pública por definição.
- `.env*` está no `.gitignore`; `.env.example` documenta as variáveis sem valores.
- Ative no GitHub: *Settings → Code security → Secret scanning* e *Push protection*, além do Dependabot.
- Gere chaves com `openssl rand -base64 32` e troque a cada 12 meses ou imediatamente se houver suspeita de vazamento.

## 7. Criptografia em repouso

- Disco do banco: AES-256 do provedor (Neon, Supabase e RDS fazem por padrão).
- Campo a campo: nome, e-mail, telefone e mensagem cifrados com **AES-256-GCM** (`lib/crypto.ts`), IV aleatório de 96 bits por registro e tag de autenticação (detecta adulteração). Formato versionado `v1.` para permitir rotação de chave.
- E-mail também vira um **índice cego** HMAC-SHA256, para atender pedidos de acesso/exclusão do titular sem guardar o e-mail em claro.

## 8. LGPD

| Requisito | Implementação |
|---|---|
| Consentimento de cookies granular, com recusa tão fácil quanto aceitar | `components/CookieBanner.tsx` |
| Revogação a qualquer momento | link "Preferências de cookies" no rodapé |
| Consentimento explícito no formulário, com prova | `consentAt` + `policyVersion` no banco |
| Minimização | só os campos necessários; logs sem dados pessoais |
| Retenção | `app/api/cron/purge` apaga propostas com mais de 12 meses (agendado em `vercel.json`) |
| Transparência | `/privacidade` e `/termos`, linkados no rodapé e no formulário |
| Direitos do titular (art. 18) | localizar pelo `emailHash`, exportar decifrando, excluir com `deleteMany` |

Os textos legais são um modelo. Revise com advogado(a) antes de publicar e indique um encarregado (DPO) se a operação crescer.

## 9. ISO/IEC 27001 — controles relevantes

| Controle (Anexo A 2022) | Prática no projeto |
|---|---|
| 5.15 / 8.5 Controle de acesso e autenticação segura | 2FA obrigatório no GitHub, hospedagem, banco e e-mail da assessoria |
| 8.9 Gestão de configuração | Headers e políticas versionados no código |
| 8.12 Prevenção de vazamento | Criptografia de campo + índice cego |
| 8.15 Logging | Logs de erro sem dados pessoais; ative logs de acesso na hospedagem |
| 8.24 Uso de criptografia | AES-256-GCM, HMAC-SHA256, TLS |
| 8.25–8.28 Desenvolvimento seguro | Validação por allowlist, revisão de PR, Dependabot, secret scanning |
| 5.30 / 8.13 Continuidade e backup | Backups diários do provedor do banco, com retenção de 7 dias |

## 10. Checklist antes de publicar

- [ ] Variáveis de ambiente preenchidas na hospedagem (nunca no repositório)
- [ ] Domínio próprio com HTTPS ativo; testar em securityheaders.com
- [ ] Chaves do Turnstile criadas para o domínio de produção
- [ ] Upstash Redis configurado
- [ ] `npx prisma migrate deploy` executado
- [ ] Cron de retenção ativo (`CRON_SECRET` definido)
- [ ] 2FA ativo em todas as contas
- [ ] Textos legais revisados
- [ ] Cupons e parceiros reais no lugar dos exemplos (`lib/content.ts`)
