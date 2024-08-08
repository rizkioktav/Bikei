<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;

Route::get('auth/google', [googleAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [googleAuthController::class, 'handleGoogleCallback']);

