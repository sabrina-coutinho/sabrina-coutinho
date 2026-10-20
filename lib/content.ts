// Conteúdo editável do site. Troque parceiros/códigos pelos acordos reais antes de publicar.

export interface Coupon {
  id: string;
  label: string;      // categoria exibida no card
  partner: string;
  desc: string;
  benefit: string;
  unit: string;
  code?: string;      // código do cupom; vazio = "diga que veio pela Sabrina"
  url?: string;       // Instagram ou site do parceiro (https://...)
}

// TODO: preencher `url` de cada parceiro (e `code`, se houver cupom com código)
export const COUPONS: Coupon[] = [
  { id: "pamela-costa", label: "Cílios · Unhas", partner: "Studio Pamela Costa", desc: "Extensão de cílios e unhas com o desconto valendo toda vez que você for, na primeira aplicação e em cada manutenção.", benefit: "10%", unit: "na 1ª aplicação e em toda manutenção" },
  { id: "velume", label: "Estética", partner: "Velume Estética", desc: "Os cuidados de estética que fazem parte da minha rotina, com desconto exclusivo pra quem vem por aqui.", benefit: "10%", unit: "de desconto" },
  { id: "nx3dstudio", label: "Studio parceiro", partner: "NX3Dstudio", desc: "Parceria exclusiva com desconto especial pra quem me acompanha.", benefit: "10%", unit: "de desconto" },
  { id: "garagem-beer", label: "Gastronomia & Lazer", partner: "Garagem Beer", desc: "Chopp gelado e petiscos pra fechar a semana com a família e os amigos.", benefit: "10%", unit: "na comanda" },
];

export const couponMessage = (c: Coupon) => c.code || `Oi! Vim pela @sabrinaa.coutinho e quero meu desconto de ${c.benefit} 🤍`;
export const safeUrl = (u?: string) => (u && /^https:\/\//.test(u) ? u : undefined);

export const PILLARS = [
  { emoji: "🏋️‍♂️", title: "Treinos", text: "Força, corrida e a construção de uma atleta híbrida, semana a semana." },
  { emoji: "✨", title: "Estilo", text: "Looks reais: do treino ao jantar, com peças que repito sem culpa." },
  { emoji: "👶", title: "Maternidade", text: "A rotina de mãe sem romantizar, com muito afeto e alguma bagunça." },
  { emoji: "🥗", title: "Receitas", text: "Comida prática e nutritiva que a família inteira come." },
  { emoji: "✈️", title: "Viagens", text: "Roteiros, malas inteligentes e treinos fora de casa." },
];

// Fotos do feed (em /public/fotos). `pos` = enquadramento (object-position).
export const POSTS = [
  { image: "/fotos/bmw-life.jpg", label: "Parcerias", title: "Evento BMW Life", alt: "Sabrina em evento da BMW Life", pos: "50% 30%" },
  { image: "/fotos/look-garagem-beer.jpg", label: "Look", title: "Noite na Garagem Beer", alt: "Sabrina de vestido amarelo na Garagem Beer", pos: "50% 35%" },
  { image: "/fotos/look-noite.jpg", label: "Look", title: "Look da noite", alt: "Sabrina com corset vinho e calça marrom", pos: "50% 30%" },
  { image: "/fotos/viagem.jpg", label: "Viagens", title: "Pé na estrada", alt: "Sabrina olhando pela janela durante uma viagem", pos: "50% 30%" },
];

export const INSTAGRAM = "https://instagram.com/sabrinaa.coutinho";
export const LINKTREE = "https://linktr.ee/sabrinacoutinho";
