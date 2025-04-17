import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius_meters: number;
}

export default function AttendanceRegister() {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [status, setStatus] = useState<string>('Mendapatkan lokasi anda...');
    const [isWithinAllowedLocation, setIsWithinAllowedLocation] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        if (latitude !== null && longitude !== null) {
            fetchLocationsAndValidate();
        }
    }, [latitude, longitude]);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                () => {
                    setStatus('Gagal mendapatkan lokasi. Pastikan anda membenarkan akses lokasi.');
                }
            );
        } else {
            setStatus('Browser anda tidak menyokong geolocation.');
        }
    };

    const fetchLocationsAndValidate = async () => {
        try {
            const response = await fetch('/get-locations');
            const data = await response.json();
            setLocations(data);

            const withinLocation = data.some((loc: Location) => {
                const distance = getDistance(
                    latitude!,
                    longitude!,
                    loc.latitude,
                    loc.longitude
                );
                return distance <= loc.radius_meters;
            });

            setIsWithinAllowedLocation(withinLocation);
            setStatus(
                withinLocation
                    ? 'Anda berada dalam kawasan yang dibenarkan.'
                    : 'Anda berada di luar kawasan yang dibenarkan.'
            );
        } catch (error) {
            setStatus('Ralat semasa mendapatkan lokasi dibenarkan.');
        }
    };

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleSubmit = (action: 'check_in' | 'check_out') => {
        router.post('/attendances/record', {
            latitude,
            longitude,
            action,
        });
    };

    return (
        <AppLayout>
            <Head title="Daftar Kehadiran" />
            <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
                <h1 className="text-xl font-semibold mb-4">Daftar Kehadiran</h1>
                <p className={`mb-2 ${isWithinAllowedLocation ? 'text-green-600' : 'text-red-600'}`}>
                    {status}
                </p>
                <p className="text-gray-600">Latitude: <span className="font-medium">{latitude ?? '-'}</span></p>
                <p className="text-gray-600 mb-4">Longitude: <span className="font-medium">{longitude ?? '-'}</span></p>

                <div className="flex gap-4">
                    <Button
                        disabled={!isWithinAllowedLocation}
                        className="bg-green-600 text-white"
                        onClick={() => handleSubmit('check_in')}
                    >
                        Daftar Masuk
                    </Button>
                    <Button
                        disabled={!isWithinAllowedLocation}
                        className="bg-red-600 text-white"
                        onClick={() => handleSubmit('check_out')}
                    >
                        Daftar Keluar
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
