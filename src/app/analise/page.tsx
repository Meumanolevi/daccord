import type { Metadata } from "next";
import { FuturePage } from "@/components/ui/future-page";

export const metadata: Metadata = {
  title: "Análise de pele",
  description: "Inicie sua futura análise de pele D’Accord por foto, com privacidade e orientação clara.",
  alternates: { canonical: "/analise" },
};

export default function AnalysisPage() {
  return (
    <FuturePage
      eyebrow="ETAPA 01 / 03 — FOTO"
      title="MOSTRE SUA PELE. A GENTE LÊ OS SINAIS."
      description="A experiência de análise por foto já tem rota e contrato de API preparados para a próxima fase."
      nextStep="A implementação futura seguirá o fluxo desenhado no Figma: foto sem filtro, luz uniforme, rosto visível e consentimento explícito antes do processamento."
    />
  );
}
