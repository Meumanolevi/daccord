export type Pagination<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type ProductStatus = "draft" | "active" | "blocked" | "archived";
export type AiStatus = "eligible" | "review" | "blocked";
export type ProductShape = "dropper" | "jar" | "pump" | "tube" | "mist";

export type ProductIngredient = {
  id?: number;
  name: string;
  concentration: string | null;
  source: string | null;
  review_status: "pending" | "review" | "verified";
  is_allergen: boolean;
};

export type ProductVariant = {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  price_cents: number;
  active: boolean;
  position: number;
  inventory: {
    id: number;
    quantity_available: number;
    low_stock_threshold: number;
    updated_at: string;
  } | null;
  created_at: string;
  updated_at: string;
};

export type ProductSummary = {
  id: number;
  slug: string;
  base_sku: string;
  name: string;
  eyebrow: string | null;
  description: string;
  status: ProductStatus;
  category: string;
  featured: boolean;
  ai_status: AiStatus;
  ai_eligible: boolean;
  tone: string;
  tone_soft: string;
  shape: ProductShape;
  variants_count: number;
  total_stock: number;
  has_low_stock: boolean;
  min_price_cents: number | null;
  created_at: string;
  updated_at: string;
};

export type Product = ProductSummary & {
  needs: string[];
  skin_types: string[];
  preferences: string[];
  textures: string[];
  reasons: string[];
  ai_goals: string | null;
  ai_restrictions: string | null;
  variants: ProductVariant[];
  ingredients: ProductIngredient[];
};

export type InventoryItem = {
  id: number;
  quantity_available: number;
  low_stock_threshold: number;
  status: "available" | "low" | "out";
  variant: {
    id: number;
    sku: string;
    name: string;
    active: boolean;
    price_cents: number;
    product: { id: number; name: string; base_sku: string; status: ProductStatus };
  };
  updated_by: { id: number; name: string } | null;
  movements?: Array<{
    id: number;
    quantity_before: number;
    adjustment: number;
    quantity_after: number;
    reason: string;
    user: string | null;
    created_at: string;
  }>;
  updated_at: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
};
