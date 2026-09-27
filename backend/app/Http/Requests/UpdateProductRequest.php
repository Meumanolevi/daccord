<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('base_sku')) {
            $this->merge(['base_sku' => mb_strtoupper(trim((string) $this->input('base_sku')))]);
        }
    }

    public function rules(): array
    {
        $product = $this->route('product');

        return [
            'base_sku' => ['sometimes', 'required', 'string', 'max:80', Rule::unique('products', 'base_sku')->ignore($product)],
            'slug' => ['sometimes', 'required', 'string', 'max:160', Rule::unique('products', 'slug')->ignore($product)],
            'name' => ['sometimes', 'required', 'string', 'max:160'],
            'eyebrow' => ['sometimes', 'nullable', 'string', 'max:120'],
            'description' => ['sometimes', 'required', 'string', 'max:2000'],
            'status' => ['sometimes', 'required', Rule::in([Product::STATUS_DRAFT, Product::STATUS_ACTIVE, Product::STATUS_BLOCKED, Product::STATUS_ARCHIVED])],
            'category' => ['sometimes', 'required', 'string', 'max:80'],
            'needs' => ['sometimes', 'nullable', 'array'],
            'needs.*' => ['string', 'max:80', 'distinct'],
            'skin_types' => ['sometimes', 'nullable', 'array'],
            'skin_types.*' => ['string', 'max:80', 'distinct'],
            'preferences' => ['sometimes', 'nullable', 'array'],
            'preferences.*' => ['string', 'max:80', 'distinct'],
            'textures' => ['sometimes', 'nullable', 'array'],
            'textures.*' => ['string', 'max:80', 'distinct'],
            'reasons' => ['sometimes', 'nullable', 'array', 'max:8'],
            'reasons.*' => ['string', 'max:180', 'distinct'],
            'tone' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'tone_soft' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'shape' => ['sometimes', Rule::in(['dropper', 'jar', 'pump', 'tube', 'mist'])],
            'featured' => ['sometimes', 'boolean'],
            'ai_status' => ['sometimes', 'required', Rule::in(['eligible', 'review', 'blocked'])],
            'ai_goals' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'ai_restrictions' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'ingredients' => ['sometimes', 'array'],
            'ingredients.*.name' => ['required', 'string', 'max:160', 'distinct'],
            'ingredients.*.concentration' => ['nullable', 'string', 'max:80'],
            'ingredients.*.source' => ['nullable', 'string', 'max:255'],
            'ingredients.*.review_status' => ['required', Rule::in(['pending', 'review', 'verified'])],
            'ingredients.*.is_allergen' => ['boolean'],
        ];
    }
}
