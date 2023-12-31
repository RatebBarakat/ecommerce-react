<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $guarded = [];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function varients() {
        return $this->hasMany(Varient::class);
    }

    public function attributes() {
        return $this->belongsToMany(Attribute::class,'product_attribute');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'tag_taggable', 'product_id', 'tag_id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useDisk('public');
    }

    public function deleteImage($mediaId)
    {
        $media = $this->getMedia('images')->find($mediaId);
        if ($media) {
            $media->delete();
        }
    }

    public function discounts() {
        return $this->hasMany(Discount::class);
    }
}
