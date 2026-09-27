"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { adminApi } from "@/lib/admin-api";
import { ApiError } from "@/lib/api-client";
import type { AiStatus, Product, ProductIngredient, ProductShape, ProductStatus, ProductVariant } from "@/types/catalog";
import { ConfirmPasswordDialog } from "./confirm-password-dialog";
import common from "./admin-common.module.css";
import styles from "./product-admin.module.css";

type Draft = {
  base_sku: string; slug: string; name: string; eyebrow: string; description: string;
  status: ProductStatus; category: string; needs: string; skin_types: string; preferences: string;
  textures: string; reasons: string; tone: string; tone_soft: string; shape: ProductShape;
  featured: boolean; ai_status: AiStatus; ai_goals: string; ai_restrictions: string;
};

const blankDraft = (): Draft => ({
  base_sku: "", slug: "", name: "", eyebrow: "", description: "", status: "draft", category: "serum",
  needs: "", skin_types: "", preferences: "", textures: "", reasons: "", tone: "#8f3a66", tone_soft: "#ead0dc",
  shape: "pump", featured: false, ai_status: "review", ai_goals: "", ai_restrictions: "",
});
const split = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);
const fromProduct = (product: Product): Draft => ({
  base_sku: product.base_sku, slug: product.slug, name: product.name, eyebrow: product.eyebrow ?? "", description: product.description,
  status: product.status, category: product.category, needs: product.needs.join(", "), skin_types: product.skin_types.join(", "),
  preferences: product.preferences.join(", "), textures: product.textures.join(", "), reasons: product.reasons.join(", "),
  tone: product.tone, tone_soft: product.tone_soft, shape: product.shape, featured: product.featured, ai_status: product.ai_status,
  ai_goals: product.ai_goals ?? "", ai_restrictions: product.ai_restrictions ?? "",
});

