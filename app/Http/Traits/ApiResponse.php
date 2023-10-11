<?php 

namespace App\Http\Traits;

trait ApiResponse 
{
    public function successResponse($data = [],$message = "") {
        $data = [
            ...$data,
            ['message' => $message]
        ];
        return response()->json($data,200);
    }
}
