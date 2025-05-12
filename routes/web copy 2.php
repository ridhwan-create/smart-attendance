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

Route::get('/', fn () => Inertia::render('auth/login'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // =======================
    // Super Admin Routes
    // =======================
    Route::middleware('role:Super Admin')->group(function () {
        // User Management
        Route::resource('users', UserController::class);
        Route::get('/users/{user}/assign-role', [UserController::class, 'showAssignRoleForm'])->name('users.assign-role.show');
        Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.assign-role');

        // Role Management
        Route::resource('roles', RoleController::class);

                // User Management
                Route::resource('users', UserController::class);

        // Full CRUD Permissions
        Route::resources([
            'companies' => CompanyController::class,
            'departments' => DepartmentController::class,
            'locations' => LocationController::class,
            'work-schedule-types' => WorkScheduleTypeController::class,
            'employees' => EmployeeController::class,
            'attendances' => AttendanceController::class,
        ]);

        // Attendance Report
        Route::get('/attendance-report', [AttendanceReportController::class, 'index'])
        ->middleware('permission:view attendance reports');
    

        Route::post('/attendance-report/export', [AttendanceReportController::class, 'export'])
            ->middleware('permission:export attendance reports');


        // Attendance Generator
        Route::get('/attendance/generate', fn () => Inertia::render('attendances/generate'))->name('attendance.generate.view');
        Route::post('/attendance/generate', [AttendanceController::class, 'generateMonthlyAttendance'])->name('attendance.generate');
    });

    // =======================
    // Manager Routes
    // =======================
    Route::middleware('role:Manager')->group(function () {
        Route::get('/attendance/report', [AttendanceReportController::class, 'index'])->name('attendances.report');
        Route::get('/attendance/report/export', [AttendanceReportController::class, 'export'])->name('attendances.report.export');

        Route::get('/attendance/self', [AttendanceSelfController::class, 'index'])->name('attendance.self');
        Route::post('/attendances/self', [AttendanceSelfController::class, 'store'])->name('attendances.store');

        Route::get('/location-check', [LocationController::class, 'checkLocation'])->name('location.check');
    });

    // =======================
    // Employee Routes
    // =======================
    Route::middleware('role:Employee')->group(function () {
        Route::get('/attendance/self', [AttendanceSelfController::class, 'index'])->name('attendance.self');
        Route::post('/attendances/self', [AttendanceSelfController::class, 'store'])->name('attendances.store');
        Route::get('/location-check', [LocationController::class, 'checkLocation'])->name('location.check');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
