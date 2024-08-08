<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Models\CompanyNotification;
use App\Models\RoleCompany;

class NotifController extends Controller
{
    public function respondToInvitation(Request $request)
    {
        // Validasi input dari request
        $request->validate([
            'notification_id' => 'required|exists:company_notifications,id',
            'response' => 'required|in:accepted,rejected',
        ]);
    
        // Temukan notifikasi berdasarkan ID
        $notification = CompanyNotification::find($request->notification_id);
    
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
    
        // Ambil pengguna yang sedang terautentikasi
        $user = Auth::user();
    
        // Periksa apakah pengguna yang melakukan permintaan adalah yang diundang
        if ($notification->type !== 'invitation' || $notification->id_user !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Periksa status notifikasi
        if ($notification->status !== 'pending') {
            return response()->json(['message' => 'Notification has already been responded to'], 400);
        }
    
        // Update the notification status
        $notification->status = $request->response;
        $notification->save();
    
        if ($request->response === 'accepted') {
            RoleCompany::create([
                'id_company' => $notification->id_company,
                'id_user' => $user->id,
                'id_role' => $notification->id_role,
            ]);
        } elseif ($request->response === 'rejected') {
            // Opsional: beri tahu pengundang bahwa undangan ditolak
        }
    
        return response()->json(['message' => 'Response recorded successfully']);
    }

    public function respondToJoinRequest(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|exists:company_notifications,id',
            'response' => 'required|in:accepted,rejected',
        ]);
    
        $notification = CompanyNotification::find($request->notification_id);
    
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
    
        $user = Auth::user();
    
        // Check if the user is the owner of the company
        if ($notification->type !== 'join') {
            return response()->json(['message' => 'Invalid notification type'], 400);
        }
    
        $isOwner = RoleCompany::where('id_company', $notification->id_company)
                            ->where('id_user', $user->id)
                            ->whereHas('role', function($query) {
                                $query->where('role', 'business owner');
                            })
                            ->exists();
    
        if (!$isOwner) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Update the notification status
        $notification->status = $request->response;
        $notification->save();
    
        if ($request->response === 'accepted') {
            // Add the user to the company
            RoleCompany::create([
                'id_company' => $notification->id_company,
                'id_user' => $notification->requesting_id_user,
                'id_role' => $notification->id_role, // Ensure you include the role ID
            ]);
        } elseif ($request->response === 'rejected') {
            // Optionally, notify the requesting user that their request was rejected
            // Example: Send a notification email or message
        }
    
        return response()->json(['message' => 'Response recorded successfully']);
    }    

    public function getNotifications(Request $request)
    {
        $user = Auth::user();
        
        // Menentukan tipe notifikasi yang ingin diambil dari parameter request
        $type = $request->query('type'); // Misalnya, 'invitation' atau 'join'
    
        $notificationsQuery = CompanyNotification::where(function ($query) use ($user) {
            $query->where('id_user', $user->id)
                  ->orWhere('requesting_id_user', $user->id);
        });
    
        // Filter berdasarkan tipe notifikasi jika ada
        if ($type) {
            $notificationsQuery->where('type', $type);
        }
    
        $notifications = $notificationsQuery
            ->with([
                'company:id,c_nama',
                'role:id,role',
                'requestingUser:id,nama,email',
                'user:id,nama,email'
            ])
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'id_company' => $notification->id_company,
                    'id_user' => $notification->id_user,
                    'requesting_id_user' => $notification->requesting_id_user,
                    'id_role' => $notification->id_role,
                    'status' => $notification->status,
                    'type' => $notification->type,
                    'created_at' => $notification->created_at->toIso8601String(),
                    'updated_at' => $notification->updated_at->toIso8601String(),
                    'company' => $notification->company ? [
                        'id' => $notification->company->id,
                        'c_nama' => $notification->company->c_nama,
                    ] : null,
                    'role' => $notification->role ? [
                        'id' => $notification->role->id,
                        'role' => $notification->role->role,
                    ] : null,
                    'requesting_user' => $notification->requestingUser ? [
                        'id' => $notification->requestingUser->id,
                        'nama' => $notification->requestingUser->nama,
                        'email' => $notification->requestingUser->email,
                    ] : null,
                    'user' => $notification->user ? [
                        'id' => $notification->user->id,
                        'nama' => $notification->user->nama,
                        'email' => $notification->user->email,
                    ] : null,
                ];
            });
    
        return response()->json($notifications);
    }

    public function deleteNotification($id): JsonResponse
    {
        $notification = CompanyNotification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notifikasi tidak ditemukan.'], 404);
        }

        if ($notification->id_user !== Auth::id() && $notification->requesting_id_user !== Auth::id()) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk menghapus notifikasi ini.'], 403);
        }

        $notification->delete();

        return response()->json(['message' => 'Notifikasi berhasil dihapus.']);
    }

}
