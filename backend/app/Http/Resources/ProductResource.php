<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProductResource extends ProductSummaryResource
{
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'needs' => $this->needs ?? [],
            'skin_types' => $this->skin_types ?? [],
            'preferences' => $this->preferences ?? [],
            'textures' => $this->textures ?? [],
            'reasons' => $this->reasons ?? [],
            'ai_goals' => $this->ai_goals,
            'ai_restrictions' => $this->ai_restrictions,
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants'))->resolve($request),
            'ingredients' => $this->relationLoaded('ingredients') ? $this->ingredients->map(fn ($ingredient): array => [
                'id' => $ingredient->id,
                'name' => $ingredient->name,
                'concentration' => $ingredient->concentration,
                'source' => $ingredient->source,
                'review_status' => $ingredient->review_status,
                'is_allergen' => $ingredient->is_allergen,
            ])->values()->all() : [],
        ];
    }
}
