<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorkScheduleType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type',
        'created_by',
        'updated_by',
    ];

    // Relationship dengan User (CreatedBy & UpdatedBy)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
