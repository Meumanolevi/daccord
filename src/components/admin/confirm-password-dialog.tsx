"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import { adminApi } from "@/lib/admin-api";
import styles from "./product-admin.module.css";

export function ConfirmPasswordDialog({ open, title, description, onClose, onConfirmed }: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirmed: () => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      await adminApi.confirmPassword(password);
      await onConfirmed();
      setPassword("");
      onClose();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Não foi possível confirmar a operação.");
    } finally { setLoading(false); }
  };

  return <div className={styles.modalBackdrop} role="presentation" onMouseDown={onClose}>
    <form className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="confirm-title" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
      <p className={styles.eyebrow}>Ação protegida</p><h2 id="confirm-title">{title}</h2><p>{description}</p>
      <label><span>SENHA ATUAL</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus /></label>
      {error ? <div className={styles.formError}>{error}</div> : null}
      <footer><button type="button" className={styles.secondary} onClick={onClose}>Cancelar</button><button className={styles.danger} disabled={loading}>{loading ? "Confirmando…" : "Confirmar ação"}</button></footer>
    </form>
  </div>;
}
