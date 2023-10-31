<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Http\Traits\ApiResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;
    private function getTotal($carts)
    {
        $total = 0;
        foreach ($carts as $cart) {
            $total = $cart->product->quantity * $cart->quantity;
        }
        return $total;
    }
    public function index()
    {
        $user = auth()->user();
        $user->load("carts", "carts.product");
        $carts = $user->carts;

        return CartResource::collection(auth()->user()->carts)->additional([
            "total" => $this->getTotal($carts),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $user->carts()->updateOrCreate(
            [
                "product_id" => $request->product_id,
                "user_id" => $user->id,
            ],
            $request->only('quantity')
        );

        return $this->successResponse( message : "cart updated");
    }
}
