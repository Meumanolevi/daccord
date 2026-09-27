<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge(['email' => mb_strtolower(trim((string) $this->email))]);
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    public function messages(): array
    {
        return [
            'password.confirmed' => 'A confirmação da senha não corresponde.',
            'password.min' => 'A senha deve ter no mínimo 12 caracteres.',
            'password.password.mixed' => 'A senha deve conter letras maiúsculas e minúsculas.',
            'password.password.numbers' => 'A senha deve conter pelo menos um número.',
            'password.password.symbols' => 'A senha deve conter pelo menos um símbolo.',
        ];
    }
}
