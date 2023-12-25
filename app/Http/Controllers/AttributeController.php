<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponse;
use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    use ApiResponse;
    public function index() {
        $attributes = Attribute::get();
        return $this->successResponse([
            'is_static' => (bool) config()->get('settings.is_option_static'),
            'attributes' => config()->get('settings.is_option_static') == 1 ? $attributes : null,
        ]);
    }
}
