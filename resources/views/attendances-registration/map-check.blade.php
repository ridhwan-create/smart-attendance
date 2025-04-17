
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Semakan Lokasi & Daftar Kehadiran
        </h2>


    <div class="py-12">
        <div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 space-y-6">

                    <!-- Lokasi Semasa Pengguna -->
                    <div class="border rounded p-4 bg-blue-50 space-y-2">
                        <h3 class="text-lg font-semibold">Lokasi Semasa Pengguna</h3>
                        <p>Latitude: <span id="currentLat">-</span></p>
                        <p>Longitude: <span id="currentLng">-</span></p>
                    </div>

                    <!-- Butang Kehadiran -->
                    <form method="POST" action="{{ route('attendance.submit') }}" id="clockForm">
                        @csrf
                        <input type="hidden" name="latitude" id="formLat">
                        <input type="hidden" name="longitude" id="formLng">
                        <input type="hidden" name="location_id" id="formLocationId">
                        <input type="hidden" name="action" id="formAction">

                        <div class="flex gap-4 mt-4">
                            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled id="btnCheckIn" onclick="setAction('check_in')">
                                Clock-In
                            </button>
                            <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled id="btnCheckOut" onclick="setAction('check_out')">
                                Clock-Out
                            </button>
                        </div>
                    </form>

                    <!-- Senarai Lokasi -->
                    <div class="border rounded p-4 bg-gray-50 space-y-2">
                        <h3 class="text-lg font-semibold">Senarai Lokasi Dalam Sistem</h3>

                        <table class="w-full text-left table-auto border mt-4" id="locationsTable">
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
                                    <tr data-id="{{ $loc->id }}" data-lat="{{ $loc->latitude }}" data-lng="{{ $loc->longitude }}" data-radius="{{ $loc->radius_meters }}">
                                        <td class="px-4 py-2">{{ $loc->name }}</td>
                                        <td class="px-4 py-2">{{ $loc->latitude }}</td>
                                        <td class="px-4 py-2">{{ $loc->longitude }}</td>
                                        <td class="px-4 py-2">{{ $loc->radius_meters }}</td>
                                        <td class="px-4 py-2 distance">-</td>
                                        <td class="px-4 py-2 statusRadius">-</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    </div>

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

        function setAction(action) {
            document.getElementById('formAction').value = action;
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

                // Untuk form
                document.getElementById('formLat').value = lat;
                document.getElementById('formLng').value = lng;

                const rows = document.querySelectorAll('#locationsTable tbody tr');
                let matchedLocationId = null;

                rows.forEach(row => {
                    const locLat = parseFloat(row.getAttribute('data-lat'));
                    const locLng = parseFloat(row.getAttribute('data-lng'));
                    const radius = parseFloat(row.getAttribute('data-radius'));
                    const distance = getDistance(lat, lng, locLat, locLng);

                    const distanceText = row.querySelector('.distance');
                    const statusText = row.querySelector('.statusRadius');

                    distanceText.textContent = distance.toFixed(2);

                    if (distance <= radius) {
                        row.classList.add('bg-green-100');
                        row.classList.remove('bg-red-50');
                        statusText.textContent = '✅ Dalam Radius';
                        matchedLocationId = row.getAttribute('data-id');
                    } else {
                        row.classList.add('bg-red-50');
                        row.classList.remove('bg-green-100');
                        statusText.textContent = '❌ Luar Radius';
                    }
                });

                // Enable button jika ada lokasi match
                if (matchedLocationId) {
                    document.getElementById('formLocationId').value = matchedLocationId;
                    document.getElementById('btnCheckIn').disabled = false;
                    document.getElementById('btnCheckOut').disabled = false;
                } else {
                    document.getElementById('btnCheckIn').disabled = true;
                    document.getElementById('btnCheckOut').disabled = true;
                }

            }, () => {
                document.getElementById('currentLat').textContent = "Gagal ambil lokasi";
                document.getElementById('currentLng').textContent = "-";
            });
        };
    </script>