<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'registration_number',
        'company_name',
        'created_by',
        'updated_by',
    ];

    // Relationship dengan Department
    public function departments()
    {
        return $this->hasMany(Department::class);
    }
}
