import type { Metadata } from "next";
import { FuturePage } from "@/components/ui/future-page";

export const metadata: Metadata = {
  title: "Ajuda",
  description: "Use o assistente D’Accord para entender a análise de pele e a curadoria de skincare.",
  alternates: { canonical: "/contato" },
};

export default function ContactPage() {
  return (
    <FuturePage
      eyebrow="AJUDA D’ACCORD"
      title="COMO PODEMOS ORIENTAR VOCÊ?"
      description="Use o assistente para entender cada etapa da análise e aproveitar melhor a sua curadoria."
      nextStep="Pergunte sobre o início da análise, envio de foto, recomendações, produtos ou privacidade. O assistente fica disponível no canto da tela em todas as páginas."
      cta={{ label: "Abrir assistente", href: "?assistente=aberto#assistente" }}
    />
  );
}
