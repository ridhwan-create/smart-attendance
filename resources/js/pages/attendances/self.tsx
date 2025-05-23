import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Location } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
// Tambahkan import ini di bagian atas file
import { Toaster } from 'react-hot-toast';

interface PageProps {
    userLocation: Location;
    attendanceStatus: {
        hasCheckedIn: boolean;
        hasCheckedOut: boolean;
        checkInTime: string | null;
        checkOutTime: string | null;
    };
}

export default function SelfAttendance({ userLocation, attendanceStatus }: PageProps) {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number | string; lng: number | string }>({ lat: '-', lng: '-' });
    const [distance, setDistance] = useState<number | null>(null);
    const [isInRadius, setIsInRadius] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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

    function handleClock(type: 'check_in' | 'check_out') {
        if (!isInRadius || typeof currentLocation.lat !== 'number' || typeof currentLocation.lng !== 'number') {
            alert('Current location is not valid. Please ensure GPS is enabled and location has been retrieved.');
            return;
        }

        setIsSubmitting(true);

        router.post(route('attendances.store'), {
            type,
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
            distance: distance ?? null,
        }, {
            onSuccess: () => {
                toast.success(`${type === 'check_in' ? 'Clock-In' : 'Clock-Out'} successful.`);
            },
            onError: (errors) => {
                toast.error(Object.values(errors).join('\n'));
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    }

    return (
        <AppLayout>
            <Head title="Employee Dashboard" />
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#ffffff',
                        color: '#333',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        padding: '16px',
                        fontSize: '14px',
                    },
                    success: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        duration: 6000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
            <div className="p-6 space-y-6">
                <div className="p-4 sm:p-6">
                    <Head title="Smart Attendance Registration" />
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h1 className="text-2xl font-bold">Smart Attendance Registration</h1>

                        <div className="p-4 border flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h2 className="font-semibold text-base mb-2">Your Current Location</h2>
                                <p className="text-sm">Latitude: {currentLocation.lat}</p>
                                <p className="text-sm">Longitude: {currentLocation.lng}</p>
                                {attendanceStatus.hasCheckedIn && (
                                    <p className="text-sm mt-2">
                                        Checked in at: {new Date(attendanceStatus.checkInTime || '').toLocaleTimeString()}
                                    </p>
                                )}
                                {attendanceStatus.hasCheckedOut && (
                                    <p className="text-sm mt-1">
                                        Last checked out at: {new Date(attendanceStatus.checkOutTime || '').toLocaleTimeString()}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-6">
                                <div className="text-4xl font-mono">
                                    {currentTime.toLocaleTimeString()}
                                </div>
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

                            <div className="flex flex-col sm:flex-row sm:justify-start gap-3 pt-4">
                                {!attendanceStatus.hasCheckedIn && (
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
                                )}

                                {attendanceStatus.hasCheckedIn && (
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
                                )}

                                <a
                                    href="/employee/dashboard"
                                    className="px-3 py-1.5 text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-200 shadow-sm text-center"
                                >
                                    Back
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}