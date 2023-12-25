<?php

namespace App\Interfaces\Admin;

use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;

interface ProductInterface
{
    public function createOptions(Product $product,array $attributes,array $varients);
}
