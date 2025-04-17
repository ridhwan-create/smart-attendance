import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Attendance } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import ConfirmDelete from '@/components/confirm-delete';

interface Props {
    attendances: Attendance[];
}

export default function AttendanceIndex({ attendances }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendances', href: '/attendances' },
    ];

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId !== null) {
            router.delete(route('attendances.destroy', deleteId));
        }
        setConfirmOpen(false);
        setDeleteId(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendances" />

            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">Attendances</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href={route('attendances.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Attendance
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                        <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">ID</th>
                                <th className="p-3">IC Number</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Check-In</th>
                                <th className="p-3">Check-Out</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Company</th>
                                <th className="p-3">Schedule</th>
                                <th className="p-3">Notes</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendances.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="p-4 text-center text-gray-500">
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                attendances.map((item) => (
                                    <tr key={item.id} className="border-t text-sm">
                                        <td className="p-3">{item.id}</td>
                                        <td className="p-3">{item.ic_number}</td>
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.check_in_time}</td>
                                        <td className="p-3">{item.check_out_time}</td>
                                        <td className="p-3">{item.location?.name ?? '-'}</td>
                                        <td className="p-3">{item.company?.company_name ?? '-'}</td>
                                        <td className="p-3">{item.work_schedule_type?.type ?? '-'}</td>
                                        <td className="p-3">{item.notes ?? '-'}</td>
                                        <td className="p-3 text-center space-x-2">
                                            <Link
                                                href={route('attendances.edit', item.id)}
                                                className="inline-flex items-center px-2 py-1 text-yellow-600 hover:underline"
                                            >
                                                <Pencil className="w-4 h-4 mr-1" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(item.id)}
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
                        title="Delete Attendance"
                        description="Are you sure you want to delete this attendance record?"
                        onConfirm={handleConfirmDelete}
                        onClose={() => setConfirmOpen(false)}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
