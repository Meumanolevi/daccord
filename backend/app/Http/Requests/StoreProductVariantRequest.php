<?php

namespace App\Http\Requests;

class StoreProductVariantRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge(['sku' => mb_strtoupper(trim((string) $this->input('sku')))]);
    }

    public function rules(): array
    {
        return [
            'sku' => ['required', 'string', 'max:80', 'unique:product_variants,sku'],
            'name' => ['required', 'string', 'max:100'],
            'price_cents' => ['required', 'integer', 'min:0'],
            'active' => ['boolean'],
            'position' => ['integer', 'min:0', 'max:65535'],
            'quantity_available' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
        ];
    }
}
