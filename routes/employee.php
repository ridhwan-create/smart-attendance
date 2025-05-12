<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AttendanceSelfController,
    LocationController
};

Route::middleware('role:Employee')
    ->prefix('employee')
    ->as('employee.')
    ->group(function () {
        Route::get('attendance/self', [AttendanceSelfController::class, 'index'])->name('attendance.self');
        Route::post('attendances/self', [AttendanceSelfController::class, 'store'])->name('attendances.store');

        Route::get('location-check', [LocationController::class, 'checkLocation'])->name('location.check');
    });
