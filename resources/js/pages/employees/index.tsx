import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDelete from '@/components/confirm-delete';
import { useCallback } from 'react';
import { Plus } from 'lucide-react';

interface Props {
    employees: Employee[];
}

export default function EmployeeIndex({ employees }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Employees', href: '/employees' },
    ];

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
    if (deleteId !== null) {
        router.delete(route('employees.destroy', deleteId));
    }
    setConfirmOpen(false);
    setDeleteId(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />

        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold">Employees</h1>
                <Button asChild variant={"success"} className="rounded p-3">
                    <Link href={route('employees.create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee</Link>
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border rounded-md">
                    <thead>
                        <tr className="text-left text-sm bg-muted">
                            <th className="p-3">IC Number</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Company</th>
                            <th className="p-3">Department</th>
                            <th className="p-3">Position</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-4 text-center text-gray-500">
                                    No employees found.
                                </td>
                            </tr>
                        ) : (
                            employees.map((employee) => (
                                <tr key={employee.id} className="border-t text-sm">
                                    <td className="p-3">{employee.ic_number}</td>
                                    <td className="p-3">{employee.name}</td>
                                    <td className="p-3">{employee.email}</td>
                                    <td className="p-3">{employee.phone}</td>
                                    <td className="p-3">{employee.company?.company_name ?? '-'}</td>
                                    <td className="p-3">{employee.department?.name ?? '-'}</td>
                                    <td className="p-3">{employee.position}</td>
                                    <td className="p-3 text-right space-x-2 grid grid-cols-3 gap-2 justify-items-end">
                                        <Link
                                            href={route('employees.show', employee.id)}
                                            className="text-indigo-600 hover:underline"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                        </Link>
                                        <Link
                                            href={route('employees.edit', employee.id)}
                                            className="text-yellow-600 hover:underline"
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(employee.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <ConfirmDelete
                    open={confirmOpen}
                    title="Delete Employee"
                    description="Are you sure you want to delete this employee?"
                    onConfirm={handleConfirmDelete}
                    onClose={() => setConfirmOpen(false)}
                />

            </div>
        </div>

        </AppLayout>
    );
}