export function ProductEditor({ productId, onClose, onChanged, standalone = false }: {
  productId: number | null;
  onClose: () => void;
  onChanged: (message: string, productId?: number) => Promise<void>;
  standalone?: boolean;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [ingredients, setIngredients] = useState<ProductIngredient[]>([]);
  const [ingredientsDirty, setIngredientsDirty] = useState(false);
  const [initialVariant, setInitialVariant] = useState({ sku: "", name: "30 ml", price: "", quantity: "0", threshold: "10" });
  const [tab, setTab] = useState<"identity" | "variants" | "composition" | "ai">("identity");
  const [loading, setLoading] = useState(productId !== null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [sensitiveAction, setSensitiveAction] = useState<null | { title: string; description: string; run: () => Promise<void> }>(null);

  const loadProduct = useCallback(async () => {
    if (productId === null) return;
    setLoading(true); setError("");
    try {
      const response = await adminApi.product(productId);
      setProduct(response.data.product);
      setDraft(fromProduct(response.data.product));
      setIngredients(response.data.product.ingredients);
      setIngredientsDirty(false);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Não foi possível consultar o produto.");
    } finally { setLoading(false); }
  }, [productId]);

  useEffect(() => { const timer = window.setTimeout(() => void loadProduct(), 0); return () => window.clearTimeout(timer); }, [loadProduct]);

  const change = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const payload = () => ({
    base_sku: draft.base_sku, ...(draft.slug ? { slug: draft.slug } : {}), name: draft.name, eyebrow: draft.eyebrow || null,
    description: draft.description, status: draft.status, category: draft.category, needs: split(draft.needs), skin_types: split(draft.skin_types),
    preferences: split(draft.preferences), textures: split(draft.textures), reasons: split(draft.reasons), tone: draft.tone, tone_soft: draft.tone_soft,
    shape: draft.shape, featured: draft.featured, ai_status: draft.ai_status, ai_goals: draft.ai_goals || null,
    ai_restrictions: draft.ai_restrictions || null,
  });

  const save = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError(""); setFieldErrors({});
    try {
      if (productId === null) {
        const response = await adminApi.createProduct({
          ...payload(), ingredients,
          variants: [{
            sku: initialVariant.sku, name: initialVariant.name,
            price_cents: Math.round(Number(initialVariant.price) * 100), active: true, position: 0,
            quantity_available: Number(initialVariant.quantity), low_stock_threshold: Number(initialVariant.threshold),
          }],
        });
        await onChanged(response.message, response.data.product.id);
      } else {
        const response = await adminApi.updateProduct(productId, { ...payload(), ...(ingredientsDirty ? { ingredients } : {}) });
        setProduct(response.data.product); setIngredients(response.data.product.ingredients); setIngredientsDirty(false);
        await onChanged(response.message, productId);
      }
    } catch (caught) {
      if (caught instanceof ApiError) { setError(caught.message); setFieldErrors(caught.errors); }
      else setError("Não foi possível salvar o produto.");
    } finally { setSaving(false); }
  };

  const deleteProduct = () => setSensitiveAction({
    title: "Excluir produto",
    description: "O produto deixará de aparecer no catálogo. Confirme sua senha para registrar a exclusão.",
    run: async () => { if (!productId) return; const response = await adminApi.deleteProduct(productId); await onChanged(response.message); onClose(); },
  });

  if (loading) return <aside className={`${styles.editor} ${standalone ? styles.standalone : ""}`}><div className={common.loading}><span /><p>Carregando produto…</p></div></aside>;
  if (error && productId !== null && !product) return <aside className={`${styles.editor} ${standalone ? styles.standalone : ""}`}><div className={common.error}><h2>Produto indisponível</h2><p>{error}</p><button className={common.secondary} onClick={() => void loadProduct()}>Tentar novamente</button></div></aside>;

  return <aside className={`${styles.editor} ${standalone ? styles.standalone : ""}`} aria-label={productId ? `Editar ${draft.name}` : "Cadastrar produto"}>
    <form onSubmit={save}>
      <header className={styles.editorHead}><div><p className={styles.eyebrow}>{productId ? "Produto selecionado" : "Novo cadastro"}</p><h2>{draft.name || "Novo produto"}</h2><span>{productId ? `SKU ${draft.base_sku}` : "O cadastro inicia como rascunho"}</span></div><button type="button" onClick={onClose} aria-label="Fechar editor">×</button></header>
      <nav className={styles.tabs} aria-label="Seções do produto">
        {(["identity", "variants", "composition", "ai"] as const).map((item) => <button type="button" className={tab === item ? styles.tabActive : ""} onClick={() => setTab(item)} key={item}>{item === "identity" ? "Identidade" : item === "variants" ? "Variações" : item === "composition" ? "Composição" : "Recomendação AI"}</button>)}
      </nav>
      <div className={styles.editorBody}>
        {error ? <div className={styles.formError}>{error}</div> : null}
        {tab === "identity" ? <IdentityFields draft={draft} change={change} errors={fieldErrors} /> : null}
        {tab === "variants" ? productId && product ? <VariantsEditor product={product} onReload={loadProduct} requestSensitive={setSensitiveAction} /> : <InitialVariantFields value={initialVariant} onChange={setInitialVariant} /> : null}
        {tab === "composition" ? <IngredientsEditor ingredients={ingredients} setIngredients={(value) => { setIngredients(value); setIngredientsDirty(true); }} /> : null}
        {tab === "ai" ? <AiFields draft={draft} change={change} /> : null}
      </div>
      <footer className={styles.editorActions}>{productId ? <button type="button" className={styles.dangerText} onClick={deleteProduct}>Excluir produto</button> : <span />}<div><button type="button" className={common.secondary} onClick={onClose}>Cancelar</button><button className={common.primary} disabled={saving}>{saving ? "Salvando…" : productId ? "Salvar alterações" : "Cadastrar produto"}</button></div></footer>
    </form>
    <ConfirmPasswordDialog open={sensitiveAction !== null} title={sensitiveAction?.title ?? "Confirmar"} description={sensitiveAction?.description ?? ""} onClose={() => setSensitiveAction(null)} onConfirmed={async () => { await sensitiveAction?.run(); }} />
  </aside>;
}

function IdentityFields({ draft, change, errors }: { draft: Draft; change: <K extends keyof Draft>(key: K, value: Draft[K]) => void; errors: Record<string, string[]> }) {
  return <section className={styles.formSection}>
    <div className={common.field}><label>NOME COMERCIAL</label><input value={draft.name} onChange={(event) => change("name", event.target.value)} required />{errors.name ? <small>{errors.name[0]}</small> : null}</div>
    <div className={common.fieldGrid}><div className={common.field}><label>SKU BASE</label><input value={draft.base_sku} onChange={(event) => change("base_sku", event.target.value)} required /></div><div className={common.field}><label>STATUS</label><select value={draft.status} onChange={(event) => change("status", event.target.value as ProductStatus)}><option value="draft">Rascunho</option><option value="active">Ativo</option><option value="blocked">Bloqueado</option><option value="archived">Arquivado</option></select></div></div>
    <div className={common.fieldGrid}><div className={common.field}><label>CHAMADA</label><input value={draft.eyebrow} onChange={(event) => change("eyebrow", event.target.value)} /></div><div className={common.field}><label>CATEGORIA</label><select value={draft.category} onChange={(event) => change("category", event.target.value)}><option value="serum">Sérum</option><option value="hidratante">Hidratante</option><option value="limpeza">Limpeza</option><option value="protecao-solar">Proteção solar</option><option value="bruma">Bruma</option></select></div></div>
    <div className={common.field}><label>DESCRIÇÃO CURTA</label><textarea value={draft.description} onChange={(event) => change("description", event.target.value)} required /></div>
    <div className={common.field}><label>NECESSIDADES <i>separadas por vírgula</i></label><input value={draft.needs} onChange={(event) => change("needs", event.target.value)} placeholder="hidratacao, sensibilidade" /></div>
    <div className={common.fieldGrid}><div className={common.field}><label>TIPOS DE PELE</label><input value={draft.skin_types} onChange={(event) => change("skin_types", event.target.value)} /></div><div className={common.field}><label>TEXTURAS</label><input value={draft.textures} onChange={(event) => change("textures", event.target.value)} /></div></div>
    <div className={common.field}><label>PREFERÊNCIAS</label><input value={draft.preferences} onChange={(event) => change("preferences", event.target.value)} /></div>
    <div className={common.field}><label>MOTIVOS DE DESTAQUE</label><input value={draft.reasons} onChange={(event) => change("reasons", event.target.value)} /></div>
    <div className={common.fieldGrid}><div className={common.field}><label>COR PRINCIPAL</label><input type="color" value={draft.tone} onChange={(event) => change("tone", event.target.value)} /></div><div className={common.field}><label>COR DE FUNDO</label><input type="color" value={draft.tone_soft} onChange={(event) => change("tone_soft", event.target.value)} /></div></div>
    <div className={common.fieldGrid}><div className={common.field}><label>EMBALAGEM</label><select value={draft.shape} onChange={(event) => change("shape", event.target.value as ProductShape)}><option value="dropper">Conta-gotas</option><option value="jar">Pote</option><option value="pump">Pump</option><option value="tube">Bisnaga</option><option value="mist">Spray</option></select></div><label className={styles.check}><input type="checkbox" checked={draft.featured} onChange={(event) => change("featured", event.target.checked)} /> Destaque da curadoria</label></div>
  </section>;
}

function InitialVariantFields({ value, onChange }: { value: { sku: string; name: string; price: string; quantity: string; threshold: string }; onChange: (value: { sku: string; name: string; price: string; quantity: string; threshold: string }) => void }) {
  return <section className={styles.formSection}><div className={styles.validation}>Todo produto precisa de ao menos uma variação vendável com preço e saldo próprios.</div><div className={common.fieldGrid}><div className={common.field}><label>SKU DA VARIAÇÃO</label><input value={value.sku} onChange={(event) => onChange({ ...value, sku: event.target.value })} required /></div><div className={common.field}><label>APRESENTAÇÃO</label><input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="30 ml" required /></div></div><div className={common.fieldGrid}><div className={common.field}><label>PREÇO (R$)</label><input value={value.price} onChange={(event) => onChange({ ...value, price: event.target.value })} type="number" min="0" step="0.01" required /></div><div className={common.field}><label>SALDO INICIAL</label><input value={value.quantity} onChange={(event) => onChange({ ...value, quantity: event.target.value })} type="number" min="0" required /></div></div><div className={common.field}><label>LIMITE DE ESTOQUE BAIXO</label><input value={value.threshold} onChange={(event) => onChange({ ...value, threshold: event.target.value })} type="number" min="0" required /></div></section>;
}

function VariantsEditor({ product, onReload, requestSensitive }: { product: Product; onReload: () => Promise<void>; requestSensitive: (action: { title: string; description: string; run: () => Promise<void> }) => void }) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [newVariant, setNewVariant] = useState({ sku: "", name: "", price: "", quantity: "0", threshold: "10" });
  return <section className={styles.formSection}>{error ? <div className={styles.formError}>{error}</div> : null}<div className={styles.variantList}>{product.variants.map((variant) => <VariantRow key={variant.id} variant={variant} onSave={async (payload) => { try { await adminApi.updateVariant(product.id, variant.id, payload); await onReload(); } catch (caught) { setError(caught instanceof ApiError ? caught.message : "Não foi possível atualizar a variação."); } }} onDelete={() => requestSensitive({ title: "Excluir variação", description: `A variação ${variant.name} deixará de ser vendida.`, run: async () => { await adminApi.deleteVariant(product.id, variant.id); await onReload(); } })} />)}</div>
    {adding ? <div className={styles.addVariant}><div className={common.fieldGrid}><div className={common.field}><label>SKU</label><input value={newVariant.sku} onChange={(event) => setNewVariant({ ...newVariant, sku: event.target.value })} /></div><div className={common.field}><label>APRESENTAÇÃO</label><input value={newVariant.name} onChange={(event) => setNewVariant({ ...newVariant, name: event.target.value })} /></div></div><div className={common.fieldGrid}><div className={common.field}><label>PREÇO</label><input value={newVariant.price} onChange={(event) => setNewVariant({ ...newVariant, price: event.target.value })} type="number" min="0" step="0.01" /></div><div className={common.field}><label>SALDO</label><input value={newVariant.quantity} onChange={(event) => setNewVariant({ ...newVariant, quantity: event.target.value })} type="number" min="0" /></div></div><div className={common.field}><label>LIMITE BAIXO</label><input value={newVariant.threshold} onChange={(event) => setNewVariant({ ...newVariant, threshold: event.target.value })} type="number" min="0" /></div><div className={styles.inlineActions}><button type="button" className={common.secondary} onClick={() => setAdding(false)}>Cancelar</button><button type="button" className={common.primary} onClick={async () => { try { await adminApi.createVariant(product.id, { sku: newVariant.sku, name: newVariant.name, price_cents: Math.round(Number(newVariant.price) * 100), active: true, position: product.variants.length, quantity_available: Number(newVariant.quantity), low_stock_threshold: Number(newVariant.threshold) }); setAdding(false); await onReload(); } catch (caught) { setError(caught instanceof ApiError ? caught.message : "Não foi possível criar a variação."); } }}>Adicionar</button></div></div> : <button type="button" className={common.secondary} onClick={() => setAdding(true)}>Adicionar variação</button>}
  </section>;
}

