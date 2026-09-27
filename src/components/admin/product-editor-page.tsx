"use client";

import { useRouter } from "next/navigation";
import { ProductEditor } from "./product-editor";
import common from "./admin-common.module.css";

export function ProductEditorPage({ productId }: { productId: number | null }) {
  const router = useRouter();
  return <div className={common.page}>
    <header className={common.pageHead}><div><p className={common.eyebrow}>{productId ? "Detalhe do catálogo" : "Cadastro"}</p><h1>{productId ? "Produto" : "Novo produto"}</h1><span>{productId ? "Consulte e edite identidade, variações, composição e elegibilidade." : "Crie o produto e sua primeira variação vendável no mesmo fluxo."}</span></div></header>
    <ProductEditor productId={productId} standalone onClose={() => router.push("/admin/produtos")} onChanged={async (_message, createdId) => { if (createdId) router.replace(`/admin/produtos/${createdId}`); router.refresh(); }} />
  </div>;
}
