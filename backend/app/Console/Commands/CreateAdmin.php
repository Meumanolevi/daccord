<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateAdmin extends Command
{
    protected $signature = 'admin:create {email : E-mail do administrador}';

    protected $description = 'Cria ou promove com segurança o primeiro administrador';

    public function handle(): int
    {
        $email = mb_strtolower(trim((string) $this->argument('email')));
        $name = trim((string) $this->ask('Nome'));
        $password = (string) $this->secret('Senha (mínimo 12 caracteres, maiúscula, minúscula, número e símbolo)');
        $confirmation = (string) $this->secret('Confirme a senha');

        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'password_confirmation' => $confirmation,
        ], [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $adminRole = Role::query()->firstOrCreate(
            ['slug' => Role::ADMIN],
            ['name' => 'Administrador', 'description' => 'Gerencia usuários e recursos administrativos.'],
        );

        $existing = User::query()->where('email', $email)->first();
        if ($existing && ! $this->confirm('A conta já existe. Deseja promovê-la e substituir a senha?')) {
            return self::FAILURE;
        }

        $user = $existing ?? new User;
        $user->forceFill([
            'email' => $email,
            'role_id' => $adminRole->id,
            'name' => $name,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ])->save();

        $this->info('Administrador criado com sucesso.');

        return self::SUCCESS;
    }
}
