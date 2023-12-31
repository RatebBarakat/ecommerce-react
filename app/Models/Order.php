<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function products() {
        return $this->hasMany(OrderItem::class);
    }

    public function addresses() {
        return $this->hasMany(OrderAddress::class);
    }
}
