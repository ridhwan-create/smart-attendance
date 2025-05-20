<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\HRMSAttendance;

class HRMSStaff extends Model
{
    protected $connection = 'hrms';
    protected $table = 'profil'; // atau 'attendance' ikut table sebenar
    public $timestamps = false; // jika takde `created_at` dan `updated_at`

    public function attendance()
    {
        return $this->hasOne(HRMSAttendance::class, 'no_pekerja', 'no_pekerja');
    }
}
