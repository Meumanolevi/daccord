import type { Metadata } from "next";
import { FuturePage } from "@/components/ui/future-page";

export const metadata: Metadata = {
  title: "Produtos e curadoria",
  description: "Conheça a futura curadoria D’Accord de cosméticos por textura, tolerância e compatibilidade.",
  alternates: { canonical: "/produtos" },
};

export default function ProductsPage() {
  return (
    <FuturePage
      eyebrow="CURADORIA D’ACCORD"
      title="PRODUTOS QUE CONVERSAM ENTRE SI."
      description="Este espaço receberá o catálogo editorial de séruns, hidratantes e protetores selecionados por compatibilidade."
      nextStep="A arquitetura permite conectar um CMS ou API de catálogo sem alterar a landing page."
    />
  );
}
