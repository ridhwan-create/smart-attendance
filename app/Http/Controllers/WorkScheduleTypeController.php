<?php

namespace App\Http\Controllers;

use App\Models\WorkScheduleType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WorkScheduleTypeController extends Controller
{
    public function index()
    {
        $types = WorkScheduleType::latest()->get();

        return Inertia::render('work-schedule-types/index', [
            'workScheduleTypes' => $types,
        ]);
    }

    public function create()
    {
        return Inertia::render('work-schedule-types/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => ['required', 'string', 'max:255'],
        ]);

        WorkScheduleType::create([
            'type' => $request->type,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('work-schedule-types.index')
            ->with('success', 'Work schedule type created.');
    }

    public function edit(WorkScheduleType $workScheduleType)
    {
        return Inertia::render('work-schedule-types/edit', [
            'workScheduleType' => $workScheduleType,
        ]);
    }

    public function update(Request $request, WorkScheduleType $workScheduleType)
    {
        $request->validate([
            'type' => ['required', 'string', 'max:255'],
        ]);

        $workScheduleType->update([
            'type' => $request->type,
            'updated_by' => Auth::id(),
        ]);

        return redirect()->route('work-schedule-types.index')
            ->with('success', 'Work schedule type updated.');
    }

    public function destroy(WorkScheduleType $workScheduleType)
    {
        $workScheduleType->delete();

        return redirect()->route('work-schedule-types.index')
            ->with('success', 'Work schedule type deleted.');
    }
}

