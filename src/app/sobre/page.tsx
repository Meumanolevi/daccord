import type { Metadata } from "next";
import { FuturePage } from "@/components/ui/future-page";

export const metadata: Metadata = {
  title: "Sobre a D’Accord",
  description: "Conheça a proposta D’Accord: tecnologia, cuidado e curadoria para escolhas de skincare mais claras.",
  alternates: { canonical: "/sobre" },
};

export default function AboutPage() {
  return (
    <FuturePage
      eyebrow="BELEZA + TECNOLOGIA + CUIDADO"
      title="ESCUTAR A PELE ANTES DE ESCOLHER."
      description="A D’Accord nasce para transformar sinais, contexto e preferências em decisões de skincare mais claras e possíveis."
      nextStep="Esta rota está pronta para receber a história da marca, o método e os princípios de responsabilidade da curadoria."
    />
  );
}
