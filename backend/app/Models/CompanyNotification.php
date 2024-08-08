<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_company',
        'id_user',
        'requesting_id_user',
        'id_role',
        'status',
        'type',
    ];

    // Relasi ke RoleCompany berdasarkan id_role, bukan id_company
    public function roleCompany()
    {
        return $this->belongsTo(RoleCompany::class, 'id_role', 'id_role');
    }

    // Relasi ke MasterRole
    public function role()
    {
        return $this->belongsTo(MasterRole::class, 'id_role', 'id');
    }

    // Relasi ke ProfileCompany
    public function company()
    {
        return $this->belongsTo(ProfileCompany::class, 'id_company', 'id');
    }

    public function requestingUser()
    {
        return $this->belongsTo(User::class, 'requesting_id_user');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

}
