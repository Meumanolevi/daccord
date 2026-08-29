export const siteConfig = {
  name: "D’Accord",
  title: "D’Accord | Skincare inteligente e curadoria para a sua pele",
  description:
    "Descubra uma rotina de skincare personalizada com análise de pele, preferências e curadoria inteligente de cosméticos compatíveis.",
  shortDescription: "Beleza guiada pela sua pele.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "pt_BR",
  keywords: [
    "skincare inteligente",
    "análise de pele",
    "rotina de skincare personalizada",
    "curadoria de cosméticos",
    "produtos para pele sensível",
    "barreira cutânea",
    "cosméticos compatíveis",
    "cuidados com a pele",
    "D’Accord skincare",
  ],
  routes: [
    { href: "/analise", label: "Minha análise" },
    { href: "/questionario", label: "Questionário" },
    { href: "/recomendacoes", label: "Recomendações" },
    { href: "/produtos", label: "Produtos" },
    { href: "/sobre", label: "Sobre nós" },
    { href: "/privacidade", label: "Privacidade" },
    { href: "/contato", label: "Contato" },
  ],
} as const;
