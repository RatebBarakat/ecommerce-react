<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Traits\ApiResponse;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    use ApiResponse;
    public function index()
    {
        if (Gate::denies("read-categories")) abort(403,'you cannt read categories');
        return CategoryResource::collection(Category::paginate(10));
    }

    public function store(CreateCategoryRequest $createCategoryRequest)
    {
        Category::create($createCategoryRequest->validated());
        return $this->successResponse(message : 'category created successfully');
    }

    public function show(int $id){
        $category = Category::findOrFail($id);
        return CategoryResource::make($category);
    }

    public function update(UpdateCategoryRequest $updateCategoryRequest)
    {
        Category::findOrFail($updateCategoryRequest->input('id'))
            ->update($updateCategoryRequest->validated());
            return $this->successResponse(message : 'category updated successfully');
    }

    public function destroy(Request $request,Category $category) {
        abort_if(Gate::denies('delete-categories'),403);
        $category->delete();
        return $this->successResponse(message : 'category deleted successfully');
    }
}
