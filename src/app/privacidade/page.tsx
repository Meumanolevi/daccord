import type { Metadata } from "next";
import { FuturePage } from "@/components/ui/future-page";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Princípios de privacidade e tratamento responsável de dados na experiência D’Accord.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <FuturePage
      eyebrow="PRIVACIDADE POR PADRÃO"
      title="SUA IMAGEM. SUAS ESCOLHAS."
      description="Esta página está reservada para explicar consentimento, retenção, segurança e direitos sobre os dados usados na análise."
      nextStep="Antes de ativar o envio de fotos, publique uma política revisada e implemente consentimento explícito, exclusão e prazo de retenção."
    />
  );
}
