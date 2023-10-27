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

    public function uploadImage(Request $request, Product $product)
    {
        $imagesCount = $product->getMedia('images')->count();

        $request->validate([
            "images" => 'required|array|min:1|max:5',
        ]);

        if ($imagesCount + count($request->file('images')) > 5) {
            return response()->json([
                'message' => 'You cannot upload more than 5 images',
            ], 422);
        }

        $uploadedImages = [];

        if(!$request->file('images')) return response()->nocontent();

        foreach ($request->file('images') as $file) {
            $media = $product->addMedia($file)->toMediaCollection('images');
            $uploadedImages[] = [
                'id' => $media->id,
                'url' => $media->getUrl(),
            ];
        }

        return response()->json(['images' => $uploadedImages]);
    }

    public function deleteMany(Request $request)
    {
        $request->validate([
            'ids' => 'array',
            'ids.*' => 'exists:products,id'
        ]);
    
        $products = Product::whereIn('id', $request->ids)->get();
    
        foreach ($products as $product) {
            $media = $product->getMedia('images');
            foreach ($media as $image) {
                $image->delete();
            }
        }
    
        Product::query()->whereIn('id', $request->ids)->delete();
    
        return $this->successResponse(message : 'Products and associated images deleted successfully');
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
        unset($validatedData['images'],$validatedData['tags']);
        
        $product = Product::create($validatedData);

        $product->tags()->sync($createProductRequest->tags);

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
        DB::beginTransaction();

        try {
            $validatedData = $updateProductRequest->validated();

            unset($validatedData['images'],$validatedData['tags']);

            $product->update($validatedData);

            $product->tags()->sync($updateProductRequest->tags);

            DB::commit();

            return $this->successResponse(message : 'Product updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => $e->getMessage()], 500);
        }
    }



    public function destroy(Request $request, Product $Product)
    {
        abort_if(Gate::denies('delete-products'), 403);
        $Product->delete();
        return $this->successResponse(message: 'Product deleted successfully');
    }
}
