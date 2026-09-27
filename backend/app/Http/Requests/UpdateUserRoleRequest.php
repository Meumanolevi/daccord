<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateUserRoleRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'role' => ['required', 'string', Rule::exists('roles', 'slug')],
        ];
    }
}
