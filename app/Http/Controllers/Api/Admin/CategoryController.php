<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Traits\ApiResponse;
use App\Models\Category;
use App\Observers\CategoryObserver;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    use ApiResponse;

    public function deleteMany(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id'
        ]);

        Category::query()->whereIn('id', $request->ids)->delete();
        Cache::forget('categories');
        return $this->successResponse(message: 'categories deleted successfully');
    }
    
    public function index()
    {
        $this->authorize('read-categories');
        $validColumns = DB::getSchemaBuilder()->getColumnListing('categories');

        $sort = in_array(request('sort'), $validColumns) ? request('sort') : 'id';
        $search = request('search');
        return CategoryResource::collection(
            request()->get('type') === "all" ?
                Cache::remember('categories', Carbon::now()->addDay(), function () use($sort) {
                    return Category::orderBy('id', 'desc')
                    ->get(['id', 'name']);
                })
                : Category::orderBy($sort, $sort == 'id' ? 'desc' : 'asc')
                    ->when(!empty($search),function ($query) use ($search) {
                        $query->where('name','LIKE',"%$search%");
                    })
                    ->paginate(10)
        );
    }

    public function store(CreateCategoryRequest $createCategoryRequest)
    {
        Category::create($createCategoryRequest->validated());
        return $this->successResponse(message: 'category created successfully');
    }

    public function show(int $id)
    {
        $category = Category::findOrFail($id);
        return CategoryResource::make($category);
    }

    public function update(UpdateCategoryRequest $updateCategoryRequest)
    {
        Category::findOrFail($updateCategoryRequest->input('id'))
            ->update($updateCategoryRequest->validated());
        return $this->successResponse(message: 'category updated successfully');
    }

    public function destroy(Request $request, Category $category)
    {
        $this->authorize('delete-categories');
        $category->delete();
        return $this->successResponse(message: 'category deleted successfully');
    }
}
