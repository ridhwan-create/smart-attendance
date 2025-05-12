<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AttendanceReportController,
    AttendanceSelfController,
    LocationController
};

Route::middleware('role:Manager')
    ->prefix('manager')
    ->as('manager.')
    ->group(function () {
        Route::get('attendance/report', [AttendanceReportController::class, 'index'])->name('attendances.report');
        Route::get('attendance/report/export', [AttendanceReportController::class, 'export'])->name('attendances.report.export');

        Route::get('attendance/self', [AttendanceSelfController::class, 'index'])->name('attendance.self');
        Route::post('attendances/self', [AttendanceSelfController::class, 'store'])->name('attendances.store');

        Route::get('location-check', [LocationController::class, 'checkLocation'])->name('location.check');
    });
