<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\WorkScheduleTypeController;
use App\Http\Controllers\AttendanceRegisterController;
use App\Http\Controllers\AttendanceSelfController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttendanceSummaryController;
use App\Http\Controllers\AttendanceReportController;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');

    Route::get('/dashboard', \App\Http\Controllers\DashboardController::class)
    ->name('dashboard');

    
// Route::get('/attendance-summary', AttendanceSummaryController::class)
//     ->name('attendance.summary');


    Route::resource('attendances', AttendanceController::class);
    Route::resource('employees', EmployeeController::class);
    Route::resource('companies', CompanyController::class);
    Route::resource('departments', DepartmentController::class);
    Route::resource('locations', LocationController::class);
    Route::resource('work-schedule-types', WorkScheduleTypeController::class);
    Route::get('/location-check', [LocationController::class, 'checkLocation'])->name('location.check');
    // Route::get('/attendances-registration/map-check', [AttendanceRegisterController::class, 'mapCheck'])->name('locations.map-check');
    // Route::get('/attendances-registration/register', [AttendanceRegisterController::class, 'register'])->name('attendance.register');
    // Route::post('/attendances-registration/record', [AttendanceRegisterController::class, 'record'])->name('attendance.submit');

    Route::middleware(['auth'])->group(function () {
        Route::get('/attendance/self', [AttendanceSelfController::class, 'index'])->name('attendance.self');
        Route::post('/attendances/self', [AttendanceSelfController::class, 'store'])->name('attendances.store');
    });

    Route::get('/attendance/report', [AttendanceReportController::class, 'index'])
    ->name('attendances.report');
    Route::get('/attendance/report/export', [AttendanceReportController::class, 'export'])->name('attendances.report.export');

    // Route::get('/attendance/generate', function () {
    //     return view('attendance.generate');
    // })->name('attendance.generate.view');

    // Route::post('/attendance/generate', [AttendanceController::class, 'generateMonthlyAttendance'])->name('attendance.generate');

    Route::get('/attendance/generate', function () {
        return Inertia::render('attendances/generate');
    })->name('attendance.generate.view');

    Route::post('/attendance/generate', [AttendanceController::class, 'generateMonthlyAttendance'])
    ->name('attendance.generate');

});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
