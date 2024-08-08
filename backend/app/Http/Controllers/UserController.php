<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\RoleCompany;

class UserController extends Controller
{
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

