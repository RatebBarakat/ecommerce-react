<?php

namespace App\Observers;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CategoryObserver
{
    /**
     * Handle the Category "created" event.
     */

    protected function deleteCached() {
        Cache::forget("categories");
    }
    public function created(Category $Category): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Category "updated" event.
     */
    public function updated(Category $Category): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Category "deleted" event.
     */
    public function deleted(Category $Category): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Category "restored" event.
     */
    public function restored(Category $Category): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Category "force deleted" event.
     */
    public function forceDeleted(Category $Category): void
    {
        $this->deleteCached();
    }
}
