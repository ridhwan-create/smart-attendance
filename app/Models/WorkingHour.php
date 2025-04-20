<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorkingHour extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'location_id',
        'day_of_week',
        'start_time',
        'end_time',
        'grace_period_minutes',
        'early_leave_margin_minutes',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
