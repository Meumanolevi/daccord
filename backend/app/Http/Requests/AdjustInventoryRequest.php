<?php

namespace App\Http\Requests;

class AdjustInventoryRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'quantity_available' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['sometimes', 'integer', 'min:0'],
            'reason' => ['required', 'string', 'min:3', 'max:500'],
        ];
    }
}
