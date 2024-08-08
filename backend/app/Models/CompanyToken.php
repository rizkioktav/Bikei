<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyToken extends Model
{
    protected $table = 'company_token';

    protected $fillable = [
        'id_company',
        'token',
    ];

    public function company()
    {
        return $this->belongsTo(ProfileCompany::class, 'id_company');
    }
}
