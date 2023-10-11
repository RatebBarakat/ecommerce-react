<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['super admin','admin'];
        $rolesModels = [];

        foreach ($roles as $role) {
            $rolesModels[$role] = Role::where('name',$role)->first();
        }

        $permissions = [
            'categories' => 'r,c,u,d',
            'products' => 'r,c,u,d',
            'tags' => 'r,c,u,d',
            'users' => 'r,c,u,d',
            'roles' => 'r,c,u,d',
        ];

        $rolesPermissions = [
            'super admin' => [
                'categories' => 'r,c,u,d',
                'products' => 'r,c,u,d',
                'tags' => 'r,c,u,d',
                'users' => 'r,c,u,d',
                'roles' => 'r,c,u,d',
            ],
            'admin' => [
                'products' => 'r,c,u,d',
                'tags' => 'r,c,u,d',
            ]
        ];

        $typesMap = [
            'r' => 'read',
            'c' => 'create',
            'u' => 'update',
            'd' => 'delete',
        ];

        $permissionsModels = [];

        foreach ($permissions as $permission => $types) {
            foreach (explode(',',$types) as $type) {
                $name = $typesMap[$type] . " " . $permission;
                $slug = Str::slug($name);

                $permissionsModels[$name] = Permission::create([
                    'name' => $name,
                    'slug' => $slug
                ]);
            }
        }

        foreach ($rolesPermissions as $role => $permissions) {
            $roleModel = $rolesModels[$role];
        
            foreach ($permissions as $permission => $types) {
                foreach (explode(',', $types) as $type) {
                    $name = $typesMap[$type] . " " . $permission;
                    $roleModel->permissions()->attach($permissionsModels[$name]);
                }
            }
        }
        
    }
    
}
