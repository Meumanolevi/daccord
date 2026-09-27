"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { apiRequest } from "@/lib/api-client";
import type { Pagination, Product as ApiProduct } from "@/types/catalog";
import styles from "./product-catalog.module.css";

type FilterKey = "category" | "need" | "skinType" | "preference" | "texture";
type FilterState = Record<FilterKey, string[]>;
type ProductShape = "dropper" | "jar" | "pump" | "tube" | "mist";

type Product = {
  id: string;
  eyebrow: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  needs: string[];
  skinTypes: string[];
  preferences: string[];
  textures: string[];
  reasons: string[];
  tone: string;
  toneSoft: string;
  shape: ProductShape;
  featured?: boolean;
};

export type CatalogInitialState = {
  query: string;
  category: string;
  need: string;
  skinType: string;
  preference: string;
  texture: string;
};

const filterGroups: Array<{ key: FilterKey; label: string; options: Array<{ value: string; label: string }> }> = [
  { key: "category", label: "Categoria", options: [
    { value: "serum", label: "Séruns" }, { value: "hidratante", label: "Hidratantes" }, { value: "limpeza", label: "Limpeza" }, { value: "protecao-solar", label: "Proteção solar" }, { value: "bruma", label: "Brumas" },
  ] },
  { key: "need", label: "O que sua pele precisa", options: [
    { value: "sensibilidade", label: "Sensibilidade" }, { value: "hidratacao", label: "Hidratação" }, { value: "barreira", label: "Barreira fragilizada" }, { value: "oleosidade", label: "Controle de oleosidade" }, { value: "protecao", label: "Proteção diária" },
  ] },
  { key: "skinType", label: "Tipo de pele", options: [
    { value: "seca", label: "Seca" }, { value: "oleosa", label: "Oleosa" }, { value: "mista", label: "Mista" }, { value: "sensivel", label: "Sensível" },
  ] },
  { key: "preference", label: "Preferências", options: [
    { value: "sem-fragrancia", label: "Sem fragrância" }, { value: "vegano", label: "Vegano" },
  ] },
  { key: "texture", label: "Textura", options: [
    { value: "leve", label: "Leve" }, { value: "gel", label: "Gel" }, { value: "rica", label: "Rica" },
  ] },
];

const priceFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const emptyFilters = (): FilterState => ({ category: [], need: [], skinType: [], preference: [], texture: [] });

