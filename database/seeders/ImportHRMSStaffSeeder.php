<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ImportHRMSStaffSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $this->command->info("Fetching HRMS attendance data...");

        // Step 1: Fetch all attendance and normalize no_pekerja (remove leading zero)
        $attendanceRaw = DB::connection('hrms')
            ->table('attendance')
            ->whereNotNull('id_bahagian')
            ->get(['no_pekerja', 'id_bahagian']);

        // Buat map: [normalized_no_pekerja => id_bahagian]
        $attendanceMap = [];
        foreach ($attendanceRaw as $att) {
            $normalized = ltrim($att->no_pekerja, '0');
            $attendanceMap[$normalized] = $att->id_bahagian;
        }

        $this->command->info("Attendance mapped: " . count($attendanceMap));

        // Step 2: Process staff in chunk
        $processed = 0;
        $skippedNoAttendance = 0;
        $skippedDuplicateEmail = 0;

        DB::connection('hrms')
            ->table('profil')
            ->whereNull('delete_on')
            ->where('status_data', 1)
            ->select([
                'no_kad_pengenalan_baru',
                'no_pekerja',
                'nama',
                'emel_rasmi',
                'no_telefon_bimbit'
            ])
            ->orderBy('no_pekerja')
            ->chunk(500, function ($staffs) use (
                &$processed,
                &$skippedNoAttendance,
                &$skippedDuplicateEmail,
                $attendanceMap,
                $now
            ) {
                $toInsert = [];

                foreach ($staffs as $staff) {
                    // Normalize no_pekerja untuk padan dengan attendance
                    $normalized = ltrim($staff->no_pekerja, '0');

                    $id_bahagian = $attendanceMap[$normalized] ?? null;

                    if (!$id_bahagian) {
                        $skippedNoAttendance++;
                        continue;
                    }

                    // Skip if duplicate email already exists
                    if (!empty($staff->emel_rasmi)) {
                        $exists = DB::table('employees')->where('email', $staff->emel_rasmi)->exists();
                        if ($exists) {
                            $skippedDuplicateEmail++;
                            continue;
                        }
                    }

                    $toInsert[] = [
                        'ic_number' => $staff->no_kad_pengenalan_baru,
                        'employee_number' => $staff->no_pekerja,
                        'name' => $staff->nama,
                        'email' => $staff->emel_rasmi ?? $staff->no_pekerja . '@temp.local',
                        'phone' => $staff->no_telefon_bimbit ?? '-',
                        'company_id' => 3,
                        'department_id' => $id_bahagian,
                        'position' => '-',
                        'location_id' => null,
                        'user_id' => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    $processed++;
                }

                if (!empty($toInsert)) {
                    DB::table('employees')->insertOrIgnore($toInsert);
                }
            });

        $this->command->info("Import results:");
        $this->command->info("✅ Processed: {$processed}");
        $this->command->info("⏭️ Skipped (no attendance match): {$skippedNoAttendance}");
        $this->command->info("⏭️ Skipped (duplicate email): {$skippedDuplicateEmail}");
    }
}
