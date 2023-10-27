<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class CreateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('create-products');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:2',
            'slug' => 'required|string|min:2',
            'small_description' => 'required|string|min:20|max:150',
            'description' => 'required|string|min:25|max:2000',
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'required|mimes:jpeg,png,jpg,gif|max:2048', 
            'price' => 'numeric|min:1',
            'quantity' => 'numeric|min:1',
            'category_id' => 'integer|exists:categories,id',
            'tags' => 'required|array',
        ];
    }
}
