<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'company_id',
        'created_by',
        'updated_by',
    ];

    // Relationship dengan Company
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
