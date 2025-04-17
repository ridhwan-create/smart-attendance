import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Locations', href: '/locations' },
    { title: 'Create', href: '/locations/create' },
];

export default function LocationCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        radius_meters: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('locations.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Location" />

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
                                    tabIndex={1}
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
                                    tabIndex={2}
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
                                    tabIndex={3}
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
                                    tabIndex={4}
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
                                    tabIndex={5}
                                    value={data.radius_meters}
                                    onChange={(e) => setData('radius_meters', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.radius_meters} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={6} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Save Location
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
