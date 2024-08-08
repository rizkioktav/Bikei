<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\GoogleAuth;
use App\Models\FacebookAuth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
 {
        $googleUser = Socialite::driver('google')->user();
        $user = $this->_registerOrLoginUser($googleUser, 'google');

        if ($user) {
            $token = JWTAuth::fromUser($user);
            return redirect()->intended('newuser')->with('token', $token);
        }

        return redirect()->route('login');
    }

    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->redirect();
    }

    public function handleFacebookCallback()
    {
        $facebookUser = Socialite::driver('facebook')->user();
        $user = $this->_registerOrLoginUser($facebookUser, 'facebook');

        if ($user) {
            $token = JWTAuth::fromUser($user);
            return redirect()->intended('newuser')->with('token', $token);
        }

        return redirect()->route('login');
    }

    protected function _registerOrLoginUser($data, $provider)
    {
        $user = User::where('email', $data->email)->first();

        if (!$user) {
            $user = User::create([
                'nama' => $data->name,
                'email' => $data->email,
                'password' => bcrypt(Str::random(16)),
            ]);
        }

        if ($provider == 'google') {
            GoogleAuth::updateOrCreate(
                ['google_id' => $data->id],
                ['user_id' => $user->id]
            );
        } elseif ($provider == 'facebook') {
            FacebookAuth::updateOrCreate(
                ['facebook_id' => $data->id],
                ['user_id' => $user->id]
            );
        }

        return $user;
    }
}
