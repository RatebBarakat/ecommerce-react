<?php

namespace App\Http\Resources;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images = [];
        $media = $this->getMedia('images');

        foreach ($media as $image) {
            $images[] = [
                'id' => $image->id,
                'url' => asset($image->getUrl()),
            ];
        }


        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'small_description' => $this->small_description,
            (!$request->routeIs('product.index')) ?? 'description' => $this->description,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'images' => $images ? ($request->routeIs('product.index') ?
                $images[0] : $images) : null,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name
                ];
            }),
            'tags' => $this->whenLoaded('tags', function () use ($request) {
                return $request->routeIs('product.index') ? implode(',', $this->tags->pluck('name')->toArray()) : TagResource::collection($this->tags);
            }),
            'discounts' => $this->whenLoaded('discounts', function () use ($request) {
                return DiscountResource::collection($this->discounts);
            }),
        ];
    }
}
