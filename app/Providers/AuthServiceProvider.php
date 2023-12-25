<?php

namespace App\Providers;

use App\Models\Cart;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Policies\CartPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
        Cart::class => CartPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // $this->registerPolicies();

        $permissions = Cache::remember('permissions', 60 * 60, function () {
            return Permission::get('slug');
        });
        $roles = Cache::remember('roles', 60 * 60, function () {
            return Role::get('slug');
        });

        foreach ($permissions as $permission) {
            Gate::define($permission->slug, function ($user) use ($permission) {
                return $user->hasPermission($permission->slug);
            });
        }

        foreach ($roles as $role) {
            Gate::define($role->slug, function ($user) use ($role) {
                return $user->hasRole($role->slug);
            });
        }
    }
}
