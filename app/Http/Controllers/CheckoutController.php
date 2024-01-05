<?php

namespace App\Http\Controllers;

use App\Exceptions\OptionRequiredException;
use App\Helpers\CheckoutHelper;
use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Models\Varient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use NumberFormatter;

class CheckoutController extends Controller
{
    public function index(OrderRequest $orderRequest)
    {
        $checkoutHelper = new CheckoutHelper();
        $orderItems = [];

        foreach ($orderRequest->get('products') as $product) {
            $isOption = isset($product['variant']);
            $id = $isOption ? $product['variant']['id'] : $product['id'];
            $quantity = $isOption ? $product['variant']['quantity'] : $product['quantity'];
            $orderItems = [];
            $checkoutHelper->scan($id, $isOption, $quantity,$orderItems);
        }

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => 1,
                'total' => $checkoutHelper->getTotal(),
                'status' => 'processing',
                'payment_method' => 'cashe-on-delivery'
            ]);

            $order->products()->createMany($orderItems);

            $order->addresses()->create([
                'country' => 'lebanon',
                'address' => $orderRequest->get('shipping_address'),
                'type' => 'shipping_address',
                'order_id' => $order->getKey()
            ]);

            $order->addresses()->create([
                'country' => 'lebanon',
                'address' => $orderRequest->get('billing_address'),
                'type' => 'billing_address',
                'order_id' => $order->getKey()
            ]);

            DB::commit();

            return response()->json(['total' => $checkoutHelper->getTotal(), 'message' => 'order created successfully']);
        } catch (\Exception $e) {
            if ($e instanceof OptionRequiredException) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
            DB::rollback();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
