<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductObserver
{
    /**
     * Handle the Product "created" event.
     */

    protected function deleteCached() {
        Cache::forget("products");
    }
    public function created(Product $Product): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $Product): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $Product): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Product "restored" event.
     */
    public function restored(Product $Product): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Product "force deleted" event.
     */
    public function forceDeleted(Product $Product): void
    {
        $this->deleteCached();
    }
}
