<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Tag;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(){
        return response()->json([
            'categories' => Category::count(),
            'products' => Product::count(),
            'tags' => Tag::count(),
        ]);
    }
}
