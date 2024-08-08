<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacebookAuth extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'facebook_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