function VariantRow({ variant, onSave, onDelete }: { variant: ProductVariant; onSave: (payload: unknown) => Promise<void>; onDelete: () => void }) {
  const [draft, setDraft] = useState({ sku: variant.sku, name: variant.name, price: String(variant.price_cents / 100), active: variant.active });
  const [saving, setSaving] = useState(false);
  return <div className={styles.variantItem}><div className={common.fieldGrid}><div className={common.field}><label>SKU</label><input value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} /></div><div className={common.field}><label>APRESENTAÇÃO</label><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></div></div><div className={common.fieldGrid}><div className={common.field}><label>PREÇO (R$)</label><input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></div><label className={styles.check}><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Ativa para venda</label></div><div className={styles.variantMeta}><span>{variant.inventory?.quantity_available ?? 0} unidades disponíveis</span><div><button type="button" className={styles.dangerText} onClick={onDelete}>Excluir</button><button type="button" className={common.secondary} disabled={saving} onClick={async () => { setSaving(true); await onSave({ sku: draft.sku, name: draft.name, price_cents: Math.round(Number(draft.price) * 100), active: draft.active }); setSaving(false); }}>{saving ? "Salvando…" : "Salvar variação"}</button></div></div></div>;
}

function IngredientsEditor({ ingredients, setIngredients }: { ingredients: ProductIngredient[]; setIngredients: (items: ProductIngredient[]) => void }) {
  const update = (index: number, patch: Partial<ProductIngredient>) => setIngredients(ingredients.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  return <section className={styles.formSection}><div className={styles.validation}>Alterar a composição envia automaticamente o produto para nova revisão de recomendação.</div>{ingredients.map((ingredient, index) => <div className={styles.ingredientRow} key={`${ingredient.id ?? "new"}-${index}`}><div className={common.fieldGrid}><div className={common.field}><label>INGREDIENTE</label><input value={ingredient.name} onChange={(event) => update(index, { name: event.target.value })} /></div><div className={common.field}><label>CONCENTRAÇÃO</label><input value={ingredient.concentration ?? ""} onChange={(event) => update(index, { concentration: event.target.value || null })} /></div></div><div className={common.fieldGrid}><div className={common.field}><label>FONTE</label><input value={ingredient.source ?? ""} onChange={(event) => update(index, { source: event.target.value || null })} /></div><div className={common.field}><label>REVISÃO</label><select value={ingredient.review_status} onChange={(event) => update(index, { review_status: event.target.value as ProductIngredient["review_status"] })}><option value="pending">Pendente</option><option value="review">Revisar</option><option value="verified">Verificado</option></select></div></div><div className={styles.ingredientActions}><label className={styles.check}><input type="checkbox" checked={ingredient.is_allergen} onChange={(event) => update(index, { is_allergen: event.target.checked })} /> Alérgeno conhecido</label><button type="button" className={styles.dangerText} onClick={() => setIngredients(ingredients.filter((_, itemIndex) => itemIndex !== index))}>Remover</button></div></div>)}<button type="button" className={common.secondary} onClick={() => setIngredients([...ingredients, { name: "", concentration: null, source: null, review_status: "pending", is_allergen: false }])}>Adicionar ingrediente</button></section>;
}

function AiFields({ draft, change }: { draft: Draft; change: <K extends keyof Draft>(key: K, value: Draft[K]) => void }) {
  return <section className={styles.formSection}><div className={common.field}><label>STATUS DA RECOMENDAÇÃO</label><select value={draft.ai_status} onChange={(event) => change("ai_status", event.target.value as AiStatus)}><option value="review">Em revisão</option><option value="eligible">Elegível</option><option value="blocked">Bloqueado</option></select></div><div className={common.field}><label>OBJETIVOS COMPATÍVEIS</label><textarea value={draft.ai_goals} onChange={(event) => change("ai_goals", event.target.value)} /></div><div className={common.field}><label>NÃO RECOMENDAR QUANDO</label><textarea value={draft.ai_restrictions} onChange={(event) => change("ai_restrictions", event.target.value)} /></div><div className={styles.validation}>Publicação comercial e elegibilidade para recomendação são estados independentes. A API bloqueia elegibilidade quando a composição não está verificada.</div></section>;
}
