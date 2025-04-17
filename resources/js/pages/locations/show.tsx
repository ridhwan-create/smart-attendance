import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Location } from '@/types';
import { Badge } from '@/components/ui/badge';

interface Props {
    location: Location;
}

export default function LocationShow({ location }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Locations', href: '/locations' },
        { title: location.name, href: `/locations/${location.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={location.name} />

            <div className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <div>
                        <h2 className="text-xl font-semibold">{location.name}</h2>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Latitude:</span>
                            <div className="font-medium">{location.latitude}</div>
                        </div>

                        <div>
                            <span className="text-muted-foreground">Longitude:</span>
                            <div className="font-medium">{location.longitude}</div>
                        </div>

                        <div>
                            <span className="text-muted-foreground">Radius (meters):</span>
                            <div className="font-medium">{location.radius_meters}</div>
                        </div>

                        <div>
                            <span className="text-muted-foreground">Created By:</span>
                            <div className="font-medium">{location.created_by}</div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Badge variant="outline">ID: {location.id}</Badge>
                    </div>
                </div>

        </AppLayout>
    );
}
