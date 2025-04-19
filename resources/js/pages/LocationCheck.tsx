import { Head, Link } from '@inertiajs/react';
import { Location } from '@/types';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type PageProps = {
    locations: Location[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Semakan Lokasi & Jarak', href: '/LocationCheck' },
];

export default function LocationCheck({ locations }: PageProps) {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number | string; lng: number | string }>({ lat: '-', lng: '-' });
    const [distances, setDistances] = useState<Record<number, { distance: number; status: string }>>({});
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const [isInRadius, setIsInRadius] = useState<boolean>(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setCurrentLocation({ lat: "Tidak disokong", lng: "Tidak disokong" });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = +position.coords.latitude.toFixed(6);
                const lng = +position.coords.longitude.toFixed(6);
                setCurrentLocation({ lat, lng });

                const newDistances: Record<number, { distance: number; status: string }> = {};
                locations.forEach(loc => {
                    const distance = getDistance(lat, lng, loc.latitude, loc.longitude);
                    newDistances[loc.id] = {
                        distance,
                        status: distance <= loc.radius_meters ? 'Dalam Radius' : 'Luar Radius'
                    };
                });
                setDistances(newDistances);

                if (selectedLocation) {
                    setIsInRadius(newDistances[selectedLocation]?.status === 'Dalam Radius');
                }
            },
            () => {
                setCurrentLocation({ lat: "Gagal ambil lokasi", lng: "-" });
            }
        );
    }, [locations, selectedLocation]);

    function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function handleLocationSelect(locationId: number) {
        setSelectedLocation(locationId);
        setIsInRadius(distances[locationId]?.status === 'Dalam Radius');
    }

    function handleClockIn() {
        alert(`Clock-In berjaya untuk lokasi ID: ${selectedLocation}`);
    }

    function handleClockOut() {
        alert(`Clock-Out berjaya untuk lokasi ID: ${selectedLocation}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semakan Lokasi & Jarak" />

                <div className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        
                            
                            
                                <h2 className="font-semibold text-xl leading-tight">
                                    Semakan Lokasi & Jarak
                                </h2>

                                {/* Lokasi Semasa Pengguna */}
                                <div className="py-6 space-y-2">
                                    <h3 className="text-lg font-semibold">Lokasi Semasa Pengguna</h3>
                                    <p>Latitude: <span>{currentLocation.lat}</span></p>
                                    <p>Longitude: <span>{currentLocation.lng}</span></p>
                                </div>

                                {/* Senarai Lokasi */}
                                
                                    <h3 className="text-lg font-semibold">Senarai Lokasi Dalam Sistem</h3>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left table-auto border mt-4 text-sm">
                                            <thead className="bg-muted sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-4 py-2">Nama</th>
                                                    <th className="px-4 py-2">Latitude</th>
                                                    <th className="px-4 py-2">Longitude</th>
                                                    <th className="px-4 py-2">Radius (m)</th>
                                                    <th className="px-4 py-2">Jarak (m)</th>
                                                    <th className="px-4 py-2">Status Radius</th>
                                                    <th className="px-4 py-2">Tindakan</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-gray-900'>
                                                {locations.map((loc) => (
                                                    <tr
                                                        key={loc.id}
                                                        className={distances[loc.id]?.status === 'Dalam Radius' ? 'bg-green-100' : 'bg-red-50'}
                                                    >
                                                        <td className="px-4 py-2 break-words">{loc.name}</td>
                                                        <td className="px-4 py-2">{loc.latitude}</td>
                                                        <td className="px-4 py-2">{loc.longitude}</td>
                                                        <td className="px-4 py-2">{loc.radius_meters}</td>
                                                        <td className="px-4 py-2">
                                                            {distances[loc.id]?.distance ? distances[loc.id].distance.toFixed(2) : '-'}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {distances[loc.id]?.status === 'Dalam Radius'
                                                                ? '✅ Dalam Radius'
                                                                : '❌ Luar Radius'}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <button
                                                                onClick={() => handleLocationSelect(loc.id)}
                                                                className={`px-3 py-1 rounded text-sm ${selectedLocation === loc.id
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-gray-200'
                                                                    }`}
                                                            >
                                                                Pilih
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                

                                {/* Clock-In/Out Section */}
                                {selectedLocation && (
                                    <div className="border rounded p-4 bg-purple-50 space-y-4 text-gray-900">
                                        <h3 className="text-lg font-semibold">Tindakan</h3>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            <p>
                                                Lokasi Terpilih:{' '}
                                                <span className="font-medium">
                                                    {locations.find(loc => loc.id === selectedLocation)?.name}
                                                </span>
                                            </p>

                                            <button
                                                onClick={handleClockIn}
                                                disabled={!isInRadius}
                                                className={`px-4 py-2 rounded text-white text-sm ${isInRadius
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                Clock-In
                                            </button>

                                            <button
                                                onClick={handleClockOut}
                                                disabled={!isInRadius}
                                                className={`px-4 py-2 rounded text-white text-sm ${isInRadius
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                Clock-Out
                                            </button>
                                        </div>
                                        {!isInRadius && (
                                            <p className="text-red-500 text-sm">
                                                Anda perlu berada dalam radius untuk melakukan Clock-In/Out
                                            </p>
                                        )}
                                    </div>
                                )}
                            
                            
                        
                    </div>
                </div>

        </AppLayout>
    );
}
