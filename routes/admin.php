<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AttendanceController,
    AttendanceReportController,
    CompanyController,
    DepartmentController,
    EmployeeController,
    LocationController,
    RoleController,
    UserController,
    WorkScheduleTypeController
};

Route::middleware('role:Super Admin')
    ->prefix('admin')
    ->as('admin.')
    ->group(function () {
        // User Management
        Route::resource('users', UserController::class);
        Route::get('users/{user}/assign-role', [UserController::class, 'showAssignRoleForm'])->name('users.assign-role.show');
        Route::post('users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.assign-role');

        // Role Management
        Route::resource('roles', RoleController::class);

        // CRUD Resources
        Route::resources([
            'companies' => CompanyController::class,
            'departments' => DepartmentController::class,
            'locations' => LocationController::class,
            'work-schedule-types' => WorkScheduleTypeController::class,
            'employees' => EmployeeController::class,
            'attendances' => AttendanceController::class,
        ]);

        // Attendance Report
        Route::get('attendance/reports/report', [AttendanceReportController::class, 'index'])
            ->middleware('permission:view attendance reports')
            ->name('attendances.reports.report.view');

        Route::post('attendance/reports/export', [AttendanceReportController::class, 'export'])
            ->middleware('permission:export attendance reports')
            ->name('attendance.report.export');

        // Attendance Generator
        Route::get('attendance/generate', fn () => Inertia::render('attendances/generate'))->name('attendance.generate.view');
        Route::post('attendance/generate', [AttendanceController::class, 'generateMonthlyAttendance'])->name('attendance.generate');
    });
