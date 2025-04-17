import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Location } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Locations', href: '/locations' },
];

type PageProps = {
    locations: Location[];
};

export default function LocationIndex({ locations }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Locations" />
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">Locations</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href={route('locations.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Location
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                    <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">Name</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Latitude</th>
                                <th className="p-3">Longitude</th>
                                <th className="p-3">Radius (m)</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No locations found.
                                    </td>
                                </tr>
                            ) : (
                                locations.map((location) => (
                                    <tr key={location.id} className="border-t text-sm">
                                        <td className="p-3">{location.name}</td>
                                        <td className="p-3">{location.address}</td>
                                        <td className="p-3">{location.latitude}</td>
                                        <td className="p-3">{location.longitude}</td>
                                        <td className="p-3">{location.radius_meters}</td>
                                        <td className="p-3 space-x-2">
                                            <Link
                                                href={route('locations.show', location.id)}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route('locations.edit', location.id)}
                                                className="text-yellow-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
