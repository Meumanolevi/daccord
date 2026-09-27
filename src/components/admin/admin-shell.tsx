"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AccessibilityControls, useAccessibilityPreferences } from "@/components/accessibility/accessibility-controls";
import { useAuth } from "@/components/auth/auth-provider";
import { AdminNotifications } from "@/components/admin/admin-notifications";
import styles from "./admin-shell.module.css";

type NavItem = { label: string; href?: string; icon: IconName };
type IconName = "home" | "box" | "stock" | "orders" | "users" | "spark" | "content" | "support" | "audit" | "settings" | "accessibility";

const groups: Array<{ label: string; items: NavItem[] }> = [
  { label: "Operação", items: [
    { label: "Visão geral", href: "/admin", icon: "home" },
    { label: "Catálogo", href: "/admin/produtos", icon: "box" },
    { label: "Estoque", href: "/admin/estoque", icon: "stock" },
    { label: "Pedidos", icon: "orders" },
    { label: "Clientes", icon: "users" },
  ] },
  { label: "Inteligência", items: [
    { label: "Fila de análises", icon: "spark" },
    { label: "Governança AI", icon: "spark" },
  ] },
  { label: "Gestão", items: [
    { label: "Usuários e acesso", href: "/admin/usuarios", icon: "users" },
    { label: "Conteúdo", icon: "content" },
    { label: "Suporte", icon: "support" },
    { label: "Auditoria", icon: "audit" },
    { label: "Configurações", icon: "settings" },
  ] },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const accessibilityRef = useRef<HTMLDivElement>(null);
  const { textScale, highContrast, changeTextScale, toggleHighContrast } = useAccessibilityPreferences();

  useEffect(() => {
    if (!loading && !user) router.replace(`/entrar?retorno=${encodeURIComponent(pathname)}`);
  }, [loading, pathname, router, user]);

  useEffect(() => {
    if (!accessibilityOpen) return;
    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !accessibilityRef.current?.contains(event.target)) {
        setAccessibilityOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
  }, [accessibilityOpen]);

  if (loading || !user) {
    return <main className={styles.gate}><span className={styles.spinner} /><p>Validando acesso seguro…</p></main>;
  }

  if (user.role !== "admin") {
    return <main className={styles.gate}><p className={styles.eyebrow}>Acesso restrito</p><h1>Este espaço exige perfil administrador.</h1><p>Sua sessão está ativa, mas não possui permissão para operar o painel.</p><Link href="/">Voltar para a loja</Link></main>;
  }

  const initials = user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}><span>D’ACCORD</span><small>ADMIN</small></div>
        <div className={styles.environment}><span>AMBIENTE</span><b><i /> DESENVOLVIMENTO</b></div>
        <nav aria-label="Navegação administrativa">
          {groups.map((group) => <div className={styles.navGroup} key={group.label}>
            <p>{group.label}</p>
            {group.items.map((item) => {
              const active = item.href === "/admin" ? pathname === item.href : Boolean(item.href && pathname.startsWith(item.href));
              return item.href ? (
                <Link className={active ? styles.active : ""} href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>
                  <AdminIcon name={item.icon} /><span>{item.label}</span>
                </Link>
              ) : (
                <span className={styles.disabled} title="Módulo aguardando API" key={item.label}>
                  <AdminIcon name={item.icon} /><span>{item.label}</span><small>EM BREVE</small>
                </span>
              );
            })}
          </div>)}
        </nav>
        <div className={styles.sidebarFoot}><strong>D’ACCORD ADMIN · MVP</strong><span>Sessão protegida por Sanctum</span></div>
      </aside>

      {menuOpen ? <button className={styles.backdrop} aria-label="Fechar navegação" onClick={() => setMenuOpen(false)} /> : null}

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <button className={styles.menuButton} onClick={() => setMenuOpen(true)} aria-label="Abrir navegação"><AdminIcon name="content" /></button>
          <div className={styles.context}><strong>Painel administrativo</strong><span>Operação D’Accord</span></div>
          <div className={styles.topbarActions}>
            <AdminNotifications />
            <div className={styles.accessibility} ref={accessibilityRef}>
              <button type="button" aria-label="Acessibilidade" aria-expanded={accessibilityOpen} aria-controls="admin-accessibility-controls" onClick={() => setAccessibilityOpen((open) => !open)}>
                <AdminIcon name="accessibility" />
              </button>
              {accessibilityOpen ? <div className={styles.accessibilityPanel} id="admin-accessibility-controls">
                <AccessibilityControls textScale={textScale} highContrast={highContrast} onTextScale={changeTextScale} onHighContrast={toggleHighContrast} />
              </div> : null}
            </div>
            <div className={styles.account}>
              <div><strong>{user.name}</strong><span>Administradora · Operações</span></div>
              <span className={styles.avatar}>{initials}</span>
              <button onClick={async () => { await logout(); router.push("/entrar"); }}>Sair</button>
            </div>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

function AdminIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
    stock: <><path d="M4 5h16v14H4zM8 5v14M16 5v14M4 10h16M4 15h16"/></>,
    orders: <><path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h4"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M16 5.5a3 3 0 0 1 0 5.5M16 14c2.8.2 4.3 2.2 4.5 5"/></>,
    spark: <><path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/></>,
    content: <><path d="M4 5h16M4 12h16M4 19h16"/></>,
    support: <><path d="M4 13a8 8 0 0 1 16 0M4 13v5h3v-5H4ZM20 13v5h-3v-5h3ZM17 20c-1 1-2.7 1-4 1"/></>,
    audit: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5M11 7v4l3 2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7-.7-1.7.9-1.9-2.1-2.1-1.9.9-1.7-.7-.7-2h-3l-.7 2-1.7.7-1.9-.9-2.1 2.1.9 1.9-.7 1.7-2 .7v3l2 .7.7 1.7-.9 1.9 2.1 2.1 1.9-.9 1.7.7.7 2h3l.7-2 1.7-.7 1.9.9 2.1-2.1-.9-1.9.7-1.7 2-.7Z"/></>,
    accessibility: <><circle cx="12" cy="4" r="2"/><path d="M5 8h14M12 6v6m0 0-4 8m4-8 4 8"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}
