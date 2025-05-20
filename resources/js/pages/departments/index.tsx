import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import type { BreadcrumbItem, Department } from '@/types';
import type { PaginatedData } from '@/types/pagination';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Departments', href: '/departments' },
];

type PageProps = {
    departments: PaginatedData<Department & { company: { company_name: string } }>;
    filters: {
        search: string;
    };
};

export default function DepartmentIndex({ departments, filters }: PageProps) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    const { auth } = usePage().props as any;
    const userPermissions: string[] = auth?.permissions ?? [];

    const canCreate = userPermissions.includes('create departments');
    const canEdit = userPermissions.includes('edit departments');
    // const canDelete = userPermissions.includes('delete departments');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        get(route('departments.index'), {
            preserveState: true,
            preserveScroll: true,
            only: ['departments'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Departments</h1>
                    {canCreate && (
                        <Button asChild variant="success" className="rounded p-3">
                            <Link href={route('departments.create')}>
                                + Add Department
                            </Link>
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <Input
                        name="search"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Search department name..."
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
                                <th className="p-3">Company</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No departments found.
                                    </td>
                                </tr>
                            ) : (
                                departments.data.map((department, index) => (
                                    <tr key={department.id} className="border-t text-sm">
                                        <td className="p-3">{(departments.from ?? 0) + index}</td>
                                        <td className="p-3">{department.name}</td>
                                        <td className="p-3">{department.company?.company_name}</td>
                                        <td className="p-3 space-x-2 flex gap-2">
                                            <Link
                                                href={route('departments.show', department.id)}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            {canEdit && (
                                                <Link
                                                    href={route('departments.edit', department.id)}
                                                    className="text-yellow-600 hover:underline"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={departments.links} />
            </div>
        </AppLayout>
    );
}
