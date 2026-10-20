import type { Metadata } from "next";

export const metadata: Metadata = { title: "Termos de Uso" };

// Modelo inicial. Revisar com assessoria jurídica antes de publicar.
export default function Termos() {
  return (
    <main className="wrap legal-page">
      <a href="/" className="eyebrow">← Voltar ao site</a>
      <p className="eyebrow">Versão 2026-10</p>
      <h1>Termos de Uso</h1>
      <p>Ao navegar neste site você concorda com estes termos. Se não concordar, por favor não utilize o site.</p>

      <h2>1. Conteúdo e direitos autorais</h2>
      <p>Textos, fotos, vídeos e a identidade visual são de autoria de Sabrina Coutinho ou usados com autorização. Reprodução, total ou parcial, só com permissão por escrito. Compartilhar o link do site é sempre bem-vindo.</p>

      <h2>2. Cupons e parceiros</h2>
      <p>Os cupons são oferecidos pelas marcas parceiras, que definem validade, regras, estoque e condições. Sabrina Coutinho não é responsável por produtos, serviços, entregas ou atendimento de terceiros. Confira as condições no site ou na loja de cada parceiro antes de comprar.</p>

      <h2>3. Publicidade</h2>
      <p>Conteúdos patrocinados e parcerias pagas são sempre sinalizados, seguindo o Guia de Publicidade por Influenciadores Digitais do CONAR e o Código de Defesa do Consumidor.</p>

      <h2>4. Uso aceitável</h2>
      <p>É proibido usar robôs para coletar dados do site, tentar burlar as proteções de segurança, enviar spam pelo formulário ou usar o site para fins ilícitos. Acessos abusivos são bloqueados automaticamente.</p>

      <h2>5. Conteúdo informativo</h2>
      <p>Treinos, receitas e dicas mostram a rotina pessoal da Sabrina e não substituem orientação de médico, nutricionista ou profissional de educação física.</p>

      <h2>6. Foro</h2>
      <p>Estes termos seguem as leis brasileiras. Fica eleito o foro de Brasília - DF.</p>
    </main>
  );
}
