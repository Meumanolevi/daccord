<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'sku' => $this->sku,
            'name' => $this->name,
            'price_cents' => $this->price_cents,
            'active' => $this->active,
            'position' => $this->position,
            'inventory' => $this->whenLoaded('inventory', fn (): ?array => $this->inventory ? [
                'id' => $this->inventory->id,
                'quantity_available' => $this->inventory->quantity_available,
                'low_stock_threshold' => $this->inventory->low_stock_threshold,
                'updated_at' => $this->inventory->updated_at?->toISOString(),
            ] : null),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
