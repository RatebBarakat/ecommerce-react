<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Helpers\SettingsHelper;

class SettingsServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $settings = SettingsHelper::getSettings();

        foreach ($settings as $key => $value) {
            config()->set('settings.'.$key, $value);
        }
    }

    public function register()
    {
        //
    }
}
