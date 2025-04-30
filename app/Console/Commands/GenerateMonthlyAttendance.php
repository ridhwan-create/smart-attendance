<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GenerateMonthlyAttendance extends Command
{
    protected $signature = 'attendance:generate-monthly';
    protected $description = 'Generate monthly attendance for all employees.';

    public function handle()
    {
        $today = Carbon::now();
        $firstDayOfMonth = $today->copy()->startOfMonth();
        $lastDayOfMonth = $today->copy()->endOfMonth();
    
        $month = $today->format('Y-m'); // Format sebagai '2025-04'
    
        $employees = Employee::all();
    
        DB::beginTransaction();
    
        try {
            // foreach ($employees as $employee) {
            //     // Semak jika rekod sudah wujud untuk bulan ini bagi pekerja
            //     $attendanceExists = Attendance::where('employee_id', $employee->id)
            //         ->whereBetween('date_of_month', [$firstDayOfMonth, $lastDayOfMonth])
            //         ->exists();
    
            //     if ($attendanceExists) {
            //         // Jika rekod sudah wujud, langkau pekerja ini
            //         continue;
            //     }
    
            //     for ($date = $firstDayOfMonth->copy(); $date->lte($lastDayOfMonth); $date->addDay()) {
            //         Attendance::create([
            //             'employee_id' => $employee->id,
            //             'company_id' => $employee->company_id,
            //             'work_schedule_type_id' => $employee->work_schedule_type_id ?? null,
            //             'name' => $employee->name,
            //             'ic_number' => $employee->ic_number,
            //             'notes' => null,
            //             'status' => 'absent',
            //             'date_of_month' => $date->toDateString(),
            //             'check_in_time' => null,
            //             'check_out_time' => null,
            //             'location_id' => null,
            //             'latitude' => null,
            //             'longitude' => null,
            //             'created_by' => 1,
            //             'updated_by' => 1,
            //             'created_at' => $date,
            //             'updated_at' => $date,
            //         ]);
            //     }
            // }
            foreach ($employees as $employee) {
                // Ambil semua rekod kehadiran sedia ada untuk bulan ini
                $existingDates = Attendance::where('employee_id', $employee->id)
                    ->whereBetween('date_of_month', [$firstDayOfMonth, $lastDayOfMonth])
                    ->pluck('date_of_month')
                    ->map(fn ($d) => Carbon::parse($d)->toDateString())
                    ->toArray();
            
                for ($date = $firstDayOfMonth->copy(); $date->lte($lastDayOfMonth); $date->addDay()) {
                    if (in_array($date->toDateString(), $existingDates)) {
                        continue; // Hari ini sudah wujud
                    }
            
                    Attendance::create([
                        'employee_id' => $employee->id,
                        'company_id' => $employee->company_id,
                        'work_schedule_type_id' => $employee->work_schedule_type_id ?? null,
                        'name' => $employee->name,
                        'ic_number' => $employee->ic_number,
                        'notes' => null,
                        'status' => 'absent',
                        'date_of_month' => $date->toDateString(),
                        'check_in_time' => null,
                        'check_out_time' => null,
                        'location_id' => $employee->location_id,
                        'latitude' => null,
                        'longitude' => null,
                        'created_by' => 1,
                        'updated_by' => 1,
                        'created_at' => $date,
                        'updated_at' => $date,
                    ]);
                }
            }

            DB::commit();
            $this->info('Monthly attendance generated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Failed to generate attendances: ' . $e->getMessage());
        }
    }
}
