<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Cache;
use App\Models\Setting;

class SettingsHelper
{
    protected static $settings;

    public static function getSettings()
    {
        if (is_null(self::$settings)) {
            self::$settings = Cache::remember('settings', 24 * 60, function () {
                return Setting::pluck('value', 'key')->toArray();
            });
        }

        return self::$settings;
    }
}
