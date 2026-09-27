import { apiRequest } from "@/lib/api-client";
import type { AdminUser, InventoryItem, Pagination, Product, ProductSummary, ProductVariant } from "@/types/catalog";

const queryString = (values: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "all") params.set(key, String(value));
  });
  return params.size ? `?${params.toString()}` : "";
};

export const adminApi = {
  products: (filters: Record<string, string | number | undefined> = {}) =>
    apiRequest<Pagination<ProductSummary>>(`/api/v1/admin/products${queryString(filters)}`),
  product: (id: number) => apiRequest<{ product: Product }>(`/api/v1/admin/products/${id}`),
  createProduct: (payload: unknown) => apiRequest<{ product: Product }>("/api/v1/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  updateProduct: (id: number, payload: unknown) => apiRequest<{ product: Product }>(`/api/v1/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }),
  deleteProduct: (id: number) => apiRequest<null>(`/api/v1/admin/products/${id}`, { method: "DELETE" }),
  createVariant: (productId: number, payload: unknown) => apiRequest<{ variant: ProductVariant }>(`/api/v1/admin/products/${productId}/variants`, {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  updateVariant: (productId: number, variantId: number, payload: unknown) => apiRequest<{ variant: ProductVariant }>(`/api/v1/admin/products/${productId}/variants/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }),
  deleteVariant: (productId: number, variantId: number) => apiRequest<null>(`/api/v1/admin/products/${productId}/variants/${variantId}`, { method: "DELETE" }),
  inventory: (filters: Record<string, string | number | undefined> = {}) =>
    apiRequest<Pagination<InventoryItem>>(`/api/v1/admin/inventory${queryString(filters)}`),
  inventoryItem: (variantId: number) => apiRequest<{ inventory: InventoryItem }>(`/api/v1/admin/inventory/${variantId}`),
  updateInventory: (variantId: number, payload: unknown) => apiRequest<{ inventory: InventoryItem }>(`/api/v1/admin/inventory/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }),
  users: () => apiRequest<Pagination<AdminUser>>("/api/v1/admin/users"),
  confirmPassword: (password: string) => apiRequest<null>("/api/v1/auth/confirm-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  }),
  updateUserRole: (id: number, role: string) => apiRequest<{ user: AdminUser }>(`/api/v1/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  }),
};
