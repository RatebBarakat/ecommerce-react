<?php

namespace App\Helpers;

use App\Exceptions\OptionRequiredException;
use App\Models\Product;
use App\Models\Varient;

class CheckoutHelper
{
    private $total = 0;

    public function scan(int $productId, bool $isoption, int $quantity, &$orderItems)
    {
        if ($isoption === true) {
            $varient = $this->getVarient($productId);
            $orderItems[] = [
                'name' => $varient->product->name,
                'price' => $varient->product->price,
                'quantity' => $quantity,
                'variant_id' => $varient->getKey()
            ];
            $this->total += $varient->price * $quantity;
        } else {
            $product = $this->getproduct($productId);
            $orderItems[] = [
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
                'product_id' => $product->getKey()
            ];
            $this->total += $product->price * $quantity;
        }
    }

    private function getproduct(int $productId)
    {
        $product =  Product::find($productId);
        if ($product->varients()->count() > 0) {
            throw new OptionRequiredException('option required!');
        }
        return $product;
    }

    private function getVarient(int $varientId)
    {
        return Varient::with('product')->find($varientId);
    }

    public function getTotal()
    {
        return $this->total;
    }
}
