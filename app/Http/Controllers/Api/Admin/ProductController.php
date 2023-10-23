<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Http\Traits\ApiResponse;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use ApiResponse;

    public function deleteMany(Request $request)
    {
        $request->validate([
            'ids' => 'array',
            'ids.*' => 'exists:products,id'
        ]);

        Product::query()->whereIn('id', $request->ids)->delete();
        return $this->successResponse(message: 'products deleted successfully');
    }

    public function deleteImage(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:products,id',
            'image_id' => 'required|integer',
        ]);

        $product = Product::findOrFail($request->id);
        $image = $product->getMedia('images')->find($request->image_id);
        if ($image) {
            $image->delete();
        }
    }
    public function index()
    {
        if (Gate::denies("read-products")) abort(403, 'you cannt read products');
        return ProductResource::collection(Product::orderBy('id', 'desc')->paginate(10));
    }

    public function store(CreateProductRequest $createProductRequest)
    {
        $validatedData = $createProductRequest->validated();
        if ($validatedData['images']) unset($validatedData['images']);

        $product = Product::create($validatedData);

        $images = $createProductRequest->file('images');

        if ($images && is_array($images)) {
            foreach ($images as $imageFile) {
                $product->addMedia($imageFile)
                    ->toMediaCollection('images', 'public');
            }
        }

        return $this->successResponse(message: 'Product created successfully');
    }


    public function show(int $id)
    {
        $Product = Product::findOrFail($id);
        return ProductResource::make($Product);
    }

    public function update(Product $product, UpdateProductRequest $updateProductRequest)
    {
        DB::enableQueryLog();
        $validatedData = $updateProductRequest->validated();

        unset($validatedData['images']);
        
        $product->update($validatedData);

        $images = $updateProductRequest->file('images');
        if ($images && is_array($images)) {
            foreach ($images as $imageFile) {
                if (is_file($imageFile)) $product->addMedia($imageFile)->toMediaCollection('images');
            }
        }

        return $this->successResponse([DB::getQueryLog()], 'Product updated successfully');
    }


    public function destroy(Request $request, Product $Product)
    {
        abort_if(Gate::denies('delete-products'), 403);
        $Product->delete();
        return $this->successResponse(message: 'Product deleted successfully');
    }
}
