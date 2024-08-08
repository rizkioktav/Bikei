<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Exception;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'googleLogin']]);
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'nama' => 'required|string',
                'email' => 'required|string|email|max:255|unique:users',
                'no_hp' => 'required|string|max:15|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'nama' => $request->nama,
                'email' => $request->email,
                'no_hp' => $request->no_hp,
                'password' => Hash::make($request->password),
            ]);

            return response()->json(['message' => 'User berhasil registrasi'], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Registrasi gagal', 'message' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'login' => 'required|string',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $request->login)
                        ->orWhere('no_hp', $request->login)
                        ->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'login' => ['Anda tidak terdaftar'],
                ]);
            }

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Berhasil Login',
                'access_token' => $token, 
                'token_type' => 'Bearer'
            ]);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Invalid credentials', 'message' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'Login gagal', 'message' => $e->getMessage()], 500);
        }
    }

    public function getUser(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized', 'message' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'User logged out successfully']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to logout, please try again'], 500);
        }
    }
}
