<?php

use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\TagController;
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
        'role' => $user->role->name,
    ]);
});

Route::middleware(['auth:sanctum','verified'])->group(function() {
    Route::get('/counts',[DashboardController::class,'index']);
    Route::post('category/deleteMany',[CategoryController::class,'deleteMany']);
    Route::post('product/deleteMany',[ProductController::class,'deleteMany']);
    Route::post('tag/deleteMany',[TagController::class,'deleteMany']);
    Route::post('product/uploadImage/{product:id}',[ProductController::class,'uploadImage']);
    Route::post('product/deleteImage',[ProductController::class,'deleteImage']);
    Route::apiResource('category',CategoryController::class,[
        'name' => 'category.'
    ]);
    Route::apiResource('product',ProductController::class,[
        'name' => 'product.'
    ]);
    Route::apiResource('tag',TagController::class,[
        'name' => 'tag.'
    ]);
    Route::get('/profile',[ProfileController::class,'show']);
    Route::post('/profile',[ProfileController::class,'update']);

});