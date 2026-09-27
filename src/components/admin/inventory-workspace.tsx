"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { adminApi } from "@/lib/admin-api";
import { ApiError } from "@/lib/api-client";
import type { InventoryItem, Pagination } from "@/types/catalog";
import common from "./admin-common.module.css";
import styles from "./inventory-admin.module.css";

export function InventoryWorkspace() {
  const [items, setItems] = useState<Pagination<InventoryItem> | null>(null);
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setItems((await adminApi.inventory({ search, status })).data); }
    catch (caught) { setError(caught instanceof ApiError ? caught.message : "Não foi possível consultar o estoque."); }
    finally { setLoading(false); }
  }, [search, status]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const open = async (item: InventoryItem) => {
    setSelected(item); setDetailLoading(true); setError("");
    try { setSelected((await adminApi.inventoryItem(item.variant.id)).data.inventory); }
    catch (caught) { setError(caught instanceof ApiError ? caught.message : "Não foi possível consultar o histórico."); }
    finally { setDetailLoading(false); }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!selected) return;
    const data = new FormData(event.currentTarget); setSaving(true); setError("");
    try {
      const response = await adminApi.updateInventory(selected.variant.id, {
        quantity_available: Number(data.get("quantity_available")),
        low_stock_threshold: Number(data.get("low_stock_threshold")),
        reason: data.get("reason"),
      });
      setNotice(response.message); await load(); await open(response.data.inventory);
    } catch (caught) { setError(caught instanceof ApiError ? caught.message : "Não foi possível atualizar o estoque."); }
    finally { setSaving(false); }
  };

  return <div className={common.page}>
    <header className={common.pageHead}><div><p className={common.eyebrow}>Estoque de venda</p><h1>Estoque</h1><span>Consulte o saldo de cada variação, ajuste limites e registre o motivo de toda movimentação.</span></div></header>
    {notice ? <div className={common.notice}>{notice}</div> : null}
    {error ? <div className={`${common.notice} ${common.errorNotice}`}>{error}</div> : null}
    <section className={`${common.toolbar} ${common.surface}`}><form className={common.search} onSubmit={(event) => { event.preventDefault(); void load(); }}><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto ou SKU…" /></form><select className={common.select} value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Todos os saldos</option><option value="available">Disponível</option><option value="low">Estoque baixo</option><option value="out">Sem estoque</option></select></section>
    <div className={common.panelGrid}>
      <section className={`${common.surface} ${styles.stockTable}`}>
        <div className={styles.stockHead}><span>PRODUTO / VARIAÇÃO</span><span>SALDO</span><span>LIMITE</span><span>ESTADO</span><span /></div>
        {loading ? <div className={common.loading}><span /><p>Consultando saldos…</p></div> : items?.data.length ? items.data.map((item) => <button className={`${styles.stockRow} ${selected?.id === item.id ? styles.selected : ""}`} type="button" key={item.id} onClick={() => void open(item)}><div className={common.productName}><strong>{item.variant.product.name} · {item.variant.name}</strong><span>{item.variant.sku}</span></div><strong>{item.quantity_available} un.</strong><span>{item.low_stock_threshold} un.</span><span className={`${common.status} ${item.status === "available" ? common.good : item.status === "low" ? common.warn : common.bad}`}>{item.status === "available" ? "Disponível" : item.status === "low" ? "Baixo" : "Sem estoque"}</span><span className={common.rowAction}>›</span></button>) : <div className={common.empty}><h2>Nenhum saldo encontrado</h2><p>Revise a busca ou o filtro selecionado.</p></div>}
      </section>
      <aside className={`${common.surface} ${styles.inspector}`}>
        {!selected ? <div className={common.empty}><h2>Selecione uma variação</h2><p>O ajuste e o histórico aparecem aqui sem perder a posição da lista.</p></div> : detailLoading ? <div className={common.loading}><span /></div> : <>
          <p className={common.eyebrow}>Saldo selecionado</p><h2>{selected.variant.product.name}</h2><span className={styles.variantTitle}>{selected.variant.name} · {selected.variant.sku}</span>
          <form onSubmit={save} className={styles.adjustForm}><div className={common.fieldGrid}><div className={common.field}><label>QUANTIDADE DISPONÍVEL</label><input name="quantity_available" type="number" min="0" defaultValue={selected.quantity_available} required /></div><div className={common.field}><label>LIMITE BAIXO</label><input name="low_stock_threshold" type="number" min="0" defaultValue={selected.low_stock_threshold} required /></div></div><div className={common.field}><label>MOTIVO DO AJUSTE</label><textarea name="reason" minLength={3} placeholder="Ex.: entrada recebida e conferida" required /></div><button className={common.primary} disabled={saving}>{saving ? "Registrando…" : "Atualizar estoque"}</button></form>
          <section className={styles.history}><h3>Movimentações recentes</h3>{selected.movements?.length ? selected.movements.map((movement) => <article key={movement.id}><div><strong>{movement.adjustment > 0 ? `+${movement.adjustment}` : movement.adjustment} un.</strong><span>{movement.quantity_before} → {movement.quantity_after}</span></div><p>{movement.reason}</p><small>{movement.user ?? "Sistema"} · {new Date(movement.created_at).toLocaleString("pt-BR")}</small></article>) : <p>Nenhuma movimentação registrada.</p>}</section>
        </>}
      </aside>
    </div>
  </div>;
}
