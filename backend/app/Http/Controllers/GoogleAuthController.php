<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\GoogleAuth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        // Arahkan pengguna ke Google untuk login
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $googleAuth = GoogleAuth::where('google_id', $googleUser->id)->first();

            if ($googleAuth) {
                $user = $googleAuth->user;
            } else {
                $user = User::create([
                    'email' => $googleUser->email,
                    'nama' => $googleUser->name,
                    'password' => bcrypt(Str::random(16)),
                ]);

                GoogleAuth::create([
                    'user_id' => $user->id,
                    'google_id' => $googleUser->id,
                ]);
            }

            Auth::login($user);

            $token = JWTAuth::fromUser($user);
            
            return redirect()->to('http://localhost:4200/auth/google/callback?token=' . $token);
            // return response()->json([
            //     'message' => 'Berhasil Login',
            //     'access_token' => $token,
            //     'token_type' => 'Bearer'
            // ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unable to login',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}

