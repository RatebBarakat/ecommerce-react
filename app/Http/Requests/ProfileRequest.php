<?php

namespace App\Http\Requests;

use Closure;
use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
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
            'postal_code' => 'nullable|numeric|digits:4',
            'country' => 'nullable|string|min:2',
            'state' => 'nullable|string|min:2',
            'city' => 'nullable|string|min:2',
            'address' => 'nullable|string|min:2',
            'phone' => 'nullable|required|numeric|digits:8',
            'avatar' => 'nullable|image'
        ];
    }
}
