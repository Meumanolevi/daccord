import type { Metadata } from "next";
import { VerifyEmailResult } from "@/components/auth/verify-email-result";

export const metadata: Metadata = { title: "Confirmar e-mail", robots: { index: false, follow: false } };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ verification_url?: string }> }) {
  const params = await searchParams;
  return <VerifyEmailResult verificationUrl={params.verification_url ?? ""} />;
}
