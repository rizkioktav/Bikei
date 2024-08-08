<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileUser extends Model
{
    use HasFactory;

    protected $table = 'user_profile';

    protected $fillable = [
        'id_user', 
        'username', 
        'nama', 
        'no_hp', 
        'email', 
        'alamat', 
        'tanggal_lahir', 
        'gender'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    
}
