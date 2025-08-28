<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Http;

class pinger
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, \Closure $next)
    {
        $ip = $request->ip();

        // Check if IP already logged
        $exists = DB::table('seen_ips')->where('ip', $ip)->exists();

        if (!$exists) {
            // Save new IP
            DB::table('seen_ips')->insert([
                'ip' => $ip,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Send Telegram alert
            $message = "New IP Detected!\n" .
                "🌐 IP: $ip\n" .
                "🔗 URL: " . $request->fullUrl() . "\n" .
                "🖥 Agent: " . $request->header('User-Agent');

            Http::post("https://api.telegram.org/bot" . config('services.telegram.bot_token') . "/sendMessage", [
                'chat_id' => config('services.telegram.chat_id'),
                'text' => $message,
            ]);
        }

        return $next($request);
    }
}
