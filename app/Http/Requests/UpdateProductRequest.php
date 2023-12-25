<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('update-products');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if (config()->get('settings.is_option_static') == 1) {
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
                'options' => 'required|arrasdksdjksy',
                'options.*.label' => 'required|exists:attributes,name|string|min:2',
                'options.*.value' => 'required|string|min:2',
                'options.*.price' => 'required|numeric|min:0',
            ];
        } else {
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
                'options' => 'nullable|array',
                'options.*.label' => 'required_with:options|string|min:2',
                'options.*.value' => 'required_with:options|string|min:2',
                'options.*.price' => 'required_with:options|numeric|min:0',
            ];
        }
    }
}
