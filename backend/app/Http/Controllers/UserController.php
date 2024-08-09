<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\RoleCompany;
use App\Models\User;

class UserController extends Controller
{
    public function getAllUsers()
    {
        try {
            $users = User::all(); // Mendapatkan semua pengguna

            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching users', 'message' => $e->getMessage()], 500);
        }
    }
    public function checkUserStatus()
    {
        $user = Auth::user();

        $roleCompany = RoleCompany::where('id_user', $user->id)->first();

        if ($roleCompany) {
            return response()->json([
                'status' => true,
                'message' => 'Anda sudah bergabung dengan perusahaan.',
                'company' => $roleCompany->company, // Berikan data perusahaan jika diperlukan
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Anda belum bergabung atau mempunyai perusahaan.',
            ]);
        }
    }
}

