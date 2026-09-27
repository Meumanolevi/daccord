<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $variants = $this->relationLoaded('variants') ? $this->variants : collect();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'base_sku' => $this->base_sku,
            'name' => $this->name,
            'eyebrow' => $this->eyebrow,
            'description' => $this->description,
            'status' => $this->status,
            'category' => $this->category,
            'featured' => $this->featured,
            'ai_status' => $this->ai_status,
            'ai_eligible' => $this->ai_status === 'eligible',
            'tone' => $this->tone,
            'tone_soft' => $this->tone_soft,
            'shape' => $this->shape,
            'variants_count' => $variants->count(),
            'total_stock' => $variants->sum(fn ($variant): int => (int) ($variant->inventory?->quantity_available ?? 0)),
            'has_low_stock' => $variants->contains(fn ($variant): bool => $variant->inventory !== null
                && $variant->inventory->quantity_available <= $variant->inventory->low_stock_threshold),
            'min_price_cents' => $variants->where('active', true)->min('price_cents'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
