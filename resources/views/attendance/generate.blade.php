<div class="container">
    <h1 class="mb-4">Generate Monthly Attendance</h1>
    <form action="{{ route('attendance.generate') }}" method="POST">
        @csrf
        <button type="submit" class="btn btn-primary">Generate for This Month</button>
    </form>
</div>