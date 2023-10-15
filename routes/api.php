<?php

use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {    
    $user = $request->user();

    $permissions = DB::table('role-permission')
        ->join('permissions', 'permissions.id', '=', 'role-permission.permission_id')
        ->where('role_id', $user->role_id)
        ->pluck('permissions.slug');

    return response()->json([
        'user' => $user,
        'permissions' => $permissions,
    ]);
});

Route::middleware(['auth:sanctum','verified'])->group(function() {
    Route::apiResource('category',CategoryController::class);
    Route::get('/profile',[ProfileController::class,'show']);
    Route::post('/profile',[ProfileController::class,'update']);

});