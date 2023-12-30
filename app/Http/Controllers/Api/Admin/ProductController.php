<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Http\Traits\ApiResponse;
use App\Interfaces\Admin\ProductInterface;
use App\Models\Attribute;
use App\Models\Product;
use App\Models\Varient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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

        if (!$request->file('images'))
            return response()->nocontent();

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

        return $this->successResponse(message: 'Products and associated images deleted successfully');
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
        $this->authorize('read-products');

        $validColumns = DB::getSchemaBuilder()->getColumnListing('products');

        $sort = in_array(request('sort'), $validColumns) ? request('sort') : 'products.id';
        $search = request('search');

        $products = Product::with(['media', 'tags', 'category'])
            ->when(!empty($search), function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'LIKE', "%$search%")
                        ->orWhere('description', 'LIKE', "%$search%")
                        ->orWhere('small_description', 'LIKE', "%$search%");
                });
            })
            ->when(!empty(request('hasVarients')), function ($query) {
                request('hasVarients') == 'yes' ?
                    $query->join(
                        DB::raw('(SELECT DISTINCT product_id FROM product_attribute) as pa'),
                        'pa.product_id',
                        '=',
                        'products.id'
                    ) : $query->leftJoin(
                        DB::raw('(SELECT DISTINCT product_id FROM product_attribute) as pa'),
                        'pa.product_id',
                        '=',
                        'products.id'
                    )->whereRaw('pa.product_id IS NULL');
            })
            ->orderBy($sort, $sort == 'desc' ? 'desc' : 'asc')
            ->distinct()
            ->paginate(10);


        return ProductResource::collection($products);
    }

    public function store(CreateProductRequest $createProductRequest)
    {
        $validatedData = $createProductRequest->validated();
        unset($validatedData['images'], $validatedData['tags'], $validatedData['attributes']);

        $product = Product::create($validatedData);
        $product->save();
        $product->tags()->sync($createProductRequest->tags);
        $images = $createProductRequest->file('images');
        if ($images && is_array($images)) {
            foreach ($images as $imageFile) {
                $product->addMedia($imageFile)
                    ->toMediaCollection('images', 'public');
            }
        }

        if ($createProductRequest->has('attributes') && $createProductRequest->has('varients')) {
            $varients = $createProductRequest->get('varients');
            $attributes = $createProductRequest->get('attributes');
            $this->syncProductOptions($product, $attributes, $varients);
        }

        return $this->successResponse(message: 'Product created successfully');
    }

    private function syncProductOptions(Product $product, array $attributes, array $variants)
    {
        $createdAttributes = [];
        $createdVariants = [];

        foreach ($attributes as $attributeData) {
            $attribute = Attribute::updateOrCreate([
                'name' => $attributeData,
            ]);
            $createdAttributes[$attribute->name] = $attribute->id;
        }

        $product->attributes()->sync(array_values($createdAttributes));

        foreach ($variants as $variantData) {
            Log::info($variantData);
            $variant = Varient::create([
                'price' => $variantData['price'],
                'quantity' => $variantData['quantity'],
                'product_id' => $product->getKey(),
            ]);
            $createdVariants[] = $variant;

            foreach ($variantData['options'] as $option) {
                $attributeId = $createdAttributes[$option['name']];

                $variant->attributes()->attach($attributeId, [
                    'value' => $option['value'],
                ]);
            }
        }
    }

    public function show(int $id)
    {
        $product = Product::with('media', 'tags:id,name', 'category:id,name', 'discounts')->findOrFail($id);
        $product->load('attributes', 'attributes.options', 'varients', 'varients.attributes');
        return ProductResource::make($product);
    }

    public function update(Product $product, UpdateProductRequest $updateProductRequest)
    {
        DB::beginTransaction();

        try {
            $validatedData = $updateProductRequest->validated();

            unset($validatedData['images'], $validatedData['tags'], $validatedData['attributes']);

            $product->update($validatedData);

            $product->tags()->sync($updateProductRequest->tags);

            if ($updateProductRequest->has('attributes') && $updateProductRequest->has('varients')) {
                $product->varients()->delete();
                $varients = $updateProductRequest->get('varients');
                $attributes = $updateProductRequest->get('attributes');
                $this->syncProductOptions($product, $attributes, $varients);
            }

            DB::commit();

            return $this->successResponse(message: 'Product updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, Product $Product)
    {
        $this->authorize('delete-products');
        $Product->delete();
        return $this->successResponse(message: 'Product deleted successfully');
    }
}
