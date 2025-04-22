import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import type { BreadcrumbItem, Location } from '@/types';
import type { PaginatedData } from '@/types/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Locations', href: '/locations' },
];

type PageProps = {
    locations: PaginatedData<Location>;
    filters: {
        search: string;
    };
};

export default function LocationIndex({ locations, filters }: PageProps) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        get(route('locations.index'), {
            preserveState: true,
            preserveScroll: true,
            only: ['locations'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Locations" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Locations</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href={route('locations.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Location
                        </Link>
                    </Button>
                </div>

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

                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                        <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">#</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Latitude</th>
                                <th className="p-3">Longitude</th>
                                <th className="p-3">Radius (m)</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        No locations found.
                                    </td>
                                </tr>
                            ) : (
                                locations.data.map((location, index) => (
                                    <tr key={location.id} className="border-t text-sm">
                                        <td className="p-3">{(locations.from ?? 0) + index}</td>
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

                <Pagination links={locations.links} />
            </div>
        </AppLayout>
    );
}
