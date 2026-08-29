import type { Metadata } from "next";
import { FuturePage } from "@/components/ui/future-page";

export const metadata: Metadata = {
  title: "Questionário de perfil",
  description: "Perfil, sensibilidades e preferências para uma curadoria de skincare mais coerente.",
  alternates: { canonical: "/questionario" },
};

export default function QuestionnairePage() {
  return (
    <FuturePage
      eyebrow="ETAPA 02 / 03 — PERFIL"
      title="SUA PELE TAMBÉM TEM PREFERÊNCIAS."
      description="A rota do questionário está pronta para receber sensibilidades, ingredientes a evitar e hábitos de uso."
      nextStep="Os dados serão usados apenas para organizar a curadoria e deverão ser revisados antes da conclusão."
    />
  );
}
