import type { Metadata } from "next";
import { ProductCatalog, type CatalogInitialState } from "@/components/catalog/product-catalog";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Produtos e curadoria",
  description: "Explore a curadoria D’Accord por necessidade, tipo de pele, textura e preferências.",
  alternates: { canonical: "/produtos" },
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const firstValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const initialState: CatalogInitialState = {
    query: firstValue(params.busca),
    category: firstValue(params.categoria),
    need: firstValue(params.necessidade),
    skinType: firstValue(params.tipo),
    preference: firstValue(params.preferencia),
    texture: firstValue(params.textura),
  };

  return (
    <div>
      <SiteHeader />
      <ProductCatalog key={JSON.stringify(initialState)} initialState={initialState} />
      <SiteFooter />
    </div>
  );
}
