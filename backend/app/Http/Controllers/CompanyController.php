<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\ProfileCompany;
use App\Models\RoleCompany;
use App\Models\MasterRole;
use App\Models\User;
use App\Models\CompanyToken;
use App\Models\CompanyNotification;
use Illuminate\Support\Str;


class CompanyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    //New Company API
    public function createCompany(Request $request)
    {
        $user = Auth::user();

        // Validasi input
        $request->validate([
            'c_nama'    => 'required|string|max:255',
            'c_alamat'  => 'nullable|string',
            'c_no_hp'   => 'nullable|string|max:20',
            'c_email'   => 'nullable|email|unique:master_company,c_email'
        ]);

        // Buat perusahaan baru
        $company = ProfileCompany::create([
            'c_nama'    => $request->c_nama,
            'c_alamat'  => $request->c_alamat,
            'c_no_hp'   => $request->c_no_hp,
            'c_email'   => $request->c_email
        ]);

        // Dapatkan role owner dari tabel master_role
        $ownerRole = MasterRole::where('role', 'business owner')->first();

        if (!$ownerRole) {
            return response()->json([
                'success' => false,
                'message' => 'Role owner not found'
            ], 404);
        }

        // Tetapkan pengguna sebagai pemilik di tabel company_role
        RoleCompany::create([
            'id_company' => $company->id,
            'id_user'    => $user->id,
            'id_role'    => $ownerRole->id
        ]);

        return response()->json([
            'success' => true,
            'company' => $company,
            'role'    => $ownerRole,
        ], 201);
    }

    //Inner Company API
    public function getUserCompanies()
    {
        $user = Auth::user();
        $companies = RoleCompany::with(['company', 'user', 'role'])
            ->where('id_user', $user->id)
            ->get()
            ->map(function($roleCompany) {
                $company = $roleCompany->company;

                $totalMembers = RoleCompany::where('id_company', $company->id)
                    ->count();

                $members = RoleCompany::where('id_company', $company->id)
                    ->with(['user.profile'])
                    ->get()
                    ->map(function($roleCompany) {
                        return $roleCompany->user;
                    });

                return [
                    'company' => [
                        'id' => $company->id,
                        'c_nama' => $company->c_nama,
                        'c_alamat' => $company->c_alamat,
                        'c_no_hp' => $company->c_no_hp,
                        'c_email' => $company->c_email,
                    ],
                    'role' => $roleCompany->role,
                    'members' => $members,
                    'total_members' => $totalMembers
                ];
            });

        return response()->json([
            'success' => true,
            'companies' => $companies
        ], 200);
    }
    public function transferOwnership(Request $request, $id_company)
    {
        $request->validate([
            'target_identifier' => 'required',
            'new_id_role' => 'required|exists:master_role,id',
        ]);
    
        $user = Auth::user();
        $companyId = $id_company;  // Menggunakan id_company dari parameter route
        $targetIdentifier = $request->target_identifier; 
        $newRoleId = $request->new_id_role;
    
        // Pastikan user adalah business owner dari perusahaan yang dimaksud
        $currentOwnerRole = RoleCompany::where('id_company', $companyId)
                                        ->where('id_user', $user->id)
                                        ->whereHas('role', function ($query) {
                                            $query->where('role', 'business owner');
                                        })
                                        ->first();
    
        if (!$currentOwnerRole) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan business owner dari perusahaan ini.',
            ], 403);
        }
    
        // Cari user target berdasarkan email atau no_hp
        $targetUser = User::where('email', $targetIdentifier)
                          ->orWhere('no_hp', $targetIdentifier)
                          ->first();
    
        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan, coba input email atau nomor handphone yang valid.',
            ], 404);
        }
    
        // Pastikan user target adalah anggota company yang dituju
        $targetUserRole = RoleCompany::where('id_company', $companyId)
                                    ->where('id_user', $targetUser->id)
                                    ->first();
    
        if (!$targetUserRole) {
            return response()->json([
                'success' => false,
                'message' => 'User bukan anggota dari company ini.',
            ], 404);
        }
    
        // Update role user target jadi business owner
        $businessOwnerRoleId = MasterRole::where('role', 'business owner')->first()->id;
    
        DB::transaction(function () use ($targetUserRole, $businessOwnerRoleId, $currentOwnerRole, $newRoleId) {
            $targetUserRole->update([
                'id_role' => $businessOwnerRoleId
            ]);
    
            // Update peran current user ke peran baru
            $currentOwnerRole->update([
                'id_role' => $newRoleId
            ]);
        });
    
        return response()->json([
            'success' => true,
            'message' => 'Pemberian Ownership berhasil!',
        ], 200);
    } 
    public function updateCompany(Request $request)
    {
        $user = Auth::user();
    
        $request->validate([
            'c_nama'    => 'required|string|max:255',
            'c_alamat'  => 'nullable|string',
            'c_no_hp'   => 'nullable|string|max:20',
            'c_email'   => 'nullable|email|unique:master_company,c_email'
        ]);
    
        // Dapatkan roleCompany dari tabel role_company berdasarkan id_user dan role 'business owner'
        $roleCompany = RoleCompany::where('id_user', $user->id)
                                   ->whereHas('role', function($query) {
                                       $query->where('role', 'business owner');
                                   })
                                   ->first();
    
        if (!$roleCompany) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya owner yang boleh mengedit profile company!'
            ], 403);
        }
    
        // Gunakan company_id untuk mendapatkan informasi perusahaan dari tabel master_company
        $company = ProfileCompany::find($roleCompany->id_company);
    
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ditemukan'
            ], 404);
        }
    
        // Update informasi perusahaan
        $company->update([
            'c_nama'    => $request->c_nama,
            'c_alamat'  => $request->c_alamat,
            'c_no_hp'   => $request->c_no_hp,
            'c_email'   => $request->c_email
        ]);
    
        return response()->json([
            'success' => true,
            'company' => $company
        ]);
    }
    public function getCompanyMembers($id_company)
    {
        $user = Auth::user();
    
        // Cek apakah perusahaan ada
        $company = ProfileCompany::find($id_company);
    
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Company not found',
            ], 404);
        }
    
        // Cek apakah pengguna adalah anggota perusahaan atau memiliki hak akses
        $isMember = RoleCompany::where('id_company', $id_company)
                               ->where('id_user', $user->id)
                               ->exists();
    
        if (!$isMember) {
            return response()->json([
                'success' => false,
                'message' => 'You are not a member of this company',
            ], 403);
        }
    
        // Ambil anggota perusahaan jika pengguna memiliki akses
        $members = RoleCompany::where('id_company', $id_company)
                              ->with(['company', 'user', 'role'])
                              ->get()
                              ->map(function ($roleCompany) {
                                  return [
                                    'id' => $roleCompany->user->id,
                                    'nama' => $roleCompany->user->nama,
                                    'email' => $roleCompany->user->email,
                                    'no_hp' => $roleCompany->user->no_hp,
                                    'role' => $roleCompany->role->role,
                                  ];
                              });
    
        return response()->json([
            'success' => true,
            'company' => $company,
            'members' => $members,
        ], 200);
    }
    
    public function getCompanyById($id)
    {
        $user = Auth::user();
    
        // Cek akses pengguna ke perusahaan
        $roleCompany = RoleCompany::where('id_company', $id)
            ->where('id_user', $user->id)
            ->first();
    
        if (!$roleCompany) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have access to this company'
            ], 403);
        }
    
        // Ambil data perusahaan
        $company = ProfileCompany::find($id);
    
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Company not found'
            ], 404);
        }
    
        // Hitung total anggota perusahaan
        $totalMembers = RoleCompany::where('id_company', $company->id)->count();
    
        // Ambil anggota perusahaan beserta role-nya
        $members = RoleCompany::where('id_company', $company->id)
            ->with(['user.profile', 'role']) // Include role relationship
            ->get()
            ->map(function($roleCompany) {
                return [
                    'id' => $roleCompany->user->id,
                    'nama' => $roleCompany->user->nama,
                    'email' => $roleCompany->user->email,
                    'no_hp' => $roleCompany->user->no_hp,
                    'role' => $roleCompany->role->role
                ];
            });
    
        return response()->json([
            'success' => true,
            'company' => [
                'id' => $company->id,
                'c_nama' => $company->c_nama,
                'c_alamat' => $company->c_alamat,
                'c_no_hp' => $company->c_no_hp,
                'c_email' => $company->c_email,
                'total_members' => $totalMembers,
                'members' => $members
            ]
        ], 200);
    }
    
    // public function inviteUser(Request $request, $companyId)
    // {
    //     $request->validate([
    //         'identifier' => 'nullable|string',
    //         'id_role' => 'required|exists:master_role,id',
    //     ]);
    
    //     $company = ProfileCompany::find($companyId);
    //     if (!$company) {
    //         return response()->json(['message' => 'Company not found'], 404);
    //     }
    
    //     $role = MasterRole::find($request->input('id_role'));
    //     if (!$role) {
    //         return response()->json(['message' => 'Role not found'], 404);
    //     }
    
    //     $identifier = $request->input('identifier');
    //     $user = null;
    
    //     if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
    //         $user = User::where('email', $identifier)->first();
    //     } elseif (is_numeric($identifier)) {
    //         $user = User::where('no_hp', $identifier)->first();
    //     }
    
    //     if ($user) {
    //         RoleCompany::create([
    //             'id_company' => $companyId,
    //             'id_user' => $user->id,
    //             'id_role' => $request->input('id_role'),
    //         ]);
    
    //         return response()->json(['message' => 'User added to the company successfully']);
    //     } else {
    //         $invitationData = [
    //             'company_id' => $companyId,
    //             'identifier' => $identifier,
    //             'role' => $role->role,
    //         ];
    
    //         if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
    //             $this->sendInvitationEmail($invitationData);
    //         } elseif (is_numeric($identifier)) {
    //             $this->sendInvitationSms($invitationData);
    //         }
    
    //         return response()->json(['message' => 'Invitation sent successfully']);
    //     }
    // }
    



    //Join API 
    // public function joinByToken(Request $request)
    // {
    //     $request->validate([
    //         'token' => 'required|string',
    //         'role_id' => 'required|exists:master_role,id',
    //     ]);

    //     $user = Auth::user();
    //     $token = $request->token;
    //     $roleId = $request->role_id;

    //     // Cari token undangan berdasarkan token
    //     $invitation = CompanyToken::where('token', $token)->first();

    //     if (!$invitation) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Token tidak valid atau telah digunakan.',
    //         ], 404);
    //     }

    //     $companyId = $invitation->id_company;

    //     // Pastikan pengguna belum menjadi anggota
    //     $existingRole = RoleCompany::where('id_company', $companyId)
    //                                 ->where('id_user', $user->id)
    //                                 ->first();

    //     if ($existingRole) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Anda sudah menjadi anggota perusahaan ini.',
    //         ], 400);
    //     }

    //     // Tetapkan pengguna sebagai anggota dengan role yang dipilih
    //     RoleCompany::create([
    //         'id_company' => $companyId,
    //         'id_user' => $user->id,
    //         'id_role' => $roleId,
    //     ]);

    //     // Hapus token setelah digunakan
    //     CompanyToken::where('token', $token)->delete();

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Berhasil bergabung dengan perusahaan.',
    //     ], 200);
    // }

    
    public function inviteUser(Request $request, $companyId)
    {
        $request->validate([
            'identifier' => 'nullable|string',
            'id_role' => 'required|exists:master_role,id',
        ]);
    
        $company = ProfileCompany::find($companyId);
        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }
    
        $role = MasterRole::find($request->input('id_role'));
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
    
        $identifier = $request->input('identifier');
        $user = null;
    
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $identifier)->first();
        } elseif (is_numeric($identifier)) {
            $user = User::where('no_hp', $identifier)->first();
        }
    
        if ($user) {
            // Buat notifikasi untuk pengguna yang diundang
            CompanyNotification::create([
                'id_company' => $companyId,
                'id_user' => $user->id,
                'requesting_id_user' => Auth::id(),
                'status' => 'pending',
                'id_role' => $request->input('id_role'), 
                'type' => 'invitation', 
            ]);
    
            return response()->json(['message' => 'User berhasil diundang']);
        } else {
            $invitationData = [
                'id_company' => $companyId,
                'identifier' => $identifier,
                'role' => $role->role,
            ];
    
            if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
                $this->sendInvitationEmail($invitationData);
            } elseif (is_numeric($identifier)) {
                $this->sendInvitationSms($invitationData);
            }
    
            return response()->json(['message' => 'Invitation sent successfully']);
        }
    }
    public function joinByToken(Request $request)
    {
        // Validasi input dari request
        $request->validate([
            'token' => 'required|string',
            'id_role' => 'required|exists:master_role,id',
        ]);
    
        $user = Auth::user();
        $token = $request->token;
        $roleId = $request->id_role;
    
        // Temukan token di basis data
        $invitation = CompanyToken::where('token', $token)->first();
    
        if (!$invitation) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid atau telah digunakan.',
            ], 400); // Gunakan 400 Bad Request
        }
    
        $companyId = $invitation->id_company;
    
        // Pastikan pengguna belum menjadi anggota
        $existingRole = RoleCompany::where('id_company', $companyId)
                                    ->where('id_user', $user->id)
                                    ->first();
    
        if ($existingRole) {
            return response()->json([
                'success' => false,
                'message' => 'Anda berhasil melakukan join, harap tunggu confirmasi dari pihak company.',
            ], 400);
        }
    
        // Buat notifikasi untuk pemilik perusahaan
        $owners = RoleCompany::where('id_company', $companyId)
                            ->whereHas('role', function($query) {
                                $query->where('role', 'business owner');
                            })
                            ->pluck('id_user');
    
        foreach ($owners as $ownerId) {
            CompanyNotification::create([
                'id_company' => $companyId,
                'id_user' => $ownerId,
                'requesting_id_user' => $user->id,
                'id_role' => $roleId, // Pastikan id_role disertakan di sini
                'status' => 'pending',
                'type' => 'join', // Tambahkan tipe notifikasi
            ]);
        }
    
        // Hapus token setelah digunakan
        $invitation->delete();
    
        return response()->json([
            'success' => true,
            'message' => 'Permintaan bergabung telah dikirim dan menunggu persetujuan.',
        ], 200);
    }    
    public function generateTokenForCompany(Request $request, $id)
    {
  
        $user = Auth::user();
        $companyId = $id; // Gunakan ID perusahaan dari URL
        
        // Ambil role 'business owner' dari tabel master_role
        $businessOwnerRole = MasterRole::where('role', 'business owner')->first();
        
        // Periksa apakah pengguna adalah business owner perusahaan
        $isBusinessOwner = RoleCompany::where('id_company', $companyId)
                                    ->where('id_user', $user->id)
                                    ->where('id_role', $businessOwnerRole->id)
                                    ->exists();

        if (!$isBusinessOwner) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        // Generate token
        $token = Str::random(10);

        // Buat token untuk perusahaan yang ditentukan
        CompanyToken::create([
            'id_company' => $companyId,
            'token' => $token,
        ]);

        return response()->json([
            'success' => true,
            'token' => $token,
        ], 201);
    }
    public function getTokens($id)
    {
        // Get tokens for the specified company
        $tokens = CompanyToken::where('id_company', $id)->pluck('token');

        return response()->json([
            'success' => true,
            'tokens' => $tokens,
        ]);
    }

    
    
    

}
