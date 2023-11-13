<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! app()->isProduction());
        DB::listen(function ($query) {
            $sql = $query->sql;
            $bindings = $query->bindings;        
            $time = $query->time;
            Log::info("Query: $sql" . "Bindings: " . json_encode($bindings) . "Time: $time ms");
        });
    }
}
