"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import type { InventoryItem } from "@/types/catalog";
import styles from "./admin-common.module.css";

type DashboardState = {
  products: number;
  lowStock: number;
  outOfStock: number;
  users: number;
  exceptions: InventoryItem[];
};

export function AdminDashboard() {
  const [state, setState] = useState<DashboardState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      adminApi.products(),
      adminApi.inventory({ status: "low" }),
      adminApi.inventory({ status: "out" }),
      adminApi.users(),
    ]).then(([products, low, out, users]) => {
      if (!active) return;
      setState({
        products: products.data.total,
        lowStock: low.data.total,
        outOfStock: out.data.total,
        users: users.data.total,
        exceptions: [...out.data.data, ...low.data.data].slice(0, 6),
      });
    }).catch(() => active && setError("Não foi possível carregar o pulso da operação."));
    return () => { active = false; };
  }, []);

  return <div className={styles.page}>
    <header className={styles.pageHead}>
      <div><p className={styles.eyebrow}>Exceções primeiro</p><h1>Visão geral</h1><span>Indicadores reais do catálogo, estoque e acessos. Priorize itens sem saldo e variações abaixo do limite operacional.</span></div>
      <Link className={styles.primary} href="/admin/produtos" style={{ display: "grid", placeItems: "center", textDecoration: "none" }}>Operar catálogo</Link>
    </header>

    {error ? <section className={`${styles.error} ${styles.surface}`}><h2>Operação indisponível</h2><p>{error}</p></section> : !state ? <section className={`${styles.loading} ${styles.surface}`}><span /><p>Consultando a operação…</p></section> : <>
      <section className={styles.metrics} aria-label="Indicadores operacionais">
        <article className={`${styles.metric} ${styles.surface}`}><span>Produtos cadastrados</span><strong>{state.products}</strong><small>todos os status</small></article>
        <article className={`${styles.metric} ${styles.surface}`}><span>Estoque baixo</span><strong>{state.lowStock}</strong><small>pedem reposição</small></article>
        <article className={`${styles.metric} ${styles.surface}`}><span>Sem estoque</span><strong>{state.outOfStock}</strong><small>venda indisponível</small></article>
        <article className={`${styles.metric} ${styles.surface}`}><span>Contas internas</span><strong>{state.users}</strong><small>usuários cadastrados</small></article>
      </section>

      <section className={styles.panelGrid}>
        <article className={`${styles.surface} ${styles.table}`}>
          <div className={`${styles.tableHead} ${styles.dashboardColumns}`}><span>EXCEÇÃO</span><span>SKU</span><span>SALDO</span><span>PRÓXIMO PASSO</span></div>
          {state.exceptions.length ? state.exceptions.map((item) => <div className={`${styles.tableRow} ${styles.dashboardColumns}`} key={item.id}>
            <div className={styles.productName}><strong>{item.variant.product.name} · {item.variant.name}</strong><span>{item.status === "out" ? "Venda interrompida por falta de saldo" : "Abaixo do limite configurado"}</span></div>
            <span>{item.variant.sku}</span><strong>{item.quantity_available} un.</strong>
            <Link href="/admin/estoque">Ajustar estoque</Link>
          </div>) : <div className={styles.empty}><h2>Fila concluída</h2><p>Nenhuma variação está sem saldo ou abaixo do limite.</p></div>}
        </article>
        <aside className={`${styles.surface} ${styles.sidePanel}`}><p className={styles.eyebrow}>Atalhos operacionais</p><h2>Continuar</h2><div className={styles.list}>
          <Link className={styles.listItem} href="/admin/produtos"><div><strong>Catálogo</strong><span>Cadastrar, revisar e publicar produtos</span></div><b>→</b></Link>
          <Link className={styles.listItem} href="/admin/estoque"><div><strong>Estoque</strong><span>Consultar saldos e registrar ajustes</span></div><b>→</b></Link>
          <Link className={styles.listItem} href="/admin/usuarios"><div><strong>Usuários e acesso</strong><span>Consultar e alterar níveis autorizados</span></div><b>→</b></Link>
        </div></aside>
      </section>
    </>}
  </div>;
}
