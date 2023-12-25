<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
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
            'description' => $request->routeIs('product.index') ? null : $this->description,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'images' => $images ? ($request->routeIs('product.index') ? $images[0] : $images) : null,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name
                ];
            }),
            'tags' => $this->whenLoaded('tags', function () use ($request) {
                return $request->routeIs('product.index') ? implode(',', $this->tags->pluck('name')->toArray()) : TagResource::collection($this->tags);
            }),
            'discounts' => $this->whenLoaded('discounts', function () {
                return DiscountResource::collection($this->discounts);
            }),
            'attributes' => $this->whenLoaded('attributes', function () {
                return AttributeResourse::collection($this->attributes);
            }),
            'varients' => $this->whenLoaded('varients', function () {
                return [$this->formatVarients($this->varients)];
            }),
        ];
    }

    private function formatVarients($varients)
    {
        foreach ($varients as $varient) {
            $options = [];

            foreach ($varient->attributes as $attribute) {
                $attributeValue = $attribute->pivot->value;
                $attributeName = $this->attributes->filter(function ($attribute) {
                    return $attribute->where('attribute_id', $attribute->attribute_id);
                })->toArray()[0]['name'];

                $options[] = [
                    'name' => $attributeName,
                    'value' => $attributeValue
                ];
            }

            return [
                'price' => $varient->price,
                'quantity' => $varient->quantity,
                'options' => $options
            ];
        }
    }
}
