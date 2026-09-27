"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiError, apiRequest } from "@/lib/api-client";
import styles from "./auth-flow-page.module.css";

export function VerifyEmailResult({ verificationUrl }: { verificationUrl: string }) {
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirmando seu endereço de e-mail…");

  useEffect(() => {
    const expectedOrigin = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").origin;
    let target: URL;
    try {
      target = new URL(verificationUrl);
      if (target.origin !== expectedOrigin) throw new Error("origin");
    } catch {
      const timer = window.setTimeout(() => {
        setStatus("error");
        setMessage("O link de confirmação é inválido.");
      }, 0);
      return () => window.clearTimeout(timer);
    }

    apiRequest<null>(target.toString())
      .then(async (response) => {
        await refreshUser();
        setMessage(response.message);
        setStatus("success");
      })
      .catch((error: unknown) => {
        setMessage(error instanceof ApiError ? error.message : "Não foi possível confirmar o e-mail.");
        setStatus("error");
      });
  }, [verificationUrl, refreshUser]);

  return <main className={styles.page}><section className={styles.card}><p className={styles.eyebrow}>Confirmação de e-mail</p><h1>{status === "success" ? "E-mail confirmado." : status === "error" ? "Link indisponível." : "Só um instante."}</h1><p className={status === "success" ? styles.success : status === "error" ? styles.error : ""}>{message}</p>{status === "success" ? <Link className={styles.link} href="/analise">Continuar para a análise</Link> : status === "error" ? <Link className={`${styles.link} ${styles.secondary}`} href="/entrar">Voltar ao acesso</Link> : null}</section></main>;
}
