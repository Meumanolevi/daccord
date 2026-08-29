import type { Metadata } from "next";
import { FuturePage } from "@/components/ui/future-page";

export const metadata: Metadata = {
  title: "Recomendações de skincare",
  description: "Curadoria personalizada de cosméticos e rotina de skincare organizada em poucos passos.",
  alternates: { canonical: "/recomendacoes" },
};

export default function RecommendationsPage() {
  return (
    <FuturePage
      eyebrow="ETAPA 03 / 03 — SUA CURADORIA"
      title="UM RITUAL EM ACORDO COM SUA PELE."
      description="A futura tela de recomendações conectará produtos compatíveis, justificativas e uma ordem de uso simples."
      nextStep="O endpoint de recomendações já está reservado para integrar o catálogo e o motor de compatibilidade."
    />
  );
}
