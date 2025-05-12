import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import type { BreadcrumbItem } from '@/types';
import type { Role } from '@/types/role';
import type { PaginatedData } from '@/types/pagination';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
];

type PageProps = {
    roles: PaginatedData<Role>;
    filters: {
        search: string;
    };
    permissions: string[];
};

export default function RoleIndex({ roles, filters, permissions }: PageProps) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        get(route('roles.index'), {
            preserveState: true,
            preserveScroll: true,
            only: ['roles'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Role Management</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href={route('roles.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Role
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <Input
                        name="search"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Search role name..."
                        className="max-w-sm"
                    />
                    <Button type="submit">Search</Button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                        <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">#</th>
                                <th className="p-3">Role Name</th>
                                <th className="p-3">Permissions</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No roles found.
                                    </td>
                                </tr>
                            ) : (
                                roles.data.map((role, index) => (
                                    <tr key={role.id} className="border-t text-sm">
                                        <td className="p-3">{(roles.from ?? 0) + index}</td>
                                        <td className="p-3 font-medium">{role.name}</td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions?.map((permission) => (
                                                    <span 
                                                        key={permission.id}
                                                        className="px-2 py-1 bg-muted text-xs rounded"
                                                    >
                                                        {permission.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-3 space-x-2 flex gap-2">
                                            <Link
                                                href={route('roles.edit', role.id)}
                                                className="text-yellow-600 hover:underline"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={roles.links} />
            </div>
        </AppLayout>
    );
}