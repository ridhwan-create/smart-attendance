import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Attendance } from '@/types';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/ui/pagination';
import type { PaginatedData } from '@/types/pagination';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import ConfirmDelete from '@/components/confirm-delete';

export default function AttendanceReport() {
    const { props } = usePage();
    const { auth, attendances, filters, companies, processing, errors } = props as any;
    
    const isEmployee = auth?.user?.is_employee;
    const userPermissions: string[] = auth?.permissions ?? [];
    const canEdit = userPermissions.includes('edit attendances');
    const canDelete = userPermissions.includes('delete attendances');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendances Report', href: '/attendance/report' },
    ];

    const employeeBreadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Attendance', href: '/attendance/report' },
    ];

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        company_id: filters.company_id || '',
        per_page: filters.per_page || 30,
        search: filters.search || '',
    });

    const Pagination = ({ links }: { links: any[] }) => {
        const handleClick = (url: string | null) => {
            if (!url) return;
            get(url, {
                preserveScroll: true,
                preserveState: true,
                only: ['attendances'],
            });
        };

        return (
            <div className="flex gap-2">
                {links.map((link, index) => (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'outline'}
                        disabled={!link.url}
                        onClick={() => handleClick(link.url)}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        );
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        if (!data.start_date || !data.end_date || (!isEmployee && !data.company_id)) {
            alert(`Please fill in the start date, end date${!isEmployee ? ' and company' : ''} before exporting.`);
            return;
        }

        const query = new URLSearchParams(data as any).toString();
        window.open(`/attendance/report/export?format=${format}&${query}`, '_blank');
    };

    const submit = () => {
        if (!data.start_date || !data.end_date || (!isEmployee && !data.company_id)) {
            alert(`Please fill in the start date, end date${!isEmployee ? ' and company' : ''}.`);
            return;
        }

        setIsSubmitted(true);
        get(route('attendances.report'), {
            preserveScroll: true,
            preserveState: true,
            only: ['attendances'],
        });
    };

    const shouldShowTable = isSubmitted && attendances?.data?.length > 0;

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
        <AppLayout breadcrumbs={isEmployee ? employeeBreadcrumbs : breadcrumbs}>
            <Head title={isEmployee ? "My Attendance Report" : "Attendance Report"} />

            <div className="p-4 space-y-4">
                <h1 className="text-xl font-semibold">
                    {isEmployee ? "My Attendance Report" : "Attendances Report"}
                </h1>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label>Start Date</Label>
                            <Input 
                                type="date" 
                                value={data.start_date} 
                                onChange={e => setData('start_date', e.target.value)} 
                            />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="space-y-1">
                            <Label>End Date</Label>
                            <Input 
                                type="date" 
                                value={data.end_date} 
                                onChange={e => setData('end_date', e.target.value)} 
                            />
                            <InputError message={errors.end_date} />
                        </div>

                        {!isEmployee && (
                            <div className="space-y-1">
                                <Label>Company</Label>
                                <Select 
                                    value={data.company_id} 
                                    onValueChange={value => setData('company_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All companies" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((company: any) => (
                                            <SelectItem key={company.id} value={company.id}>
                                                {company.company_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.company_id} />
                            </div>
                        )}

                        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                            <Label>Search</Label>
                            <Input
                                name="search"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                placeholder="Search employee name, IC, location..."
                            />
                            <InputError message={errors.search} />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button onClick={submit} disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Search
                        </Button>
                        <Button variant="destructive" onClick={() => handleExport('pdf')}>
                            <FileText className="w-4 h-4 mr-2" />
                            PDF
                        </Button>
                        <Button variant="success" onClick={() => handleExport('excel')}>
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Excel
                        </Button>
                    </div>
                </div>

                {shouldShowTable ? (
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full border rounded-md text-sm">
                            <thead>
                                <tr className="text-left bg-muted">
                                    <th className="p-3">#</th>
                                    {!isEmployee && <th className="py-2">Company</th>}
                                    <th className="py-2">Name</th>
                                    <th className="py-2">IC</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Day</th>
                                    <th className="p-3">Check-In</th>
                                    <th className="p-3">Check-Out</th>
                                    <th className="p-3">Location</th>
                                    <th className="p-3">Late</th>
                                    <th className="p-3">Early Leave</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.map((row: any, index: number) => (
                                    <tr key={row.id} className="border-t">
                                        <td className="p-3">{(row.from ?? 1) + index}</td>
                                        {!isEmployee && (
                                            <td className="py-2">{row.employee?.company?.company_name ?? '-'}</td>
                                        )}
                                        <td className="py-2">{row.name}</td>
                                        <td className="py-2">{row.ic_number}</td>
                                        <td className="py-2">{dayjs(row.date_of_month).format('DD/MM/YYYY')}</td>
                                        <td className="py-2">{dayjs(row.date_of_month).format('dddd')}</td>
                                        <td className="py-2">{dayjs(row.check_in_time).format('HH:mm')}</td>
                                        <td className="py-2">{dayjs(row.check_out_time).format('HH:mm')}</td>
                                        <td className="py-2">{row.location?.name ?? '-'}</td>
                                        <td className="py-2">{row.is_late ? `${row.late_duration} min` : '-'}</td>
                                        <td className="py-2">{row.is_early_leave ? `${row.early_leave_duration} min` : '-'}</td>
                                        <td className="py-2">
                                            {row.status ? (
                                                <span className={row.status === 'present' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                                    {row.status}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="p-3 text-right space-x-2 grid grid-cols-2 gap-2 justify-items-end">
                                            {canEdit && (
                                                <Link
                                                    href={route('attendances.edit', row.id)}
                                                    className="text-yellow-600 hover:underline"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDeleteClick(row.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <Pagination links={attendances.links} />
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">
                        Please fill in the start date, end date{!isEmployee ? ' and company' : ''}.
                    </p>
                )}
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