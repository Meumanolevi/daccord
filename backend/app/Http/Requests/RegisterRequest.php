<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge(['email' => mb_strtolower(trim((string) $this->email))]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'string', 'email:rfc', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'confirmed', Password::defaults()],
            'terms' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Já existe uma conta com este e-mail.',
            'password.confirmed' => 'A confirmação da senha não corresponde.',
            'password.min' => 'A senha deve ter no mínimo 12 caracteres.',
            'password.password.mixed' => 'A senha deve conter letras maiúsculas e minúsculas.',
            'password.password.numbers' => 'A senha deve conter pelo menos um número.',
            'password.password.symbols' => 'A senha deve conter pelo menos um símbolo.',
            'terms.accepted' => 'Aceite os termos e a política de privacidade para criar a conta.',
        ];
    }
}
