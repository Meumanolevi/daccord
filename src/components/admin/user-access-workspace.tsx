"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { ApiError } from "@/lib/api-client";
import type { AdminUser } from "@/types/catalog";
import { ConfirmPasswordDialog } from "./confirm-password-dialog";
import common from "./admin-common.module.css";
import styles from "./users-admin.module.css";

export function UserAccessWorkspace() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [roleDraft, setRoleDraft] = useState("");
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setUsers((await adminApi.users()).data.data); }
    catch (caught) { setError(caught instanceof ApiError ? caught.message : "Não foi possível consultar os usuários."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  const visible = useMemo(() => users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())), [query, users]);

  return <div className={common.page}>
    <header className={common.pageHead}><div><p className={common.eyebrow}>Controle de acesso</p><h1>Usuários</h1><span>Consulte contas e altere o perfil atribuído. A API impede auto-rebaixamento e preserva ao menos um administrador.</span></div></header>
    {notice ? <div className={common.notice}>{notice}</div> : null}{error ? <div className={`${common.notice} ${common.errorNotice}`}>{error}</div> : null}
    <section className={`${common.toolbar} ${common.surface}`}><label className={common.search}><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nome ou e-mail…" /></label></section>
    <div className={common.panelGrid}>
      <section className={`${common.surface} ${styles.userList}`}>
        <div className={styles.userHead}><span>PESSOA</span><span>PAPEL</span><span>VERIFICAÇÃO</span><span /></div>
        {loading ? <div className={common.loading}><span /></div> : visible.length ? visible.map((user) => <button type="button" className={`${styles.userRow} ${selected?.id === user.id ? styles.selected : ""}`} key={user.id} onClick={() => { setSelected(user); setRoleDraft(user.role); }}><div className={common.productName}><strong>{user.name}</strong><span>{user.email}</span></div><span className={`${common.status} ${user.role === "admin" ? common.info : common.good}`}>{user.role === "admin" ? "Administrador" : "Usuário"}</span><span>{user.email_verified_at ? "Confirmado" : "Pendente"}</span><span className={common.rowAction}>›</span></button>) : <div className={common.empty}><h2>Nenhum usuário encontrado</h2><p>Revise a busca informada.</p></div>}
      </section>
      <aside className={`${common.surface} ${common.sidePanel}`}>
        {!selected ? <div className={common.empty}><h2>Selecione uma pessoa</h2><p>O papel e as ações autorizadas serão exibidos aqui.</p></div> : <><p className={common.eyebrow}>Acesso selecionado</p><h2>{selected.name}</h2><div className={styles.profile}><span>{selected.email}</span><span>Conta criada em {new Date(selected.created_at).toLocaleDateString("pt-BR")}</span></div><div className={common.field}><label>PAPEL ATRIBUÍDO</label><select value={roleDraft} onChange={(event) => setRoleDraft(event.target.value)}><option value="user">Usuário</option><option value="admin">Administrador</option></select></div><div className={styles.warning}>Mudanças de privilégio exigem confirmação recente de senha e são validadas novamente pelo backend.</div><button className={common.primary} disabled={!roleDraft || roleDraft === selected.role} onClick={() => setPendingRole(roleDraft)}>Revisar alteração</button></>}
      </aside>
    </div>
    <ConfirmPasswordDialog open={Boolean(selected && pendingRole && pendingRole !== selected.role)} title="Alterar nível de acesso" description={selected && pendingRole ? `${selected.name} passará a ter o perfil ${pendingRole === "admin" ? "administrador" : "usuário"}.` : ""} onClose={() => setPendingRole(null)} onConfirmed={async () => { if (!selected || !pendingRole) return; const response = await adminApi.updateUserRole(selected.id, pendingRole); setSelected(response.data.user); setRoleDraft(response.data.user.role); setNotice(response.message); setPendingRole(null); await load(); }} />
  </div>;
}
