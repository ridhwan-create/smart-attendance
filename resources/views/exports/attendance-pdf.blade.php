<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f0f0f0; }
        .weekend-row { background-color: #f5f5f5; }
        .absent { color: red; font-weight: bold; }
        .present { color: green; font-weight: bold; }
    </style>
</head>
<body>

    @if ($employee)
    <table border="0" cellspacing="0" cellpadding="5" style="width: 100%; max-width: 500px; border: none;">
        <tr>
            <td style="width: 50%; vertical-align: top; border: none;">
                <h1 style="margin: 0; padding: 0;"><strong>{{ $company->company_name ?? '-' }}</strong></h1>
            </td>
            <td style="width: 50%; vertical-align: top; border: none; text-align: right;">
                <h2 style="margin: 0; padding: 0;"><strong>Monthly Attendance Report</strong></h2>
            </td>
        </tr>
        <tr>
            <td style="width: 50%; vertical-align: top; border: none;">
                <p style="margin: 5px 0;"><strong>Name:</strong> {{ $employee->name }}</p>
                <p style="margin: 5px 0;"><strong>IC Number:</strong> {{ $employee->ic_number }}</p>
                <p style="margin: 5px 0;"><strong>Attendance Percentage:</strong> {{ $attendancePercentage }}%</p>
            </td>
            <td style="width: 50%; vertical-align: top; border: none; text-align: right;">
                <p style="margin: 5px 0; text-align: right;"><strong>{{ \Carbon\Carbon::parse($month)->translatedFormat('F Y') }}</strong></p>
                <p style="margin: 5px 0; text-align: right;"><strong>Department:</strong> {{ $department->name ?? '-' }}</p>
                <p style="margin: 5px 0; text-align: right;"><strong>Location:</strong> {{ $location->name ?? '-' }}</p>
            </td>
        </tr>
    </table>
    @endif

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th className="p-3">Date</th>
                <th className="p-3">Day</th>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Late</th>
                <th className="p-3">Early Leave</th>
                <th className="p-3">Status</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($attendances as $i => $a)
                @php
                    $dayOfWeek = \Carbon\Carbon::parse($a->date_of_month)->format('l');
                    $isWeekend = in_array($dayOfWeek, ['Saturday', 'Sunday']);
                    $hasActivity = $a->check_in_time || $a->check_out_time;
                    $statusClass = '';
                    if (!$isWeekend || $hasActivity) {
                        $statusClass = strtolower($a->status) === 'present' ? 'present' : 'absent';
                    }
                @endphp
                <tr @if($isWeekend) class="weekend-row" @endif>
                    <td>{{ $i + 1 }}</td>
                    <td>
                        {{ \Carbon\Carbon::parse($a->date_of_month)->format('d/m/Y') }}
                    </td>
                    <td>
                        {{ $dayOfWeek }}
                    </td>
                    <td @if($a->is_late && (!$isWeekend || $hasActivity)) style="color: red;" @endif>
                        @if($isWeekend && !$hasActivity)
                            -
                        @else
                            {{ optional($a->check_in_time, function($time) { return \Carbon\Carbon::parse($time)->format('H:i'); }) ?? '-' }}
                        @endif
                    </td>
                    <td @if($a->is_early_leave && (!$isWeekend || $hasActivity)) style="color: orange;" @endif>
                        @if($isWeekend && !$hasActivity)
                            -
                        @else
                            {{ optional($a->check_out_time, function($time) { return \Carbon\Carbon::parse($time)->format('H:i'); }) ?? '-' }}
                        @endif
                    </td>
                    <td>
                        @if($isWeekend && !$hasActivity)
                            -
                        @else
                            {{ $a->is_late ? $a->late_duration . ' min ' : '- ' }}
                        @endif
                    </td>
                    <td>
                        @if($isWeekend && !$hasActivity)
                            -
                        @else
                            {{ $a->is_early_leave ? $a->early_leave_duration . ' min ' : '- ' }}
                        @endif
                    </td>
                    <td class="{{ $statusClass }}">
                        @if($isWeekend && !$hasActivity)
                            -
                        @else
                            {{ $a->status }}
                        @endif
                    </td>
                    <td>
                        @if($isWeekend && !$hasActivity)
                            -
                        @else
                            {{ $a->notes ? $a->notes : '-' }}
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>