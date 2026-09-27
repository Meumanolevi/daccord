<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreProductRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'base_sku' => mb_strtoupper(trim((string) $this->input('base_sku'))),
            'slug' => $this->filled('slug') ? Str::slug((string) $this->input('slug')) : Str::slug((string) $this->input('name')),
        ]);
    }

    public function rules(): array
    {
        return [
            'base_sku' => ['required', 'string', 'max:80', 'unique:products,base_sku'],
            'slug' => ['required', 'string', 'max:160', 'unique:products,slug'],
            'name' => ['required', 'string', 'max:160'],
            'eyebrow' => ['nullable', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:2000'],
            'status' => ['required', Rule::in([Product::STATUS_DRAFT, Product::STATUS_ACTIVE, Product::STATUS_BLOCKED, Product::STATUS_ARCHIVED])],
            'category' => ['required', 'string', 'max:80'],
            'needs' => ['nullable', 'array'],
            'needs.*' => ['string', 'max:80', 'distinct'],
            'skin_types' => ['nullable', 'array'],
            'skin_types.*' => ['string', 'max:80', 'distinct'],
            'preferences' => ['nullable', 'array'],
            'preferences.*' => ['string', 'max:80', 'distinct'],
            'textures' => ['nullable', 'array'],
            'textures.*' => ['string', 'max:80', 'distinct'],
            'reasons' => ['nullable', 'array', 'max:8'],
            'reasons.*' => ['string', 'max:180', 'distinct'],
            'tone' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'tone_soft' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'shape' => ['nullable', Rule::in(['dropper', 'jar', 'pump', 'tube', 'mist'])],
            'featured' => ['boolean'],
            'ai_status' => ['required', Rule::in(['eligible', 'review', 'blocked'])],
            'ai_goals' => ['nullable', 'string', 'max:2000'],
            'ai_restrictions' => ['nullable', 'string', 'max:2000'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.sku' => ['required', 'string', 'max:80', 'distinct', 'unique:product_variants,sku'],
            'variants.*.name' => ['required', 'string', 'max:100'],
            'variants.*.price_cents' => ['required', 'integer', 'min:0'],
            'variants.*.active' => ['boolean'],
            'variants.*.position' => ['integer', 'min:0', 'max:65535'],
            'variants.*.quantity_available' => ['required', 'integer', 'min:0'],
            'variants.*.low_stock_threshold' => ['required', 'integer', 'min:0'],
            'ingredients' => ['nullable', 'array'],
            'ingredients.*.name' => ['required', 'string', 'max:160', 'distinct'],
            'ingredients.*.concentration' => ['nullable', 'string', 'max:80'],
            'ingredients.*.source' => ['nullable', 'string', 'max:255'],
            'ingredients.*.review_status' => ['required', Rule::in(['pending', 'review', 'verified'])],
            'ingredients.*.is_allergen' => ['boolean'],
        ];
    }
}
