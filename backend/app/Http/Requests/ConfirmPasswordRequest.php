<?php

namespace App\Http\Requests;

class ConfirmPasswordRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return ['password' => ['required', 'string']];
    }
}
