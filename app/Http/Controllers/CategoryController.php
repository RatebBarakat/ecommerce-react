<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(
                Cache::remember('categories', Carbon::now()->addDay(), function () {
                    return Category::orderBy('id', 'desc')
                    ->get(['id', 'name']);
                })
        );
    }
}
