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

                // Calculate distances
                const newDistances: Record<number, { distance: number; status: string }> = {};
                locations.forEach(loc => {
                    const distance = getDistance(lat, lng, loc.latitude, loc.longitude);
                    newDistances[loc.id] = {
                        distance,
                        status: distance <= loc.radius_meters ? 'Dalam Radius' : 'Luar Radius'
                    };
                });
                setDistances(newDistances);
            },
            () => {
                setCurrentLocation({ lat: "Gagal ambil lokasi", lng: "-" });
            }
        );
    }, [locations]);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                <Head title="Semakan Lokasi & Jarak" />

                <div className="py-12">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 space-y-6">
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                    Semakan Lokasi & Jarak
                                </h2>

                                {/* Lokasi Semasa Pengguna */}
                                <div className="border rounded p-4 bg-blue-50 space-y-2">
                                    <h3 className="text-lg font-semibold">Lokasi Semasa Pengguna</h3>
                                    <p>Latitude: <span>{currentLocation.lat}</span></p>
                                    <p>Longitude: <span>{currentLocation.lng}</span></p>
                                </div>

                                {/* Senarai Lokasi */}
                                <div className="border rounded p-4 bg-gray-50 space-y-2">
                                    <h3 className="text-lg font-semibold">Senarai Lokasi Dalam Sistem</h3>

                                    <table className="w-full text-left table-auto border mt-4">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="px-4 py-2">Nama</th>
                                                <th className="px-4 py-2">Latitude</th>
                                                <th className="px-4 py-2">Longitude</th>
                                                <th className="px-4 py-2">Radius (m)</th>
                                                <th className="px-4 py-2">Jarak (m)</th>
                                                <th className="px-4 py-2">Status Radius</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {locations.map((loc) => (
                                                <tr 
                                                    key={loc.id} 
                                                    className={distances[loc.id]?.status === 'Dalam Radius' ? 'bg-green-100' : 'bg-red-50'}
                                                >
                                                    <td className="px-4 py-2">{loc.name}</td>
                                                    <td className="px-4 py-2">{loc.latitude}</td>
                                                    <td className="px-4 py-2">{loc.longitude}</td>
                                                    <td className="px-4 py-2">{loc.radius_meters}</td>
                                                    <td className="px-4 py-2">
                                                        {distances[loc.id]?.distance ? distances[loc.id].distance.toFixed(2) : '-'}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {distances[loc.id]?.status === 'Dalam Radius' ? '✅ Dalam Radius' : '❌ Luar Radius'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
        </AppLayout>
    );
}