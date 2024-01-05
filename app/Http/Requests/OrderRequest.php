<?php

namespace App\Http\Requests;

use App\Models\Product;
use App\Models\Varient;
use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|numeric|min:1',
            'products.*.varient' => [
                'nullable',
                'array',
                'min:1'
            ],
            'products.*.varient.id' => 'required_with:products.*.varient|exists:varients',
            'products.*.varient.quantity' => 'required_with:products.*.varient|numeric|min:1',
            'firstname' => 'required|string|min:2',
            'lastname' => 'required|string|min:2',
            'shipping_address' => 'required|string|min:2',
            'billing_address' => 'required|string|min:2',
        ];
    }
}
