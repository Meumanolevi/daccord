import type { Metadata } from "next";
import { AuthExperience } from "@/components/auth/auth-experience";

export const metadata: Metadata = {
  title: "Entrar ou criar conta",
  description: "Acesse ou crie sua conta D’Accord para salvar análises, preferências, curadorias e pedidos.",
  alternates: { canonical: "/entrar" },
};

export default function SignInPage() {
  return <AuthExperience />;
}
