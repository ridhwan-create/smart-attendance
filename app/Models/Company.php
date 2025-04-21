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

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function locations()
    {
        return $this->hasMany(Location::class);
    }    

    public function attendances()
    {
        return $this->hasManyThrough(
            \App\Models\Attendance::class,
            \App\Models\Employee::class,
            'company_id',    // Foreign key on Employee table
            'employee_id',   // Foreign key on Attendance table
            'id',            // Local key on Company table
            'id'             // Local key on Employee table
        );
    }
    

}
