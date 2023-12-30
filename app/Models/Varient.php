<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Varient extends Model
{
    use HasFactory;
    
    protected $guarded = [];

    public function attributes() {
        return $this->belongsToMany(Attribute::class,'varient_attribute')->withPivot('attribute_id','value');
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
