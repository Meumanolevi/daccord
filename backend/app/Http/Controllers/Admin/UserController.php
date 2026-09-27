<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRoleRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->with('role:id,name,slug')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(25)
            ->through(fn (User $user): array => UserResource::make($user)->resolve());

        return ApiResponse::success($users, 'Usuários consultados.');
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user): JsonResponse
    {
        $role = Role::query()->where('slug', $request->string('role'))->firstOrFail();

        if ($request->user()->is($user) && $role->slug !== Role::ADMIN) {
            return ApiResponse::error('Você não pode remover o próprio acesso administrativo.', 409);
        }

        DB::transaction(function () use ($user, $role): void {
            $user->refresh()->load('role');

            if ($user->role->slug === Role::ADMIN && $role->slug !== Role::ADMIN) {
                $adminRoleId = Role::query()->where('slug', Role::ADMIN)->value('id');
                $adminCount = User::query()->where('role_id', $adminRoleId)->lockForUpdate()->count();

                abort_if($adminCount <= 1, 409, 'O sistema precisa manter pelo menos um administrador.');
            }

            $user->update(['role_id' => $role->id]);
        });

        return ApiResponse::success([
            'user' => UserResource::make($user->load('role'))->resolve(),
        ], 'Nível de acesso atualizado.');
    }
}
