// Conteúdo editável do site. Troque parceiros/códigos pelos acordos reais antes de publicar.

export type CouponCategory = "beleza" | "lazer" | "fitness";

export interface Coupon {
  id: string;
  cat: CouponCategory;
  partner: string;
  desc: string;
  benefit: string;
  unit: string;
  code: string;
  url?: string; // link do parceiro (opcional)
}

export const CATEGORIES: { id: CouponCategory | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "beleza", label: "💅 Estética & Beleza" },
  { id: "lazer", label: "🍺 Gastronomia & Lazer" },
  { id: "fitness", label: "🏋️‍♀️ Fitness & Estilo" },
];

export const CATEGORY_LABEL: Record<CouponCategory, string> = {
  beleza: "Estética & Beleza",
  lazer: "Gastronomia & Lazer",
  fitness: "Fitness & Estilo",
};

// EXEMPLOS — substituir pelos parceiros e códigos reais
export const COUPONS: Coupon[] = [
  { id: "cilios", cat: "beleza", partner: "Cílios", desc: "Extensão de cílios fio a fio ou volume russo no studio parceiro.", benefit: "15%", unit: "na 1ª aplicação", code: "SABRINA15" },
  { id: "labial", cat: "beleza", partner: "Micropigmentação Labial", desc: "Lábios com cor natural e duradoura, sem precisar de batom todo dia.", benefit: "10%", unit: "no procedimento", code: "SCLABIAL10" },
  { id: "unhas", cat: "beleza", partner: "Unhas", desc: "Alongamento e manutenção com a nail designer que cuida das minhas.", benefit: "R$20", unit: "de desconto", code: "SCNAILS" },
  { id: "garagem", cat: "lazer", partner: "Garagem Beer", desc: "Chopp gelado e petiscos pra fechar a semana com a família e os amigos.", benefit: "10%", unit: "na comanda", code: "GARAGEMSC" },
  { id: "restaurantes", cat: "lazer", partner: "Restaurantes em Brasília", desc: "Meus lugares favoritos pra comer bem em Brasília, testados e aprovados.", benefit: "Sobremesa", unit: "cortesia", code: "SABRINABSB" },
  { id: "experiencias", cat: "lazer", partner: "Experiências", desc: "Day use, passeios e programas para curtir o fim de semana no DF.", benefit: "15%", unit: "por pessoa", code: "SCEXPERIENCIA" },
  { id: "moda-fitness", cat: "fitness", partner: "Moda Fitness", desc: "As leggings e tops que aguentam treino de força e corrida.", benefit: "10%", unit: "em todo o site", code: "SABRINAFIT" },
  { id: "suplementos", cat: "fitness", partner: "Suplementos", desc: "Whey, creatina e o que eu realmente uso na minha rotina híbrida.", benefit: "12%", unit: "na compra", code: "SABRINA12" },
  { id: "looks", cat: "fitness", partner: "Looks do dia a dia", desc: "Peças versáteis que vão do treino ao trabalho e ao passeio com a família.", benefit: "Frete", unit: "grátis", code: "SCLOOKS" },
];

export const PILLARS = [
  { emoji: "🏋️‍♂️", title: "Treinos", text: "Força, corrida e a construção de uma atleta híbrida, semana a semana." },
  { emoji: "✨", title: "Estilo", text: "Looks reais: do treino ao jantar, com peças que repito sem culpa." },
  { emoji: "👶", title: "Maternidade", text: "A rotina de mãe sem romantizar, com muito afeto e alguma bagunça." },
  { emoji: "🥗", title: "Receitas", text: "Comida prática e nutritiva que a família inteira come." },
  { emoji: "✈️", title: "Viagens", text: "Roteiros, malas inteligentes e treinos fora de casa." },
];

// Troque `tone` por `image: "/feed/arquivo.jpg"` quando tiver as fotos
export const REELS = [
  { tag: "Reel · evolução", title: "Antes & depois de 1 ano de treino", glyph: "💪", tone: "t3" },
  { tag: "Reel · treino", title: "Força + corrida no mesmo dia", glyph: "🏃‍♀️", tone: "t1" },
  { tag: "Reel · estilo", title: "3 looks com a mesma legging", glyph: "👗", tone: "t4" },
  { tag: "Reel · maternidade", title: "Minha manhã de mãe que treina", glyph: "👶", tone: "t5" },
  { tag: "Reel · receita", title: "Marmita da semana em 1 hora", glyph: "🥗", tone: "t6" },
  { tag: "Reel · viagem", title: "Como treino fora de casa", glyph: "✈️", tone: "t2" },
];

export const POSTS = [
  { label: "Evolução", title: "Antes & depois", glyph: "📈", tone: "t1" },
  { label: "Treino", title: "Dia de força", glyph: "🏋️‍♀️", tone: "t3" },
  { label: "Look", title: "Look do dia", glyph: "🤍", tone: "t4" },
  { label: "Família", title: "Domingo em família", glyph: "👨‍👩‍👧", tone: "t5" },
  { label: "Corrida", title: "Longão de sábado", glyph: "🏃‍♀️", tone: "t6" },
  { label: "Rotina", title: "Rotina das 5h", glyph: "☕", tone: "t2" },
];

export const INSTAGRAM = "https://instagram.com/sabrinaa.coutinho";
export const LINKTREE = "https://linktr.ee/sabrinacoutinho";
