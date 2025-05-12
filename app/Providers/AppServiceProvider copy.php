<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

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
        //
        // if (env('APP_ENV') === 'local') {
        //     URL::forceScheme('https');
        // }
        // Di AppServiceProvider.php (method boot())
        // if (env('APP_ENV') === 'production' || strpos(env('APP_URL'), 'https://') !== false) {
        //     URL::forceScheme('https');
        // }
                // Force HTTPS in production or when APP_URL contains https://
                if ($this->app->environment('production') || 
                strpos(config('app.url'), 'https://') !== false) {
                URL::forceScheme('https');
            }
    }
}