export function ProductCatalog({ initialState }: { initialState: CatalogInitialState }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [query, setQuery] = useState(initialState.query);
  const [sort, setSort] = useState("relevancia");
  const [filters, setFilters] = useState<FilterState>(() => ({
    category: initialState.category ? [initialState.category] : [],
    need: initialState.need ? [initialState.need] : [],
    skinType: initialState.skinType ? [initialState.skinType] : [],
    preference: initialState.preference ? [initialState.preference] : [],
    texture: initialState.texture ? [initialState.texture] : [],
  }));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    apiRequest<Pagination<ApiProduct>>("/api/v1/products")
      .then((response) => {
        if (!active) return;
        setProducts(response.data.data.map((product) => ({
          id: String(product.id),
          eyebrow: product.eyebrow ?? product.category,
          name: product.name,
          description: product.description,
          price: (product.min_price_cents ?? 0) / 100,
          categories: [product.category],
          needs: product.needs,
          skinTypes: product.skin_types,
          preferences: product.preferences,
          textures: product.textures,
          reasons: product.reasons,
          tone: product.tone,
          toneSoft: product.tone_soft,
          shape: product.shape,
          featured: product.featured,
        })));
      })
      .catch(() => active && setCatalogError("Não foi possível carregar os produtos agora."))
      .finally(() => active && setCatalogLoading(false));
    return () => { active = false; };
  }, []);

  const activeCount = Object.values(filters).reduce((total, values) => total + values.length, 0);
  const results = useMemo(() => {
    const normalizedQuery = normalize(query);
    const filtered = products.filter((product) => {
      const searchable = normalize(`${product.name} ${product.eyebrow} ${product.description} ${product.reasons.join(" ")}`);
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesCategory = !filters.category.length || filters.category.some((value) => product.categories.includes(value));
      const matchesNeed = !filters.need.length || filters.need.some((value) => product.needs.includes(value));
      const matchesSkin = !filters.skinType.length || filters.skinType.some((value) => product.skinTypes.includes(value));
      const matchesPreference = !filters.preference.length || filters.preference.some((value) => product.preferences.includes(value));
      const matchesTexture = !filters.texture.length || filters.texture.some((value) => product.textures.includes(value));
      return matchesQuery && matchesCategory && matchesNeed && matchesSkin && matchesPreference && matchesTexture;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "menor-preco") return a.price - b.price;
      if (sort === "maior-preco") return b.price - a.price;
      if (sort === "nome") return a.name.localeCompare(b.name, "pt-BR");
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [filters, products, query, sort]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("busca", query.trim());
    if (filters.category[0]) params.set("categoria", filters.category[0]);
    if (filters.need[0]) params.set("necessidade", filters.need[0]);
    if (filters.skinType[0]) params.set("tipo", filters.skinType[0]);
    if (filters.preference[0]) params.set("preferencia", filters.preference[0]);
    if (filters.texture[0]) params.set("textura", filters.texture[0]);
    const nextUrl = params.size ? `/produtos?${params.toString()}` : "/produtos";
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [filters, query]);

  useEffect(() => {
    if (!drawerOpen && !quickView) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setQuickView(null);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen, quickView]);

  const toggleFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters(emptyFilters());
    setQuery("");
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  };

  return (
    <main className={styles.catalog}>
      <section className={styles.hero} aria-labelledby="catalog-title">
        <div>
          <p>Curadoria D’Accord</p>
          <h1 id="catalog-title">Produtos para conhecer com contexto.</h1>
          <span>Filtre por necessidade, sensação e preferência. A análise vai além e organiza uma curadoria individual para a sua pele.</span>
        </div>
        <Link href="/analise">Descobrir minha curadoria <span aria-hidden="true">→</span></Link>
      </section>

      <section className={styles.workspace} aria-label="Catálogo de produtos">
        <aside className={styles.desktopFilters} aria-label="Filtros de produtos">
          <div className={styles.filterHeading}><span>Filtrar produtos</span>{activeCount ? <button type="button" onClick={clearFilters}>Limpar ({activeCount})</button> : null}</div>
          <FilterPanel filters={filters} onToggle={toggleFilter} prefix="desktop" />
          <div className={styles.analysisPrompt}>
            <span aria-hidden="true">✦</span><p><b>Não sabe por onde começar?</b> A análise considera sinais, respostas e restrições antes de recomendar.</p><Link href="/analise">Fazer análise</Link>
          </div>
        </aside>

        <div className={styles.resultsArea}>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <span className={styles.srOnly}>Buscar no catálogo</span>
              <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por produto ou benefício" />
              {query ? <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca">×</button> : null}
            </label>
            <button className={styles.mobileFilterButton} type="button" onClick={() => setDrawerOpen(true)}>
              <span>Filtros</span>{activeCount ? <b>{activeCount}</b> : null}
            </button>
            <label className={styles.sort}>
              <span>Ordenar por</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="relevancia">Relevância</option><option value="menor-preco">Menor preço</option><option value="maior-preco">Maior preço</option><option value="nome">Nome</option>
              </select>
            </label>
          </div>

          <div className={styles.resultMeta} aria-live="polite">
            <p><b>{results.length}</b> {results.length === 1 ? "produto encontrado" : "produtos encontrados"}</p>
            {activeCount || query ? <button type="button" onClick={clearFilters}>Limpar busca e filtros</button> : <span>Disponibilidade atualizada pelo estoque D’Accord</span>}
          </div>

          {catalogLoading ? (
            <div className={styles.emptyState}><span aria-hidden="true">◌</span><h2>Carregando a curadoria…</h2><p>Estamos consultando o catálogo e a disponibilidade de cada produto.</p></div>
          ) : catalogError ? (
            <div className={styles.emptyState}><span aria-hidden="true">!</span><h2>Catálogo indisponível.</h2><p>{catalogError} Atualize a página para tentar novamente.</p></div>
          ) : results.length ? (
            <div className={styles.productGrid}>
              {results.map((product) => (
                <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={toggleFavorite} onQuickView={setQuickView} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span aria-hidden="true">○</span><h2>Nenhuma combinação por aqui.</h2><p>Tente remover um filtro ou buscar por outro benefício. Sua pele não precisa caber em uma única etiqueta.</p><button type="button" onClick={clearFilters}>Ver todos os produtos</button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.guidance}>
        <p>Uma vitrine é um começo.</p><h2>A curadoria pessoal começa quando o contexto entra na conversa.</h2><Link href="/analise">Iniciar análise de pele</Link>
      </section>

      {drawerOpen ? (
        <div className={styles.drawerBackdrop} role="presentation" onMouseDown={() => setDrawerOpen(false)}>
          <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="filter-drawer-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><p id="filter-drawer-title">Filtrar produtos</p><span>{activeCount ? `${activeCount} selecionados` : "Escolha uma ou mais opções"}</span></div><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Fechar filtros">×</button></header>
            <div className={styles.drawerContent}><FilterPanel filters={filters} onToggle={toggleFilter} prefix="mobile" /></div>
            <footer>{activeCount ? <button type="button" onClick={clearFilters}>Limpar</button> : <span /> }<button type="button" onClick={() => setDrawerOpen(false)}>Ver {results.length} {results.length === 1 ? "produto" : "produtos"}</button></footer>
          </aside>
        </div>
      ) : null}

      {quickView ? <QuickView product={quickView} favorite={favorites.includes(quickView.id)} onFavorite={toggleFavorite} onClose={() => setQuickView(null)} /> : null}
    </main>
  );
}

function FilterPanel({ filters, onToggle, prefix }: { filters: FilterState; onToggle: (key: FilterKey, value: string) => void; prefix: string }) {
  return <div className={styles.filterGroups}>{filterGroups.map((group) => <details key={group.key} open><summary>{group.label}<span aria-hidden="true">+</span></summary><div>{group.options.map((option) => { const checked = filters[group.key].includes(option.value); const id = `${prefix}-${group.key}-${option.value}`; return <label key={option.value} htmlFor={id}><input id={id} type="checkbox" checked={checked} onChange={() => onToggle(group.key, option.value)} /><i aria-hidden="true">{checked ? "✓" : ""}</i><span>{option.label}</span></label>; })}</div></details>)}</div>;
}

function ProductCard({ product, favorite, onFavorite, onQuickView }: { product: Product; favorite: boolean; onFavorite: (id: string) => void; onQuickView: (product: Product) => void }) {
  return (
    <article className={styles.productCard}>
      <ProductVisual product={product} />
      <button className={`${styles.favorite} ${favorite ? styles.favoriteActive : ""}`} type="button" aria-label={favorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`} aria-pressed={favorite} onClick={() => onFavorite(product.id)}>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
      </button>
      {product.featured ? <span className={styles.featured}>Destaque da curadoria</span> : null}
      <div className={styles.productCopy}>
        <p>{product.eyebrow}</p><h2>{product.name}</h2><span>{product.description}</span>
        <ul>{product.reasons.slice(0, 2).map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <div><b>{priceFormatter.format(product.price)}</b><button type="button" onClick={() => onQuickView(product)}>Ver detalhes <span aria-hidden="true">→</span></button></div>
      </div>
    </article>
  );
}

function ProductVisual({ product, compact = false }: { product: Product; compact?: boolean }) {
  const visualStyle = { "--product-tone": product.tone, "--product-tone-soft": product.toneSoft } as CSSProperties;
  return <div className={`${styles.productVisual} ${compact ? styles.productVisualCompact : ""}`} style={visualStyle} aria-hidden="true"><span className={`${styles.packshot} ${styles[product.shape]}`}><i /><b>D’ACCORD</b><em>{product.name}</em></span><small>{product.id.toUpperCase()}</small></div>;
}

function QuickView({ product, favorite, onFavorite, onClose }: { product: Product; favorite: boolean; onFavorite: (id: string) => void; onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={onClose}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="quick-view-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className={styles.modalClose} type="button" onClick={onClose} aria-label="Fechar detalhes">×</button>
        <ProductVisual product={product} compact />
        <div className={styles.modalCopy}>
          <p>{product.eyebrow}</p><h2 id="quick-view-title">{product.name}</h2><span>{product.description}</span>
          <h3>Por que ele pode fazer sentido</h3><ul>{product.reasons.map((reason) => <li key={reason}><i aria-hidden="true">✓</i>{reason}</li>)}</ul>
          <div className={styles.modalPrice}><span>A partir de</span><b>{priceFormatter.format(product.price)}</b></div>
          <div className={styles.modalActions}><Link href="/analise">Ver compatibilidade</Link><button type="button" onClick={() => onFavorite(product.id)}>{favorite ? "Salvo na curadoria" : "Salvar na curadoria"}</button></div>
          <small>Compatibilidade individual depende da análise e não representa diagnóstico.</small>
        </div>
      </section>
    </div>
  );
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
