<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Http\Traits\ApiResponse;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;
    private function getTotal($carts)
    {
        $total = 0;
        foreach ($carts as $cart) {
            $total += $cart->product->price * $cart->quantity;
        }
        return $total;
    }
    public function index()
    {
        $user = auth()->user();
    
        $carts = $user->carts()->with('product','product.media')->get();
    
        return CartResource::collection($carts)->additional([
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

        return $this->successResponse(message: "cart updated");
    }

    public function update(Request $request, Cart $cart)
    {
        $this->authorize("update", $cart);
        $cart->update($request->only("quantity"));
        return $this->successResponse(message: "cart updated successfully");
    }

    public function destroy(Request $request, Cart $cart)
    {
        $user = auth()->user();
        $cart->delete();
        return $this->successResponse(message: "cart item deleted successfully");
    }
}
