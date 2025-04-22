import { Head, Link, useForm } from '@inertiajs/react';
import { Location, PaginatedData } from '@/types';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/pagination';

type PageProps = {
    locations: PaginatedData<Location>;
    filters: {
        search: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Location & Distance Check', href: '/LocationCheck' },
];

export default function LocationCheck({ locations, filters }: PageProps) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        get(route('location.check'), {
            preserveState: true,
            preserveScroll: true,
            only: ['locations'],
        });
    };
    
    const [currentLocation, setCurrentLocation] = useState<{ lat: number | string; lng: number | string }>({ lat: '-', lng: '-' });
    const [distances, setDistances] = useState<Record<number, { distance: number; status: string }>>({});
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const [isInRadius, setIsInRadius] = useState<boolean>(false);
    


    useEffect(() => {
        if (!navigator.geolocation) {
            setCurrentLocation({ lat: "Not supported", lng: "Not supported" });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = +position.coords.latitude.toFixed(6);
                const lng = +position.coords.longitude.toFixed(6);
                setCurrentLocation({ lat, lng });

                const newDistances: Record<number, { distance: number; status: string }> = {};
                locations.data.forEach(loc => {
                    const distance = getDistance(lat, lng, loc.latitude, loc.longitude);
                    newDistances[loc.id] = {
                        distance,
                        status: distance <= loc.radius_meters ? 'Within Radius' : 'Outside Radius'
                    };
                });
                setDistances(newDistances);

                if (selectedLocation) {
                    setIsInRadius(newDistances[selectedLocation]?.status === 'Within Radius');
                }
            },
            () => {
                setCurrentLocation({ lat: "Failed to get location", lng: "-" });
            }
        );
    }, [locations.data, selectedLocation]);

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
        setIsInRadius(distances[locationId]?.status === 'Within Radius');
    }

    function handleClockIn() {
        alert(`Clock-In successful for location ID: ${selectedLocation}`);
    }

    function handleClockOut() {
        alert(`Clock-Out successful for location ID: ${selectedLocation}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Location & Distance Check" />

            <div className="p-4 space-y-4">
                    <h2 className="font-semibold text-xl leading-tight">
                        Location & Distance Check
                    </h2>

                    {/* Search Form */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <Input
                        name="search"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Search location name..."
                        className="max-w-sm"
                    />
                    <Button type="submit">Search</Button>
                </form>

                    {/* Current User Location */}
                    <div className="py-6 space-y-2">
                        <h3 className="text-lg font-semibold">Current User Location</h3>
                        <p>Latitude: <span>{currentLocation.lat}</span></p>
                        <p>Longitude: <span>{currentLocation.lng}</span></p>
                    </div>

                    {/* Location List */}
                    <h3 className="text-lg font-semibold">Location List in System</h3>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left table-auto border mt-4 text-sm">
                            <thead className="bg-muted sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Latitude</th>
                                    <th className="px-4 py-2">Longitude</th>
                                    <th className="px-4 py-2">Radius (m)</th>
                                    <th className="px-4 py-2">Distance (m)</th>
                                    <th className="px-4 py-2">Radius Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {locations.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                                            No locations found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    locations.data.map((loc, index) => (
                                        <tr key={loc.id}>
                                            <td className="px-4 py-2">{(locations.from ?? 0) + index}</td>
                                            <td className="px-4 py-2 break-words">{loc.name}</td>
                                            <td className="px-4 py-2">{loc.latitude}</td>
                                            <td className="px-4 py-2">{loc.longitude}</td>
                                            <td className="px-4 py-2">{loc.radius_meters}</td>
                                            <td className="px-4 py-2">
                                                {distances[loc.id]?.distance ? distances[loc.id].distance.toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-2 flex items-center space-x-1">
                                                {distances[loc.id]?.status === 'Within Radius' ? (
                                                    <>
                                                        <CheckCircle className="text-green-500 w-7 h-7" />
                                                        <span className="text-green-500">Within Radius</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="text-red-500 w-7 h-7" />
                                                        <span className="text-red-500">Outside Radius</span>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4">
                        <Pagination links={locations.links} />
                    </div>

                    {/* Clock-In/Out Section */}
                    {selectedLocation && (
                        <div className="border rounded p-4 bg-purple-50 space-y-4 text-gray-900 mt-4">
                            <h3 className="text-lg font-semibold">Action</h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <p>
                                    Selected Location:{' '}
                                    <span className="font-medium">
                                        {locations.data.find(loc => loc.id === selectedLocation)?.name}
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
                                    You need to be within the radius to perform Clock-In/Out
                                </p>
                            )}
                        </div>
                    )}
            </div>
        </AppLayout>
    );
}