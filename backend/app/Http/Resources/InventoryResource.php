<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity_available' => $this->quantity_available,
            'low_stock_threshold' => $this->low_stock_threshold,
            'status' => $this->quantity_available === 0
                ? 'out'
                : ($this->quantity_available <= $this->low_stock_threshold ? 'low' : 'available'),
            'variant' => $this->whenLoaded('variant', fn (): array => [
                'id' => $this->variant->id,
                'sku' => $this->variant->sku,
                'name' => $this->variant->name,
                'active' => $this->variant->active,
                'price_cents' => $this->variant->price_cents,
                'product' => [
                    'id' => $this->variant->product->id,
                    'name' => $this->variant->product->name,
                    'base_sku' => $this->variant->product->base_sku,
                    'status' => $this->variant->product->status,
                ],
            ]),
            'updated_by' => $this->whenLoaded('updatedBy', fn (): ?array => $this->updatedBy ? [
                'id' => $this->updatedBy->id,
                'name' => $this->updatedBy->name,
            ] : null),
            'movements' => $this->relationLoaded('movements') ? $this->movements->map(fn ($movement): array => [
                'id' => $movement->id,
                'quantity_before' => $movement->quantity_before,
                'adjustment' => $movement->adjustment,
                'quantity_after' => $movement->quantity_after,
                'reason' => $movement->reason,
                'user' => $movement->relationLoaded('user') && $movement->user ? $movement->user->name : null,
                'created_at' => $movement->created_at?->toISOString(),
            ])->values()->all() : [],
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
