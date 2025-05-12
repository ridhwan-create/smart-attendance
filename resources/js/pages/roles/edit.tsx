import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { BreadcrumbItem } from '@/types';
import type { Role } from '@/types/role';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
    { title: 'Edit Role', href: '/roles/edit' },
];

type PageProps = {
    role: Role & {
        permissions: {
            id: number;
            name: string;
        }[];
    };
    allPermissions: {
        id: number;
        name: string;
    }[];
};

export default function RoleEdit({ role, allPermissions }: PageProps) {
    // const { data, setData, put, processing, errors } = useForm({
    //     name: role.name,
    //     permissions: role.permissions.map(p => p.name),
    // });

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map(p => p.id), // Simpan ID bukan nama
    });
    
    const togglePermission = (permissionId: number) => {
        setData('permissions', 
            data.permissions.includes(permissionId)
                ? data.permissions.filter(p => p !== permissionId)
                : [...data.permissions, permissionId]
        );
    };
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    // const togglePermission = (permissionName: string) => {
    //     setData('permissions', 
    //         data.permissions.includes(permissionName)
    //             ? data.permissions.filter(p => p !== permissionName)
    //             : [...data.permissions, permissionName]
    //     );
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Role: {role.name}</h1>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                            {allPermissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                    {/* <Checkbox
                                        id={`permission-${permission.id}`}
                                        checked={data.permissions.includes(permission.name)}
                                        onCheckedChange={() => togglePermission(permission.name)}
                                    /> */}
                                    <Checkbox
                                        id={`permission-${permission.id}`}
                                        checked={data.permissions.includes(permission.id)} // Bandingkan ID
                                        onCheckedChange={() => togglePermission(permission.id)} // Hantar ID
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

                    <div className="flex justify-end gap-2">
                        <Button asChild variant="destructive">
                            <Link 
                                href={route('roles.destroy', role.id)} 
                                method="delete"
                                as="button"
                                onClick={(e) => {
                                    if (!confirm('Are you sure you want to delete this role?')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Delete Role
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Role'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}