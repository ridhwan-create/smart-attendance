<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f0f0f0; }
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
                <th>Check In</th>
                <th>Check Out</th>
                <th>Late</th>
                <th>Early Leave</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($attendances as $i => $a)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td @if($a->is_late) style="color: red;" @endif>
                        {{ \Carbon\Carbon::parse($a->check_in_time)->format('d/m/Y H:i') }}
                    </td>
                    <td @if($a->is_early_leave) style="color: orange;" @endif>
                        {{ \Carbon\Carbon::parse($a->check_out_time)->format('d/m/Y H:i') }}
                    </td>
                    <td>
                        {{ $a->is_late ? $a->late_duration . ' min' : '-' }}
                    </td>
                    <td>
                        {{ $a->is_early_leave ? $a->early_leave_duration . ' min' : '-' }}
                    </td>
                    <td>
                        {{ $a->notes ? $a->notes : '-' }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>