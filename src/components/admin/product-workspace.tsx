"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { adminApi } from "@/lib/admin-api";
import { ApiError } from "@/lib/api-client";
import type { Pagination, ProductSummary } from "@/types/catalog";
import { ProductEditor } from "./product-editor";
import common from "./admin-common.module.css";
import styles from "./product-admin.module.css";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const statusLabel = { active: "Ativo", draft: "Rascunho", blocked: "Bloqueado", archived: "Arquivado" };
const aiLabel = { eligible: "Elegível", review: "Em revisão", blocked: "Bloqueado" };

export function ProductWorkspace() {
  const [products, setProducts] = useState<Pagination<ProductSummary> | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");
  const [aiStatus, setAiStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await adminApi.products({ search, status, stock, ai_status: aiStatus, page });
      setProducts(response.data);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Não foi possível consultar o catálogo.");
    } finally { setLoading(false); }
  }, [aiStatus, page, search, status, stock]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const changed = async (message: string, productId?: number) => {
    setNotice(message);
    if (productId) { setCreating(false); setSelectedId(productId); }
    await load();
  };

  return <div className={common.page}>
    <header className={common.pageHead}><div><p className={common.eyebrow}>{products?.total ?? "—"} produtos</p><h1>Catálogo</h1><span>Gerencie publicação, composição, variações, preços, estoque e participação nas recomendações sem perder o contexto da lista.</span></div><button className={common.primary} onClick={() => { setCreating(true); setSelectedId(null); }}>Novo produto</button></header>
    {notice ? <div className={common.notice} role="status">{notice}</div> : null}
    <section className={`${common.toolbar} ${common.surface}`}>
      <form className={common.search} onSubmit={(event) => { event.preventDefault(); setPage(1); void load(); }}><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar nome, SKU ou variação…" aria-label="Buscar produtos" /></form>
      <select className={common.select} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filtrar status"><option value="all">Todos os status</option><option value="active">Ativos</option><option value="draft">Rascunhos</option><option value="blocked">Bloqueados</option><option value="archived">Arquivados</option></select>
      <select className={common.select} value={stock} onChange={(event) => { setStock(event.target.value); setPage(1); }} aria-label="Filtrar estoque"><option value="all">Todo estoque</option><option value="low">Estoque baixo</option><option value="out">Sem estoque</option></select>
      <select className={common.select} value={aiStatus} onChange={(event) => { setAiStatus(event.target.value); setPage(1); }} aria-label="Filtrar recomendação"><option value="all">Uso pela AI</option><option value="eligible">Elegíveis</option><option value="review">Em revisão</option><option value="blocked">Bloqueados</option></select>
    </section>

    <div className={`${styles.catalogLayout} ${(selectedId || creating) ? styles.withEditor : ""}`}>
      <section className={`${common.surface} ${common.table} ${styles.productTable}`}>
        <div className={common.tableHead}><span>PRODUTO</span><span>STATUS</span><span>VAR.</span><span>ESTOQUE</span><span>RECOMENDAÇÃO AI</span><span /></div>
        {loading ? <div className={common.loading}><span /><p>Carregando produtos…</p></div> : error ? <div className={common.error}><h2>Catálogo indisponível</h2><p>{error}</p><button className={common.secondary} onClick={() => void load()}>Tentar novamente</button></div> : products?.data.length ? products.data.map((product) => <button type="button" className={`${common.tableRow} ${styles.productRow} ${selectedId === product.id ? styles.selected : ""}`} key={product.id} onClick={() => { setCreating(false); setSelectedId(product.id); }}>
          <div className={styles.productCell}><span className={styles.productVisual} style={{ "--tone": product.tone, "--soft": product.tone_soft } as CSSProperties} /><div className={common.productName}><strong>{product.name}</strong><span>{product.base_sku} · {product.category}</span><small>{product.min_price_cents === null ? "Sem preço" : `a partir de ${money.format(product.min_price_cents / 100)}`}</small></div></div>
          <span className={`${common.status} ${product.status === "active" ? common.good : product.status === "blocked" ? common.bad : common.info}`}>{statusLabel[product.status]}</span>
          <strong>{product.variants_count}</strong><div><strong>{product.total_stock} un.</strong>{product.has_low_stock ? <small className={styles.low}>revisar saldo</small> : null}</div>
          <span className={`${common.status} ${product.ai_status === "eligible" ? common.good : product.ai_status === "blocked" ? common.bad : common.warn}`}>{aiLabel[product.ai_status]}</span><span className={common.rowAction}>›</span>
        </button>) : <div className={common.empty}><h2>Nenhum produto encontrado</h2><p>Revise a busca ou remova os filtros. Nenhum dado do catálogo foi alterado.</p><button className={common.secondary} onClick={() => { setSearch(""); setStatus("all"); setStock("all"); setAiStatus("all"); }}>Limpar filtros</button></div>}
        {products && products.last_page > 1 ? <footer className={common.pagination}><span>Página {products.current_page} de {products.last_page}</span><div><button className={common.secondary} disabled={products.current_page === 1} onClick={() => setPage((value) => value - 1)}>Anterior</button><button className={common.secondary} disabled={products.current_page === products.last_page} onClick={() => setPage((value) => value + 1)}>Próxima</button></div></footer> : null}
      </section>
      {(selectedId || creating) ? <ProductEditor key={creating ? "new" : selectedId} productId={creating ? null : selectedId} onClose={() => { setCreating(false); setSelectedId(null); }} onChanged={changed} /> : null}
    </div>
  </div>;
}
