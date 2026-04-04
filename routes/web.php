<?php

use App\Http\Controllers\Admin\ChatSessionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\PortfolioController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PortfolioController as PublicPortfolioController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [ContactController::class, 'index'])->name('home');
Route::post('/chat/init', [ChatController::class, 'init'])->name('chat.init');
Route::post('/chat/send', [ChatController::class, 'send'])->name('chat.send');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/portfolio/{portfolio:slug}', [PublicPortfolioController::class, 'show'])->name('portfolio.show');
Route::get('/sitemap.xml', fn() => response(
    view('sitemap', [
        'portfolios' => \App\Models\Portfolio::published()->latest()->get(['id', 'slug', 'updated_at']),
    ]),
    200,
    ['Content-Type' => 'application/xml']
))->name('sitemap');

// Auth
Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Admin routes
Route::prefix('admin')->middleware(['auth', 'admin'])->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Portfolio CRUD
    Route::resource('portfolios', PortfolioController::class)->except(['show']);

    // Services CRUD
    Route::resource('services', ServiceController::class)->except(['show']);

    // Messages
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::patch('/messages/{message}/read', [MessageController::class, 'markRead'])->name('messages.read');
    Route::delete('/messages/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::patch('/profile/info', [ProfileController::class, 'updateInfo'])->name('profile.info');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Chat sessions
    Route::get('/chats', [ChatSessionController::class, 'index'])->name('chats.index');
    Route::get('/chats/{chatSession}', [ChatSessionController::class, 'show'])->name('chats.show');
    Route::delete('/chats/{chatSession}', [ChatSessionController::class, 'destroy'])->name('chats.destroy');
});
