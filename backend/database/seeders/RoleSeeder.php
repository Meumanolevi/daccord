<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::query()->upsert([
            [
                'name' => 'Usuário',
                'slug' => Role::USER,
                'description' => 'Conta padrão com acesso à própria jornada e curadoria.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Administrador',
                'slug' => Role::ADMIN,
                'description' => 'Gerencia usuários, papéis e recursos administrativos.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['slug'], ['name', 'description', 'updated_at']);
    }
}
