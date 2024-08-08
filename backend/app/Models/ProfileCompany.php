<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileCompany extends Model
{
    use HasFactory;

    protected $table = 'master_company';

    protected $fillable = [
        'c_nama',
        'c_alamat',
        'c_no_hp',
        'c_email'
    ];
    public function roles()
    {
        return $this->hasMany(RoleCompany::class, 'id_company');
    }
}
