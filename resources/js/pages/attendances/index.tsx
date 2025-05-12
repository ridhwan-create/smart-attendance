import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type Attendance, type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus } from 'lucide-react';
import ConfirmDelete from '@/components/confirm-delete';
import Pagination from '@/components/ui/pagination';
import type { PaginatedData } from '@/types/pagination';
import dayjs from 'dayjs';
import { usePage } from '@inertiajs/react';

interface Props {
  attendances: PaginatedData<Attendance>;
  filters: {
    search: string;
  };
}

export default function AttendanceIndex({ attendances, filters }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendances', href: '/attendances' },
  ];

  const { auth } = usePage().props as any;
  const userPermissions: string[] = auth?.permissions ?? [];

  const canCreate = userPermissions.includes('create attendances');
  const canEdit = userPermissions.includes('edit attendances');
  const canDelete = userPermissions.includes('delete attendances');

  const { data, setData, get } = useForm({
    search: filters.search || '',
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    get(route('attendances.index'), {
      preserveState: true,
      preserveScroll: true,
      only: ['attendances'],
    });
  };

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
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Attendances</h1>
          {canCreate && (
            <Button asChild variant="success" className="rounded p-3">
              <Link href={route('attendances.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Attendance
              </Link>
            </Button>
          )}
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            name="search"
            value={data.search}
            onChange={(e) => setData('search', e.target.value)}
            placeholder="Search employee name or IC or location or company..."
            className="max-w-sm"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-md">
            <thead>
              <tr className="text-left text-sm bg-muted">
                <th className="p-3">#</th>
                <th className="p-3">Employee</th>
                <th className="p-3">IC Number</th>
                <th className="p-3">Date</th>
                <th className="p-3">Day</th>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Location</th>
                <th className="p-3">Company</th>
                <th className="p-3">Schedule</th>
                <th className="p-3">Late</th>
                <th className="p-3">Early Leave</th>
                <th className="p-3">Status</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.data.length === 0 ? (
                <tr>
                  <td colSpan={15} className="p-4 text-center text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendances.data.map((item, index) => (
                  <tr key={item.id} className="border-t text-sm">
                    <td className="p-3">{(attendances.from ?? 0) + index}</td>
                    <td className="p-3">{item.employee?.name ?? '-'}</td>
                    <td className="p-3">{item.employee?.ic_number ?? '-'}</td>
                    <td className="p-3">{item.date_of_month ?? '-'}</td>
                    <td className="p-3">{item.date_of_month ? dayjs(item.date_of_month).format('dddd') : '-'}</td>
                    <td className="p-3">{item.check_in_time ?? '-'}</td>
                    <td className="p-3">{item.check_out_time ?? '-'}</td>
                    <td className="p-3">{item.location?.name ?? '-'}</td>
                    <td className="p-3">{item.company?.company_name ?? '-'}</td>
                    <td className="p-3">{item.work_schedule_type?.type ?? '-'}</td>
                    <td className="p-3">{item.is_late ? `${item.late_duration} min` : '-'}</td>
                    <td className="p-3">{item.is_early_leave ? `${item.early_leave_duration} min` : '-'}</td>
                    <td className="p-3">
                      {item.status ? (
                        <span className={item.status === 'present' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {item.status}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3">{item.notes ?? '-'}</td>
                    <td className="p-3 text-right space-x-2 grid grid-cols-2 gap-2 justify-items-end">
                      {canEdit && (
                        <Link
                          href={route('attendances.edit', item.id)}
                          className="text-yellow-600 hover:underline"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-600 hover:underline"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination links={attendances.links} />

        <ConfirmDelete
          open={confirmOpen}
          title="Delete Attendance"
          description="Are you sure you want to delete this attendance record?"
          onConfirm={handleConfirmDelete}
          onClose={() => setConfirmOpen(false)}
        />
      </div>
    </AppLayout>
  );
}
