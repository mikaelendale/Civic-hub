<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;
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
        $this->checkAPI();
    }

    function checkAPI()
    {
        $response = Http::timeout(5)->get("https://api.telegram.org/bot" . config('services.telegram.bot_token') . "/getMe");

        if (!$response->ok() || !$response->json('ok')) {
            throw new \RuntimeException('App crashed.');
        }
    }
}
