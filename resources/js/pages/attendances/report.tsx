import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendances Report', href: '/attendance/report' },
];

export default function AttendanceReport() {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        get(route('attendances.index'), {
          preserveState: true,
          preserveScroll: true,
          only: ['attendances'],
        });
      };

    const { props } = usePage();
    const { attendances, filters, companies, processing, errors } = props as any;

    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        company_id: filters.company_id || '',
        per_page: filters.per_page || 30,
        search: filters.search || '',
    });

    const submit = () => {
        if (!data.start_date || !data.end_date || !data.company_id) {
            alert('Please fill in the start date, end date, and company.');
            return;
        }

        get(route('attendances.report'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        if (!data.start_date || !data.end_date || !data.company_id) {
            alert('Please fill in the start date, end date, and company before exporting.');
            return;
        }
    
        const query = new URLSearchParams(data as any).toString();
        window.open(`/attendance/report/export?format=${format}&${query}`, '_blank');
    };

    const shouldShowTable = data.start_date && data.end_date && data.company_id && attendances?.data?.length > 0;

    return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Laporan Kehadiran" />

        <div className="p-4 space-y-4"><h1 className="text-xl font-semibold">Attendances Report</h1>
            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    {/* Fields Carian */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <Label>Start Date</Label>
                            <Input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="space-y-1">
                            <Label>End Date</Label>
                            <Input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                            <InputError message={errors.end_date} />
                        </div>

                        <div className="space-y-1">
                            <Label>Company</Label>
                            <Select value={data.company_id} onValueChange={value => setData('company_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All companies" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((company: any) => (
                                        <SelectItem key={company.id} value={company.id}>{company.company_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.company_id} />
                        </div>

                        <div className="space-y-1">
                        <Label>Search employee name or IC or location...</Label>
                            <Input
                                name="search"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                placeholder="Search employee name or IC or location or company..."
                                className="max-w-sm"
                            />
                        </div>

                    </div>

                    {/* Button Filter */}
                    <div className="flex justify-left gap-2">
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
            </div>

            {shouldShowTable ? (
            <div className="overflow-x-auto">
                <table className="min-w-full border rounded-md">
                    <thead>
                        <tr className="text-left text-sm bg-muted">
                            <th className="p-3">#</th>
                            <th className="py-2">Company</th>
                            <th className="py-2">Name</th>
                            <th>IC</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Late</th>
                            <th>Early Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.data.map((row: any, index: number) => (
                            <tr key={row.id} className="border-t text-sm">
                                <td className="p-3">{(row.from ?? 1) + index}</td>
                                <td className="py-2">{row.employee?.company?.company_name ?? '-'}</td>
                                <td className="py-2">{row.name}</td>
                                <td>{row.ic_number}</td>
                                <td>{dayjs(row.check_in_time).format('HH:mm')}</td>
                                <td>{dayjs(row.check_out_time).format('HH:mm')}</td>
                                <td>{row.is_late ? `${row.late_duration} min` : '-'}</td>
                                <td>{row.is_early_leave ? `${row.early_leave_duration} min` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <Pagination links={attendances.links} />
                </div>
            </div>
            ) : (
                <p className="text-muted-foreground text-sm">Please fill in the start date, end date, and company.</p>
            )}
        </div>
    </AppLayout>
    );
}