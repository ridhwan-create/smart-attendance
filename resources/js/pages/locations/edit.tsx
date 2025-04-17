import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Location } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';

interface Props {
    location: Location;
}

export default function LocationEdit({ location }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: location.name ?? '',
        address: location.address ?? '',
        latitude: location.latitude ?? '',
        longitude: location.longitude ?? '',
        radius_meters: location.radius_meters ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Locations', href: '/locations' },
        { title: 'Edit', href: `/locations/${location.id}/edit` },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('locations.update', location.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Location" />

            <div className="w-full max-w-lg">
                <div className="px-4 py-6">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.latitude} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.longitude} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="radius_meters">Radius (meters)</Label>
                                <Input
                                    id="radius_meters"
                                    type="number"
                                    min="0"
                                    value={data.radius_meters}
                                    onChange={(e) => setData('radius_meters', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.radius_meters} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Update Location
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
