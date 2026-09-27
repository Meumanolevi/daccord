<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateProductVariantRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('sku')) {
            $this->merge(['sku' => mb_strtoupper(trim((string) $this->input('sku')))]);
        }
    }

    public function rules(): array
    {
        return [
            'sku' => ['sometimes', 'required', 'string', 'max:80', Rule::unique('product_variants', 'sku')->ignore($this->route('variant'))],
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'price_cents' => ['sometimes', 'required', 'integer', 'min:0'],
            'active' => ['sometimes', 'boolean'],
            'position' => ['sometimes', 'integer', 'min:0', 'max:65535'],
        ];
    }
}
