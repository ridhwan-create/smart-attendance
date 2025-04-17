
<h2 class="font-semibold text-xl text-gray-800 leading-tight">
    Semakan Lokasi & Jarak
</h2>


<div class="py-12">
<div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
    <div class="bg-muted overflow-hidden shadow-sm sm:rounded-lg">
        <div class="p-6 text-gray-900 space-y-6">

            <!-- Lokasi Semasa Pengguna -->
            <div class="border rounded p-4 bg-blue-50 space-y-2">
                <h3 class="text-lg font-semibold">Lokasi Semasa Pengguna</h3>
                <p>Latitude: <span id="currentLat">-</span></p>
                <p>Longitude: <span id="currentLng">-</span></p>
            </div>

            <!-- Senarai Lokasi -->
            <div class="border rounded p-4 bg-gray-50 space-y-2">
                <h3 class="text-lg font-semibold">Senarai Lokasi Dalam Sistem</h3>

                {{-- <table class="w-full text-left table-auto border mt-4" id="locationsTable">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="px-4 py-2">Nama</th>
                            <th class="px-4 py-2">Latitude</th>
                            <th class="px-4 py-2">Longitude</th>
                            <th class="px-4 py-2">Radius (m)</th>
                            <th class="px-4 py-2">Jarak (m)</th>
                            <th class="px-4 py-2">Status Radius</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($locations as $loc)
                            <tr data-lat="{{ $loc->latitude }}" data-lng="{{ $loc->longitude }}">
                                <td class="px-4 py-2">{{ $loc->name }}</td>
                                <td class="px-4 py-2">{{ $loc->latitude }}</td>
                                <td class="px-4 py-2">{{ $loc->longitude }}</td>
                                <td class="px-4 py-2">{{ $loc->radius }}</td>
                                <td class="px-4 py-2 distance">-</td>
                                <td class="px-4 py-2 statusRadius">-</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table> --}}
                <table class="w-full text-left table-auto border mt-4" id="locationsTable">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="px-4 py-2">Nama</th>
                            <th class="px-4 py-2">Latitude</th>
                            <th class="px-4 py-2">Longitude</th>
                            <th class="px-4 py-2">Radius (m)</th>
                            <th class="px-4 py-2">Jarak (m)</th>
                            <th class="px-4 py-2">Status Radius</th>
                            <th class="px-4 py-2">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($locations as $loc)
                            <tr data-id="{{ $loc->id }}" data-lat="{{ $loc->latitude }}" data-lng="{{ $loc->longitude }}" data-radius="{{ $loc->radius_meters }}">
                                <td class="px-4 py-2">{{ $loc->name }}</td>
                                <td class="px-4 py-2">{{ $loc->latitude }}</td>
                                <td class="px-4 py-2">{{ $loc->longitude }}</td>
                                <td class="px-4 py-2">{{ $loc->radius_meters }}</td>
                                <td class="px-4 py-2 distance">-</td>
                                <td class="px-4 py-2 statusRadius">-</td>
                                <td class="px-4 py-2 actions">
                                    <form method="POST" action="{{ route('attendance.submit') }}" class="inline-flex gap-1">
                                        @csrf
                                        <input type="hidden" name="latitude" class="formLat">
                                        <input type="hidden" name="longitude" class="formLng">
                                        <input type="hidden" name="location_id" value="{{ $loc->id }}">
                                        <input type="hidden" name="action" class="formAction">
                
                                        <button type="submit" class="bg-green-600 text-white px-2 py-1 rounded text-sm btnCheckIn" onclick="return setAction(this, 'check_in')" disabled>Clock-In</button>
                                        <button type="submit" class="bg-red-600 text-white px-2 py-1 rounded text-sm btnCheckOut" onclick="return setAction(this, 'check_out')" disabled>Clock-Out</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                
            </div>

        </div>
    </div>
</div>
</div>

{{-- <script>
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

window.onload = function () {
    if (!navigator.geolocation) {
        document.getElementById('currentLat').textContent = "Tidak disokong";
        document.getElementById('currentLng').textContent = "Tidak disokong";
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const lat = +position.coords.latitude.toFixed(6);
        const lng = +position.coords.longitude.toFixed(6);

        document.getElementById('currentLat').textContent = lat;
        document.getElementById('currentLng').textContent = lng;

        const rows = document.querySelectorAll('#locationsTable tbody tr');
        rows.forEach(row => {
            const locLat = parseFloat(row.getAttribute('data-lat'));
            const locLng = parseFloat(row.getAttribute('data-lng'));
            const distance = getDistance(lat, lng, locLat, locLng);
            const distanceText = row.querySelector('.distance');
            const statusText = row.querySelector('.statusRadius');

            distanceText.textContent = distance.toFixed(2);

            // Highlight + Status
            if (distance <= 100) {
                row.classList.add('bg-green-100');
                row.classList.remove('bg-red-50');
                statusText.textContent = '✅ Dalam Radius';
            } else {
                row.classList.add('bg-red-50');
                row.classList.remove('bg-green-100');
                statusText.textContent = '❌ Luar Radius';
            }
        });
    }, () => {
        document.getElementById('currentLat').textContent = "Gagal ambil lokasi";
        document.getElementById('currentLng').textContent = "-";
    });
};
</script> --}}
<script>
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function setAction(button, actionType) {
        const form = button.closest('form');
        form.querySelector('.formAction').value = actionType;
        return true; // continue with form submission
    }

    window.onload = function () {
        if (!navigator.geolocation) {
            document.getElementById('currentLat').textContent = "Tidak disokong";
            document.getElementById('currentLng').textContent = "Tidak disokong";
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = +position.coords.latitude.toFixed(6);
            const lng = +position.coords.longitude.toFixed(6);

            document.getElementById('currentLat').textContent = lat;
            document.getElementById('currentLng').textContent = lng;

            const rows = document.querySelectorAll('#locationsTable tbody tr');

            rows.forEach(row => {
                const locLat = parseFloat(row.getAttribute('data-lat'));
                const locLng = parseFloat(row.getAttribute('data-lng'));
                const radius = parseFloat(row.getAttribute('data-radius'));
                const distance = getDistance(lat, lng, locLat, locLng);

                const distanceText = row.querySelector('.distance');
                const statusText = row.querySelector('.statusRadius');
                const checkInBtn = row.querySelector('.btnCheckIn');
                const checkOutBtn = row.querySelector('.btnCheckOut');

                distanceText.textContent = distance.toFixed(2);

                if (distance <= radius) {
                    row.classList.add('bg-green-50');
                    statusText.textContent = '✅ Dalam Radius';
                    checkInBtn.disabled = false;
                    checkOutBtn.disabled = false;

                    const form = row.querySelector('form');
                    form.querySelector('.formLat').value = lat;
                    form.querySelector('.formLng').value = lng;
                } else {
                    row.classList.add('bg-red-50');
                    statusText.textContent = '❌ Luar Radius';
                }
            });
        }, () => {
            document.getElementById('currentLat').textContent = "Gagal ambil lokasi";
            document.getElementById('currentLng').textContent = "-";
        });
    };
</script>
