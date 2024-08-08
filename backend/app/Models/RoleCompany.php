<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleCompany extends Model
{
    use HasFactory;
    protected $table = 'company_member_role';
    protected $fillable = [
        'id_company',
        'id_user',
        'id_role'
    ];

    public function company()
    {
        return $this->belongsTo(ProfileCompany::class, 'id_company');
    }
    
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function role()
    {
        return $this->belongsTo(MasterRole::class, 'id_role');
    }
    
    // public function userProfile()
    // {
    //     return $this->hasOneThrough(ProfileUser::class, User::class, 'id', 'id_user', 'id_user', 'id');
    // }
}
