<?php

namespace App\Http\Controllers;

use App\Http\Requests\TagRequest;
use App\Http\Resources\TagResource;
use App\Http\Traits\ApiResponse;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TagController extends Controller
{
    use ApiResponse;

    public function deleteMany(Request $request)
    {
        $this->authorize("delete-tags");

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tags,id'
        ]);

        Tag::query()->whereIn('id', $request->ids)->delete();
        Cache::forget('tags');
        return $this->successResponse(message: 'tags deleted successfully');
    }
    public function index()
    {
        $this->authorize("read-tags");

        $validColumns = DB::getSchemaBuilder()->getColumnListing('tags');

        $sort = in_array(request('sort'), $validColumns) ? request('sort') : 'id';

        return TagResource::collection(
            request()->get('type') === "all" ?
                Cache::remember('tags', Carbon::now()->addDay(), function () {
                    return Tag::orderBy('id', 'desc')->get(['id', 'name']);
                })
                : Tag::orderBy($sort, $sort == 'id' ? 'desc' : 'asc')->paginate(10)
        );
    }

    public function store(TagRequest $tagRequest)
    {
        $this->authorize("create-tags");
        Tag::create($tagRequest->validated());
        return $this->successResponse(message: "tag created successfully");
    }

    public function show(Tag $tag)
    {
        $this->authorize("read-tags");
        return TagResource::make($tag);
    }

    public function update(TagRequest $tagRequest, Tag $tag)
    {
        $this->authorize("update-tags");
        $tag->update($tagRequest->validated());
        return $this->successResponse(message: "tag updated successfully");
    }

    public function destroy(Tag $tag)
    {
        $this->authorize("delete-tags");
        $tag->delete();
        return $this->successResponse(message: "tag deleted successfully");
    }
}
