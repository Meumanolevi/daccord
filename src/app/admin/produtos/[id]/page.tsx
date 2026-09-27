import { notFound } from "next/navigation";
import { ProductEditorPage } from "@/components/admin/product-editor-page";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId < 1) notFound();
  return <ProductEditorPage productId={productId} />;
}
