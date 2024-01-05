<?php

namespace App\Helpers;

class CurencyHelper
{
    static public function format(float $amount) {
        return '$' . number_format($amount,2);
    }
}
