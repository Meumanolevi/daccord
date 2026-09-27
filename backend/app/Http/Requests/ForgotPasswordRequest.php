<?php

namespace App\Http\Requests;

class ForgotPasswordRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge(['email' => mb_strtolower(trim((string) $this->email))]);
    }

    public function rules(): array
    {
        return ['email' => ['required', 'email:rfc', 'max:255']];
    }
}
