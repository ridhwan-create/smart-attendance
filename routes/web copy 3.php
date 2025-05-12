<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    AttendanceController,
    AttendanceRegisterController,
    AttendanceReportController,
    AttendanceSelfController,
    AttendanceSummaryController,
    CompanyController,
    DashboardController,
    DepartmentController,
    EmployeeController,
    LocationController,
    RoleController,
    UserController,
    WorkScheduleTypeController
};

// Redirect ke login jika akses root
Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

// Dashboard hanya untuk pengguna yang login
Route::get('/dashboard', \App\Http\Controllers\DashboardController::class)->name('dashboard');

// ✅ Kawalan untuk semua pengguna yang login
Route::middleware('auth')->group(function () {
    // Lihat laporan atau kehadiran sendiri
    Route::get('attendance/self', [AttendanceSelfController::class, 'index'])->name('attendance.self');
    Route::post('attendances/self', [AttendanceSelfController::class, 'store'])->name('attendances.self.store');
});

// ✅ Kawalan untuk Super Admin
Route::middleware(['auth', 'role:Super Admin'])->group(function () {
    Route::resource('companies', CompanyController::class);
    Route::resource('departments', DepartmentController::class);
    Route::resource('locations', LocationController::class);
    Route::resource('work-schedule-types', WorkScheduleTypeController::class);
    Route::resource('employees', EmployeeController::class);
    Route::resource('attendances', AttendanceController::class);

    // Laporan dan penjanaan
    Route::get('/attendance/generate', fn () => inertia('attendances/generate'))->name('attendance.generate.view');
    Route::post('/attendance/generate', [AttendanceController::class, 'generateMonthlyAttendance'])->name('attendance.generate');

    Route::get('/attendance/report', [AttendanceReportController::class, 'index'])->name('attendances.report');
    Route::get('/attendance/report/export', [AttendanceReportController::class, 'export'])->name('attendances.report.export');

    // Pengguna & Peranan
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.assign-role');
});

    // ✅ Kawalan untuk Employee (dengan permission khusus)
    Route::middleware(['auth', 'role:employee'])->group(function () {
        Route::middleware(['permission:view self attendance'])->get(
            '/attendance/self',
            [AttendanceSelfController::class, 'index']
        )->name('attendance.self');

        Route::middleware(['permission:create self attendance'])->post(
            '/attendances/self',
            [AttendanceSelfController::class, 'store']
        )->name('attendances.self.store');
    });

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
