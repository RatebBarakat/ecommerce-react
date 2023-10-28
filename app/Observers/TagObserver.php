<?php

namespace App\Observers;

use App\Models\Tag;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TagObserver
{
    /**
     * Handle the Tag "created" event.
     */

    protected function deleteCached() {
        Cache::forget("tags");
        Log::info("cached tags deleted");
    }
    public function created(Tag $tag): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Tag "updated" event.
     */
    public function updated(Tag $tag): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Tag "deleted" event.
     */
    public function deleted(Tag $tag): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Tag "restored" event.
     */
    public function restored(Tag $tag): void
    {
        $this->deleteCached();
    }

    /**
     * Handle the Tag "force deleted" event.
     */
    public function forceDeleted(Tag $tag): void
    {
        $this->deleteCached();
    }
}
