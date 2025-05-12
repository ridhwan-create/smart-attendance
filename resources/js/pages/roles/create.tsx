import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
    { title: 'Create Role', href: '/roles/create' },
];

type PageProps = {
    permissions: {
        id: number;
        name: string;
    }[];
};

export default function RoleCreate({ permissions }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    const togglePermission = (permissionName: string) => {
        setData('permissions', 
            data.permissions.includes(permissionName)
                ? data.permissions.filter(p => p !== permissionName)
                : [...data.permissions, permissionName]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Create New Role</h1>
                    <Button asChild variant="secondary" className="rounded p-3">
                        <Link href={route('roles.index')}>
                            Back to Roles
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                            Role Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter role name"
                            className="w-full max-w-md"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Permissions
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`permission-${permission.id}`}
                                        checked={data.permissions.includes(permission.name)}
                                        onCheckedChange={() => togglePermission(permission.name)}
                                    />
                                    <label
                                        htmlFor={`permission-${permission.id}`}
                                        className="text-sm font-medium leading-none"
                                    >
                                        {permission.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && <p className="text-sm text-red-500">{errors.permissions}</p>}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Role'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}