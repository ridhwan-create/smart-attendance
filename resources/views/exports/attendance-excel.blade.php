<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
    <!-- Header Section -->
    <thead>
        <tr>
            <th colspan="9" style="text-align: center; font-size: 16px; font-weight: bold; padding: 12px; background-color: #2c3e50; color: white; border: 1px solid #1a252f;">
                {{ $attendances->first()->employee->company->company_name ?? 'Company Name Not Available' }} - Monthly Attendance Report (
                {{ isset($attendances->first()->date_of_month) ? \Carbon\Carbon::parse($attendances->first()->date_of_month)->translatedFormat('F Y') : 'Month Not Specified' }})
            </th>
        </tr>
        <tr>
            <th>

            </th>
        </tr>
        <tr>
            <th colspan="9">
                    <strong>Name : </strong> {{ $attendances->first()->employee->name ?? '-' }}
                    {{-- <strong>IC Number:</strong> {{ $attendances->first()->employee->ic_number ?? '-' }}<br> --}}
            </th>
        </tr>
        <tr>
            <th colspan="9">
                <strong>IC Number : </strong> {{ $attendances->first()->employee->ic_number ?? '-' }}
            </th>
        </tr>
        <tr>
            <th colspan="9">
                <strong>Department : </strong> {{ $attendances->first()->employee->department->name ?? '-' }}
            </th>
        </tr>
        <tr>
            <th colspan="9">
                {{-- <strong>{{ isset($attendances->first()->date_of_month) ? \Carbon\Carbon::parse($attendances->first()->date_of_month)->translatedFormat('F Y') : 'Month Not Specified' }}</strong><br> --}}
                {{-- <strong>Department:</strong> {{ $attendances->first()->employee->department->name ?? '-' }}<br> --}}
                <strong>Location : </strong> {{ $attendances->first()->location->name ?? '-' }}
            </th>
        </tr>
        <tr>
            <th>

            </th>
        </tr>
        <!-- Column Headers -->
        <tr>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">#</th>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">Date</th>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">Day</th>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">Check-In</th>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">Check-Out</th>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">Late (min)</th>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">Early Leave (min)</th>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">Status</th>
            <th style="padding: 8px; background-color: #4b6dde; color: white; border: 1px solid #000000;">Remarks</th>
        </tr>
    </thead>

```
<!-- Data Rows -->
<tbody>
    @forelse ($attendances ?? [] as $i => $a)
        @php
            $date = $a->date_of_month ?? null;
            $dayOfWeek = $date ? \Carbon\Carbon::parse($date)->format('l') : '-';
            $isWeekend = $date ? in_array($dayOfWeek, ['Saturday', 'Sunday']) : false;
            $hasActivity = ($a->check_in_time ?? null) || ($a->check_out_time ?? null);
            $statusClass = '';

            if ((!$isWeekend || $hasActivity) && isset($a->status)) {
                $statusClass = strtolower($a->status) === 'present' ? 'color: #27ae60; font-weight: bold;' : 'color: #e74c3c; font-weight: bold;';
            }
        @endphp
        <tr style="@if($isWeekend) background-color: #f8f9fa; @endif">
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">{{ $i + 1 }}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">{{ $date ? \Carbon\Carbon::parse($date)->format('d/m/Y') : '-' }}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">{{ $dayOfWeek }}</td>
            <td style="padding: 6px; border: 1px solid #ddd; @if(($a->is_late ?? false) && (!$isWeekend || $hasActivity)) color: #e74c3c; @endif">
                @if($isWeekend && !$hasActivity)
                    -
                @else
                    {{ isset($a->check_in_time) ? \Carbon\Carbon::parse($a->check_in_time)->format('H:i') : '-' }}
                @endif
            </td>
            <td style="padding: 6px; border: 1px solid #ddd; @if(($a->is_early_leave ?? false) && (!$isWeekend || $hasActivity)) color: #f39c12; @endif">
                @if($isWeekend && !$hasActivity)
                    -
                @else
                    {{ isset($a->check_out_time) ? \Carbon\Carbon::parse($a->check_out_time)->format('H:i') : '-' }}
                @endif
            </td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">
                @if($isWeekend && !$hasActivity)
                    -
                @else
                    {{ ($a->is_late ?? false) ? ($a->late_duration ?? '0') : '-' }}
                @endif
            </td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">
                @if($isWeekend && !$hasActivity)
                    -
                @else
                    {{ ($a->is_early_leave ?? false) ? ($a->early_leave_duration ?? '0') : '-' }}
                @endif
            </td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center; {{ $statusClass }}">
                @if($isWeekend && !$hasActivity)
                    -
                @else
                    {{ $a->status ?? '-' }}
                @endif
            </td>
            <td style="padding: 6px; border: 1px solid #ddd;">{{ $a->notes ?? '-' }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="9" style="padding: 12px; text-align: center; border: 1px solid #ddd; background-color: #f8f9fa;">No attendance records found</td>
        </tr>
    @endforelse
</tbody>
```

</table>
