import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type WorkScheduleType } from '@/types';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDelete from '@/components/confirm-delete';
import { Plus } from 'lucide-react';

interface Props {
    workScheduleTypes: WorkScheduleType[];
}

export default function WorkScheduleTypeIndex({ workScheduleTypes }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Work Schedule Types', href: '/work-schedule-types' },
    ];

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
    if (deleteId !== null) {
        router.delete(route('work-schedule-types.destroy', deleteId));
    }
    setConfirmOpen(false);
    setDeleteId(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Work Schedule Types" />

            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">Work Schedule Types</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href={route('work-schedule-types.create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Work Schedule</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                        <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">ID</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Created By</th>
                                <th className="p-3">Updated By</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workScheduleTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No work schedule types found.
                                    </td>
                                </tr>
                            ) : (
                                workScheduleTypes.map((item) => (
                                    <tr key={item.id} className="border-t text-sm">
                                        <td className="p-3">{item.id}</td>
                                        <td className="p-3">{item.type}</td>
                                        <td className="p-3">{item.created_by}</td>
                                        <td className="p-3">{item.updated_by ?? '-'}</td>
                                        <td className="p-3 text-center space-x-2">
                                            <Link
                                                href={route('work-schedule-types.edit', item.id)}
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
                        title="Delete Schedule Type"
                        description="Are you sure you want to delete this work schedule type?"
                        onConfirm={handleConfirmDelete}
                        onClose={() => setConfirmOpen(false)}
                    />

                </div>
            </div>

        </AppLayout>
    );
}
