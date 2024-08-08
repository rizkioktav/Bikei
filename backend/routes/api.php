<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\NotifController;

// Route untuk register dan login dengan JWT Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route untuk logout (menggunakan middleware auth:api)
Route::middleware(['auth:api'])->group(function() {
    Route::get('/user', [AuthController::class,'getUser']);
    Route::get('/user/status', [UserController::class, 'checkUserStatus']);

    Route::get('/companies', [CompanyController::class, 'getAllCompaniesWithOwners']);
    Route::get('/user/companies', [CompanyController::class, 'getUserCompanies']);
    Route::post('/company/create', [CompanyController::class, 'createCompany']);
    Route::post('/company/join', [CompanyController::class, 'joinCompany']);
    Route::post('/company/{id_company}/transfer-ownership', [CompanyController::class, 'transferOwnership']);
    Route::put('/company/edit', [CompanyController::class, 'updateCompany']);
    Route::get('/company/{id_company}/members', [CompanyController::class, 'getCompanyMembers']);
    Route::get('/user/company/{id}', [CompanyController::class, 'getCompanyById']);

    Route::post('/company/{id_company}/invite', [CompanyController::class, 'inviteUser']);
    Route::post('/company/generate-token/{id}', [CompanyController::class, 'generateTokenForCompany']);
    Route::get('/company/tokens/{id}', [CompanyController::class, 'getTokens']);
    Route::post('/company/join-by-token', [CompanyController::class, 'joinByToken']);

    Route::get('/company/notifications', [NotifController::class, 'getNotifications']);
    Route::delete('/company/notifications/{id}', [NotifController::class, 'deleteNotification']);
    Route::post('/company/notifications/respond-invitation', [NotifController::class, 'respondToInvitation']);
    Route::post('/company/notifications/respond-to-join', [NotifController::class, 'respondToJoinRequest']);

    Route::post('/logout', [AuthController::class, 'logout']);
});

