<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\admin\RBACController;
use App\Http\Controllers\ChangelogController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Socialite\ProviderCallbackController;
use App\Http\Controllers\Socialite\ProviderRedirectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// use Spatie\Permission\Models\Role;
// $role = Role::create(['name' => 'admin']);
// $role = Role::create(['name' => 'user']); 

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home')->middleware('pinger');
// // Changelog 
Route::get('/changelog', [ChangelogController::class, 'index'])->name('changelog')->middleware('pinger');
Route::get('/privacy', [LegalController::class, 'privacy'])->name('privacy')->middleware('pinger');
Route::get('/terms', [LegalController::class, 'terms'])->name('terms')->middleware('pinger');


Route::middleware(['auth', 'verified', 'pinger'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->middleware('auth');
    // Mark specific notification as read
    Route::post('/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead'])->middleware('auth');
    // Mark specific notification as unread
    Route::post('/notifications/{id}/mark-unread', [NotificationController::class, 'markAsUnread'])->middleware('auth');
});

if (config('features.rbac')) {
    Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
        Route::get('/admin', function () {
            return redirect()->route('admin.dashboard');
        })->name('admin.index');
        Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::get('admin/users', [AdminDashboardController::class, 'users'])->name('admin.users.index');
        Route::get('admin/users/{user}', [AdminDashboardController::class, 'showUser'])->name('admin.users.show');
        Route::put('admin/users/{user}', [AdminDashboardController::class, 'updateUser'])->name('admin.users.update');
        Route::delete('admin/users/{user}', [AdminDashboardController::class, 'deleteUser'])->name('admin.users.destroy');
        Route::post('admin/users/{user}/assign-role', [AdminDashboardController::class, 'assignRole'])->name('admin.users.assign-role');
        Route::post('admin/users/{user}/ban', [AdminDashboardController::class, 'banUser'])->name('admin.users.ban');
        Route::post('admin/users/{user}/unban', [AdminDashboardController::class, 'unbanUser'])->name('admin.users.unban');
        Route::get('admin/roles-permissions', [RBACController::class, 'index'])->name('admin.roles-permissions');
        Route::post('admin/roles', [RBACController::class, 'store'])->name('admin.roles.store');
        Route::put('admin/roles/{role}', [RBACController::class, 'update'])->name('admin.roles.update');
        Route::delete('admin/roles/{role}', [RBACController::class, 'destroy'])->name('admin.roles.destroy');
        Route::post('admin/permissions', [RBACController::class, 'storePermission'])->name('admin.permissions.store');
        Route::put('admin/permissions/{permission}', [RBACController::class, 'updatePermission'])->name('admin.permissions.update');
        Route::delete('admin/permissions/{permission}', [RBACController::class, 'destroyPermission'])->name('admin.permissions.destroy');
    });
}
// OAuth routes
Route::get('/auth/{provider}/redirect', ProviderRedirectController::class)->name('auth.redirect')->middleware(['throttle:5,1']);
Route::get('/auth/{provider}/callback', ProviderCallbackController::class)->name('auth.callback')->middleware(['throttle:5,1']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
