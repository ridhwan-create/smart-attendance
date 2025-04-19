<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'ic_number',
        'name',
        'check_in_time',
        'check_out_time',
        'location_id',
        'notes',
        'company_id',
        'work_schedule_type_id',
        'created_by',
        'updated_by',
        'latitude',
        'longitude',
    ];

    protected $dates = ['check_in_time', 'check_out_time'];

    // Relationships
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function workScheduleType()
    {
        return $this->belongsTo(WorkScheduleType::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
