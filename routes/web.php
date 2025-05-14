<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    AttendanceController,
    EmployeeController,
    CompanyController,
    DepartmentController,
    LocationController,
    WorkScheduleTypeController,
    AttendanceRegisterController,
    AttendanceSelfController,
    DashboardController,
    AttendanceSummaryController,
    AttendanceReportController,
    RoleController,
    UserController
};

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

// Route::get('/employee/dashboard', [DashboardController::class, 'employeeDashboard'])->middleware(['auth', 'verified']);

Route::middleware(['auth', 'verified'])->group(function () {

    // Route::get('/dashboard', DashboardController::class)
    //     ->name('dashboard');
    // Employee dashboard
    Route::get('/employee/dashboard', [DashboardController::class, 'employeeDashboard'])
        ->middleware(['auth', 'verified'])
        ->name('employee.dashboard');

    // Manager dashboard
    Route::get('/manager/dashboard', [DashboardController::class, 'managerDashboard'])
        ->middleware(['auth', 'verified'])
        ->name('manager.dashboard');

    // Admin/Manager dashboard
    Route::get('/dashboard', DashboardController::class)
        ->name('dashboard')
        ->middleware(['auth', 'verified']);


    // Companies
    Route::resource('companies', CompanyController::class)
        ->middleware([
            'index' => 'permission:view companies',
            'create' => 'permission:create companies',
            'store' => 'permission:create companies',
            'edit' => 'permission:edit companies',
            'update' => 'permission:edit companies',
            'destroy' => 'permission:delete companies',
            'show' => 'permission:view companies',
        ]);

    // Departments
    Route::resource('departments', DepartmentController::class)
        ->middleware([
            'index' => 'permission:view departments',
            'create' => 'permission:create departments',
            'store' => 'permission:create departments',
            'edit' => 'permission:edit departments',
            'update' => 'permission:edit departments',
            'destroy' => 'permission:delete departments',
            'show' => 'permission:view departments',
        ]);

    // Locations
    Route::resource('locations', LocationController::class)
        ->middleware([
            'index' => 'permission:view locations',
            'create' => 'permission:create locations',
            'store' => 'permission:create locations',
            'edit' => 'permission:edit locations',
            'update' => 'permission:edit locations',
            'destroy' => 'permission:delete locations',
            'show' => 'permission:view locations',
        ]);

    Route::get('/location-check', [LocationController::class, 'checkLocation'])
        ->middleware('permission:view locations')
        ->name('location.check');

    // Work Schedule Types
    Route::resource('work-schedule-types', WorkScheduleTypeController::class)
        ->middleware([
            'index' => 'permission:view work schedule types',
            'create' => 'permission:create work schedule types',
            'store' => 'permission:create work schedule types',
            'edit' => 'permission:edit work schedule types',
            'update' => 'permission:edit work schedule types',
            'destroy' => 'permission:delete work schedule types',
            'show' => 'permission:view work schedule types',
        ]);

    // Employees
    Route::resource('employees', EmployeeController::class)
        ->middleware([
            'index' => 'permission:view employees',
            'create' => 'permission:create employees',
            'store' => 'permission:create employees',
            'edit' => 'permission:edit employees',
            'update' => 'permission:edit employees',
            'destroy' => 'permission:delete employees',
            'show' => 'permission:view employees',
        ]);

    // Attendances
    Route::resource('attendances', AttendanceController::class);
    // ->middleware([
    //     'index' => 'permission:view attendances',
    //     'create' => 'permission:create attendances',
    //     'store' => 'permission:create attendances',
    //     'edit' => 'permission:edit attendances',
    //     'update' => 'permission:edit attendances',
    //     'destroy' => 'permission:delete attendances',
    //     'show' => 'permission:view attendances',
    // ]);

    Route::get('/attendance/generate', function () {
        return Inertia::render('attendances/generate');
    })->middleware('permission:create attendances')->name('attendance.generate.view');

    Route::post('/attendance/generate', [AttendanceController::class, 'generateMonthlyAttendance'])
        ->middleware('permission:create attendances')
        ->name('attendance.generate');

    // Self Attendance (for User role)
    Route::get('/attendance/self', [AttendanceSelfController::class, 'index'])
        ->middleware('permission:view self attendance')
        ->name('attendance.self');

    Route::post('/attendances/self', [AttendanceSelfController::class, 'store'])
        ->middleware('permission:create self attendance')
        ->name('attendances.store');

    // Attendance Reports
    Route::get('/attendance/report', [AttendanceReportController::class, 'index'])
        ->middleware('permission:view attendance reports')
        ->name('attendances.report');

    Route::get('/attendance/report/export', [AttendanceReportController::class, 'export'])
        ->middleware('permission:export attendance reports')
        ->name('attendances.report.export');

    Route::get('/my-attendance', [AttendanceReportController::class, 'myAttendance']);

    // Users
    Route::resource('users', UserController::class)
        ->middleware([
            'index' => 'permission:view users',
            'create' => 'permission:create users',
            'store' => 'permission:create users',
            'edit' => 'permission:edit users',
            'update' => 'permission:edit users',
            'destroy' => 'permission:delete users',
            'show' => 'permission:view users',
        ]);

    // Roles
    Route::resource('roles', RoleController::class)
        ->middleware([
            'index' => 'permission:view roles',
            'create' => 'permission:create roles',
            'store' => 'permission:create roles',
            'edit' => 'permission:edit roles',
            'update' => 'permission:edit roles',
            'destroy' => 'permission:delete roles',
            'show' => 'permission:view roles',
        ]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
