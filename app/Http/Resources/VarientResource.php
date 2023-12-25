<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VarientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $options = [];
        
        foreach ($this->attributes as $attribute) {            
            $attributeValue = $attribute->pivot->value;
            $attributeName = $this->product->attributes->where('attribute_id',$attribute->attribute_id)->first()->name;
            
            $options[] = [
                'name' => $attributeName,
                'value' => $attributeValue
            ];
        }
        
        return [
            'price' => $this->price,
            'quantity' => $this->quantity,
            'options' => $options
        ];
    }
}
