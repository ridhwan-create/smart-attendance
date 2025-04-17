// src/pages/departments/index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";

type Department = {
    id: number;
    name: string;
    company_id: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Departments', href: '/departments' },
];

export default function DepartmentIndex() {
    const { departments } = usePage<{ departments: Department[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">Departments</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href="/departments/create">
                            + Add Department
                        </Link>
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border">
                        <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">ID</th>
                                <th className="p-3">Department Name</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department: any) => (
                                <tr key={department.id} className="border-t text-sm">
                                    <td className="p-3">{department.id}</td>
                                    <td className="p-3">{department.name}</td>
                                    <td className="p-3">{department.company_id}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/departments/${department.id}/edit`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={route('departments.show', department.id)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
