<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponse;
use App\Models\Discount;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    use ApiResponse;
    public function store(Request $request)
    {
        $request->validate([
            "discount" => "required|integer",
            "type" => "required|min:2",
            "start_date" => "required|date|after:now",
            "end_date" => "required|date|after:start_date",
            "product_id" => 'required|integer|exists:products,id'
        ]);

        $discount = Discount::create([
            "discount" => request("discount"),
            "type" => request("type"),
            "start_date" => request("start_date"),
            "end_date" => request("end_date"),
            "product_id" => request("product_id"),
        ]);

        return response()->json(['discount' => $discount]);
    }

    public function update(Request $request, Discount $discount){
        $request->validate([
            "discount" => "required|integer",
            "type" => "required|min:2",
            "start_date" => "required|date|after:now",
            "end_date" => "required|date|after:start_date",
            "product_id" => 'required|integer|exists:products,id'
        ]);

        $discount->update([
            'discount'=> request('discount'),
            'type'=> request('type'),
            'start_date'=> request('start_date'),
            'end_date'=> request('end_date'),
        ]);

        return response()->json(['discount'=> $discount]);
    }

    public function destroy(Request $request, Discount $discount){
        $discount->delete();
        return $this->successResponse(message:'discount deleted successfully');
    }
}
