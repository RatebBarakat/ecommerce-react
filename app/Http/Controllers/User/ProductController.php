<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('media', 'tags:id,name', 'category:id,name', 'discounts')->inRandomOrder()->paginate(50);
        return ProductResource::collection($products);
    }
}
