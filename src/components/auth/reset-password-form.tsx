"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ApiError, apiRequest } from "@/lib/api-client";
import styles from "./auth-flow-page.module.css";

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const score = [password.length >= 12, /[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const level = score === 5 ? "forte" : score >= 3 ? "média" : "fraca";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await apiRequest<null>("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, email, password, password_confirmation: confirmation }),
      });
      setMessage(response.message);
      setSuccess(true);
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  return <main className={styles.page}><section className={styles.card}><p className={styles.eyebrow}>Recuperar acesso</p><h1>Crie uma nova senha.</h1><p>Use 12 caracteres ou mais, com maiúscula, minúscula, número e símbolo.</p>{success ? <><p className={styles.success}>{message}</p><Link className={styles.link} href="/entrar">Entrar com a nova senha</Link></> : <form onSubmit={submit}><div className={styles.field}><label htmlFor="reset-password">Nova senha</label><input id="reset-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /><div className={styles.strength} data-level={level} aria-label={`Força da senha: ${level}`}><span /><span /><span /></div><span>Força: {level}</span></div><div className={styles.field}><label htmlFor="reset-confirmation">Confirme a senha</label><input id="reset-confirmation" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></div>{message ? <p className={styles.error} role="alert">{message}</p> : null}<button className={styles.button} type="submit" disabled={loading}>{loading ? "Aguarde…" : "Redefinir senha"}</button></form>}</section></main>;
}
