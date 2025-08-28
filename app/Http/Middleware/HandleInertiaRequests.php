<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'can' => $request->user()?->getAllPermissions()->pluck('name'),
                'roles' => $request->user()?->getRoleNames(),
                'notifications' => $request->user()?->notifications()->limit(3)->get(),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'routes' => fn(): array => array_filter([
                ['name' => 'Dashboard', 'url' => route('dashboard')],
                ['name' => 'Profile', 'url' => route('profile.edit')],
                ['name' => 'Notifications', 'url' => route('notifications')],
                $request->user()?->hasRole('admin') ? ['name' => 'User Management', 'url' => route('admin.users.index')] : null,
                $request->user()?->hasRole('admin') ? ['name' => 'Roles and Permissions', 'url' => route('admin.roles-permissions')] : null,
                // $request->user()?->hasRole('admin') ? ['name' => 'roles', 'url' => route('admin.roles')] : null,
            ]),
        ];
    }
}
