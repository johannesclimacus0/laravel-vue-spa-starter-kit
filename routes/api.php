<?php

use App\Http\Controllers\Api\CurrentUserController;
use App\Http\Controllers\Api\Settings\PreferencesController;
use App\Http\Controllers\Api\Settings\SecurityController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', CurrentUserController::class)->name('api.v1.user');

    Route::get('/settings/security', SecurityController::class)
        ->middleware('verified')
        ->name('api.v1.settings.security');

    Route::get('/settings/preferences', [PreferencesController::class, 'show'])
        ->middleware('verified')
        ->name('api.v1.settings.preferences.show');

    Route::put('/settings/preferences', [PreferencesController::class, 'update'])
        ->middleware('verified')
        ->name('api.v1.settings.preferences.update');
});
