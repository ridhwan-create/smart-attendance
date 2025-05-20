<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HRMSAttendance extends Model
{
    protected $connection = 'hrms'; // connection dari config/database.php
    protected $table = 'attendance'; // nama jadual dalam HRMS
    public $timestamps = false; // jika takde `created_at` dan `updated_at`

    protected $fillable = [
        'no_pekerja',
        'id_bahagian',
        'id_unit',
        'id_penempatan',
        'id_cawangan',
        'mode',
        'temperature',
        'kod_jadual',
        'f_hari_bekerja',
        'day',
        'date',
        'time_in',
        'time_out',
        'tempoh_bekerja',
        'lewat',
        'kurang_jam',
        'keluar_awal',
        'tidak_rakam_keluar',
        'terminalDeviceId',
        'id_jadual_waktu_kerja',
        'is_guru',
        'id_jadual_cuti_umum_sekolah',
        'nama_cuti_umum_sekolah',
        'id_kehadiran_transaksi_4_jam',
        'tujuan',
        'id_kenyataan_kehadiran_pekerja',
        'f_status_sokongan_kehadiran',
        'id_kenyataan_kehadiran',
        'kenyataan_kehadiran',
        'id_permohonan_cuti',
        'id_jenis_cuti',
        'f_admin_cuti',
        'nama_permohonan_cuti',
        'kursus_pendaftaran_id',
    ];
}
