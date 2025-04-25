<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Nama</th>
            <th>IC</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Lambat</th>
            <th>Balik Awal</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($attendances as $i => $a)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $a->employee->name }}</td>
                <td>{{ $a->employee->ic_number }}</td>
                <td>{{ \Carbon\Carbon::parse($a->check_in_time)->format('H:i') }}</td>
                <td>{{ \Carbon\Carbon::parse($a->check_out_time)->format('H:i') }}</td>
                <td>{{ $a->is_late ? $a->late_duration . ' min' : '-' }}</td>
                <td>{{ $a->is_early_leave ? $a->early_leave_duration . ' min' : '-' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
