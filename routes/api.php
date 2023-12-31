<?php

use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController as UserCategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\User\ProductController as UserProductController;
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

Route::prefix('user')->group(function () {
    Route::get('/category', [UserCategoryController::class, 'index'])->name('user.category.index');
    Route::get('/product', [UserProductController::class, 'index'])->name('user.product.index');
});

Route::post('/user/checkout', [CheckoutController::class, 'index']);

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::apiResource('/cart', CartController::class);
    Route::get('/counts', [DashboardController::class, 'index']);
    Route::post('category/deleteMany', [CategoryController::class, 'deleteMany']);
    Route::post('product/deleteMany', [ProductController::class, 'deleteMany']);
    Route::post('tag/deleteMany', [TagController::class, 'deleteMany']);
    Route::post('product/uploadImage/{product:id}', [ProductController::class, 'uploadImage']);
    Route::post('product/deleteImage', [ProductController::class, 'deleteImage']);
    Route::apiResource('category', CategoryController::class, [
        'name' => 'category.'
    ]);
    Route::apiResource('product', ProductController::class)->names([
        'index' => 'product.index',
        'show' => 'product.show',
        'store' => 'product.store',
        'update' => 'product.update',
        'destroy' => 'product.destroy',
    ]);

    Route::apiResource('discount', DiscountController::class)->names([
        'index' => 'discount.index',
        'show' => 'discount.show',
        'store' => 'discount.store',
        'update' => 'discount.update',
        'destroy' => 'discount.destroy',
    ]);

    Route::apiResource('attribute', AttributeController::class, [
        'name' => 'attribute.'
    ]);
    Route::apiResource('tag', TagController::class, [
        'name' => 'tag.'
    ]);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);
});
