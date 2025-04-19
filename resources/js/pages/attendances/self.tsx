import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Location } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';

// Props jenis dari server
interface PageProps {
    userLocation: Location;
}

export default function SelfAttendance({ userLocation }: PageProps) {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number | string; lng: number | string }>({ lat: '-', lng: '-' });
    const [distance, setDistance] = useState<number | null>(null);
    const [isInRadius, setIsInRadius] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setCurrentLocation({ lat: 'Tidak disokong', lng: 'Tidak disokong' });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = +position.coords.latitude.toFixed(6);
                const lng = +position.coords.longitude.toFixed(6);
                setCurrentLocation({ lat, lng });

                const calculatedDistance = getDistance(lat, lng, userLocation.latitude, userLocation.longitude);
                setDistance(calculatedDistance);
                setIsInRadius(calculatedDistance <= userLocation.radius_meters);
            },
            () => {
                setCurrentLocation({ lat: 'Gagal ambil lokasi', lng: '-' });
            }
        );
    }, [userLocation]);

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

    // function handleClock(type: 'check_in' | 'check_out') {
    //     if (!isInRadius || typeof currentLocation.lat !== 'number' || typeof currentLocation.lng !== 'number') {
    //         alert('Location not valid or out of radius.');
    //         return;
    //     }
    
    //     router.post(route('attendances.store'), {
    //         type,
    //         lat: currentLocation.lat,
    //         lng: currentLocation.lng,
    //         distance: distance ?? null,
    //     }, {
    //         onSuccess: () => {
    //             alert(`${type === 'check_in' ? 'Clock-In' : 'Clock-Out'} successful.`);
    //         },
    //         onError: (errors) => {
    //             alert(Object.values(errors).join('\n'));
    //         }
    //     });
    // }
    function handleClock(type: 'check_in' | 'check_out') {
        if (!isInRadius || typeof currentLocation.lat !== 'number' || typeof currentLocation.lng !== 'number') {
            alert('Current location is not valid. Please ensure GPS is enabled and location has been retrieved.');
            return;
        }
    
        setIsSubmitting(true);
    
        router.post(route('attendances.store'), {
            type,
            latitude: currentLocation.lat, // ubah dari lat -> latitude
            longitude: currentLocation.lng, // ubah dari lng -> longitude
            distance: distance ?? null,
        }, {
            onSuccess: () => {
                alert(`${type === 'check_in' ? 'Clock-In' : 'Clock-Out'} successful.`);
            },
            onError: (errors) => {
                alert(Object.values(errors).join('\n'));
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    }     
    

    return (
        <div className="p-4 sm:p-6">
            <Head title="Smart Attendance Registration" />
            <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">Smart Attendance Registration</h1>

                {/* <div className="p-4 border">
                    <h2 className="font-semibold mb-2">Your Current Location</h2>
                    <p>Latitude: {currentLocation.lat}</p>
                    <p>Longitude: {currentLocation.lng}</p>
                </div> */}
                <div className="p-4 border flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
                    <div>
                        <h2 className="font-semibold text-base mb-2">Your Current Location</h2>
                        <p className="text-sm">Latitude: {currentLocation.lat}</p>
                        <p className="text-sm">Longitude: {currentLocation.lng}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6">
                    {isInRadius ? (
                        <CheckCircle className="text-green-600 w-16 h-16" />
                    ) : (
                        <XCircle className="text-red-600 w-16 h-16" />
                    )}
                    </div>
                </div>

                <div className="p-4 border rounded">
                    <h2 className="font-semibold mb-4">Your Office Location</h2>
                    <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="font-medium py-2 w-1/3">Location Name</td>
                                <td className="py-2">{userLocation.name}</td>
                            </tr>
                            <tr>
                                <td className="font-medium py-2">Latitude</td>
                                <td className="py-2">{userLocation.latitude}</td>
                            </tr>
                            <tr>
                                <td className="font-medium py-2">Longitude</td>
                                <td className="py-2">{userLocation.longitude}</td>
                            </tr>
                            <tr>
                                <td className="font-medium py-2">Allowed Radius</td>
                                <td className="py-2">{userLocation.radius_meters} meters</td>
                            </tr>
                            <tr>
                                <td className="font-medium py-2">Current Distance</td>
                                <td className="py-2">
                                    {distance 
                                        ? `${distance.toFixed(2)} m (${(distance / 1000).toFixed(3)} km)` 
                                        : '-'}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-medium py-2">Radius Status</td>
                                {/* <td className="py-2">{isInRadius ? '✅ Within radius' : '❌ Outside radius'}</td> */}
                                <td className="py-2">
                                    {isInRadius ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-6 h-6" />
                                            <span className="font-medium">Within radius</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <XCircle className="w-6 h-6" />
                                            <span className="font-medium">Outside radius</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    {/* <div className="flex flex-col sm:flex-row sm:justify-start gap-3 pt-4">
                        <button
                            onClick={() => handleClock('check_in')}
                            disabled={!isInRadius}
                            className={`px-3 py-1.5 text-sm font-medium  transition-colors duration-200 shadow-sm 
                                ${isInRadius 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Clock-In
                        </button>
                        <button
                            onClick={() => handleClock('check_out')}
                            disabled={!isInRadius}
                            className={`px-3 py-1.5 text-sm font-medium  transition-colors duration-200 shadow-sm 
                                ${isInRadius 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Clock-Out
                        </button>
                    </div> */}
                    <div className="flex flex-col sm:flex-row sm:justify-start gap-3 pt-4">
                        <button
                            onClick={() => handleClock('check_in')}
                            disabled={!isInRadius || isSubmitting}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 shadow-sm 
                                ${isInRadius 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                ${isSubmitting ? 'opacity-60 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? 'Processing...' : 'Clock-In'}
                        </button>

                        <button
                            onClick={() => handleClock('check_out')}
                            disabled={!isInRadius || isSubmitting}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 shadow-sm 
                                ${isInRadius 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                ${isSubmitting ? 'opacity-60 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? 'Processing...' : 'Clock-Out'}
                        </button>
                    </div>

                </div>



            </div>
        </div>
    );
}
