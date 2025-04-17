
<div class="py-12">
    <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6 text-gray-900 space-y-6">

                <h2 class="text-xl font-semibold">Daftar Kehadiran</h2>

                <!-- Status Lokasi -->
                <div class="p-4 border rounded space-y-2 bg-gray-50">
                    <p id="locationStatus" class="text-gray-600">Mendapatkan lokasi anda...</p>
                    <p>Latitude: <span id="latDisplay" class="font-medium">-</span></p>
                    <p>Longitude: <span id="lngDisplay" class="font-medium">-</span></p>
                </div>

                <!-- Butang Daftar -->
                <form id="attendanceForm" method="POST" action="{{ route('attendance.submit') }}">
                    @csrf
                    <input type="text" name="latitude" id="latitude">
                    <input type="text" name="longitude" id="longitude">
                    <input type="text" name="location_id" id="location_id">
                    <input type="text" name="action" id="action">

                    <div class="flex gap-4 mt-4">
                        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded" id="checkInBtn" disabled onclick="setAction('check_in')">Daftar Masuk</button>
                        <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded" id="checkOutBtn" disabled onclick="setAction('check_out')">Daftar Keluar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    const locations = @json($locations);

    function setAction(action) {
        document.getElementById('action').value = action;
    }

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

    function checkUserLocation() {
        if (!navigator.geolocation) {
            document.getElementById('locationStatus').textContent = "Browser tidak menyokong geolocation.";
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;
            document.getElementById('latDisplay').textContent = lat;
            document.getElementById('lngDisplay').textContent = lng;

            let matched = false;

            for (const loc of locations) {
                const dist = getDistance(lat, lng, loc.latitude, loc.longitude);
                if (dist <= loc.radius) {
                    document.getElementById('locationStatus').textContent = `Anda berada dalam kawasan ${loc.name}.`;
                    document.getElementById('location_id').value = loc.id;
                    document.getElementById('checkInBtn').disabled = false;
                    document.getElementById('checkOutBtn').disabled = false;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                document.getElementById('locationStatus').textContent = 'Anda berada di luar kawasan yang dibenarkan.';
                document.getElementById('checkInBtn').disabled = true;
                document.getElementById('checkOutBtn').disabled = true;
            }
        }, () => {
            document.getElementById('locationStatus').textContent = 'Gagal mendapatkan lokasi. Sila benarkan akses lokasi.';
        });
    }

    window.onload = checkUserLocation;
</script>

