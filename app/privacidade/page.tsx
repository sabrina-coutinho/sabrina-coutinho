import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Privacidade" };

// Modelo inicial. Revisar com assessoria jurídica antes de publicar.
export default function Privacidade() {
  return (
    <main className="wrap legal-page">
      <a href="/" className="eyebrow">← Voltar ao site</a>
      <p className="eyebrow">LGPD · Lei 13.709/2018 · versão 2026-10</p>
      <h1>Política de Privacidade</h1>
      <p>Este site pertence a Sabrina Coutinho, criadora de conteúdo em Brasília - DF, que atua como controladora dos dados pessoais coletados aqui. Esta política explica, de forma direta, o que coletamos, por quê e como você controla seus dados.</p>

      <h2>1. Quais dados coletamos</h2>
      <ul>
        <li><b>Formulário de parcerias:</b> nome, marca/empresa, e-mail, telefone (opcional), tipo de parceria, orçamento e mensagem.</li>
        <li><b>Segurança:</b> endereço IP de forma temporária (contador de limite de requisições, apagado em até 1 hora) e o resultado da verificação anti-bot da Cloudflare Turnstile.</li>
        <li><b>Cookies:</b> essenciais (proteção do formulário e registro da sua escolha de cookies) e, só com o seu consentimento, medição de audiência e marketing.</li>
      </ul>

      <h2>2. Para que usamos e com qual base legal</h2>
      <ul>
        <li>Responder propostas comerciais: consentimento (art. 7º, I) e procedimentos preliminares de contrato (art. 7º, V).</li>
        <li>Proteger o site contra spam e ataques: legítimo interesse (art. 7º, IX), limitado ao mínimo necessário.</li>
        <li>Medição de audiência e marketing: somente com consentimento, que você pode revogar a qualquer momento.</li>
      </ul>
      <p>Não vendemos dados. Não usamos seus dados para decisões automatizadas.</p>

      <h2>3. Com quem compartilhamos</h2>
      <p>Apenas com operadores necessários para o site funcionar, sob contrato e obrigações de segurança: hospedagem, banco de dados, Cloudflare (verificação anti-bot) e o serviço de e-mail que entrega a proposta à assessoria. Alguns podem armazenar dados fora do Brasil, com as salvaguardas do art. 33 da LGPD.</p>

      <h2>4. Como protegemos</h2>
      <ul>
        <li>Conexão sempre criptografada (HTTPS com TLS 1.2+/1.3 e HSTS).</li>
        <li>Dados pessoais criptografados no banco com AES-256-GCM, além da criptografia de disco do provedor.</li>
        <li>Acesso restrito à assessoria, com autenticação forte e registro de acessos.</li>
        <li>Proteções contra XSS, injeção de SQL, CSRF, spam e robôs.</li>
      </ul>

      <h2>5. Por quanto tempo guardamos</h2>
      <p>Propostas são apagadas automaticamente após 12 meses, salvo se virarem contrato (nesse caso, pelo prazo legal aplicável).</p>

      <h2>6. Seus direitos (art. 18)</h2>
      <p>Você pode pedir confirmação, acesso, correção, anonimização, portabilidade ou exclusão dos seus dados, além de revogar consentimentos, pelo e-mail comercial informado na seção de contato do site. Respondemos em até 15 dias. Você também pode reclamar à ANPD (gov.br/anpd).</p>

      <h2>7. Mudanças</h2>
      <p>Se esta política mudar de forma relevante, avisaremos neste site e atualizaremos a versão no topo da página.</p>
    </main>
  );
}
