import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Attendance } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendances Report', href: '/attendance/report' },
];

export default function AttendanceReport() {
    const { props } = usePage();
    const { attendances, filters, locations, companies, departments } = props as any;

    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        location_id: filters.location_id || '',
        company_id: filters.company_id || '',
        department_id: filters.department_id || '',
        search: filters.search || '',
        per_page: filters.per_page || 30,
    });

    const submit = () => {
        get(route('attendances.report'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Kehadiran" />

            <div className="p-4 space-y-4">
                
                    <div className="space-y-2"><h1 className="text-xl font-semibold">Attendances Report</h1>
                        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                            <Input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                            <select value={data.location_id} onChange={e => setData('location_id', e.target.value)} className="border p-2 rounded">
                                <option value="">All locations</option>
                                {locations.map((loc: any) => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                            <Input placeholder="Search name / IC" value={data.search} onChange={e => setData('search', e.target.value)} />
                            <select
                                value={data.per_page}
                                onChange={(e) => {
                                    setData('per_page', Number(e.target.value));
                                    get(route('attendances.report'), {
                                        preserveScroll: true,
                                        preserveState: true,
                                    });
                                }}
                                className="border p-2 rounded"
                            >
                                {[30, 60, 100].map((num) => (
                                    <option key={num} value={num}>
                                        {num} records / page
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Start Date</label>
                                <Input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">End Date</label>
                                <Input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Location</label>
                                <select value={data.location_id} onChange={e => setData('location_id', e.target.value)} className="border p-2 rounded w-full">
                                    <option value="">All locations</option>
                                    {locations.map((loc: any) => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Search Name / IC</label>
                                <Input placeholder="Search name / IC" value={data.search} onChange={e => setData('search', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Company</label>
                                <select value={data.company_id} onChange={e => setData('company_id', e.target.value)} className="border p-2 rounded w-full">
                                    <option value="">All companies</option>
                                    {companies.map((company: any) => (
                                        <option key={company.id} value={company.id}>{company.company_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Department</label>
                                <select value={data.department_id} onChange={e => setData('department_id', e.target.value)} className="border p-2 rounded w-full">
                                    <option value="">All departments</option>
                                    {departments.map((dept: any) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Records/Page</label>
                                <select
                                    value={data.per_page}
                                    onChange={(e) => {
                                        setData('per_page', Number(e.target.value));
                                        get(route('attendances.report'), {
                                            preserveScroll: true,
                                            preserveState: true,
                                        });
                                    }}
                                    className="border p-2 rounded w-full"
                                >
                                    {[30, 60, 100].map((num) => (
                                        <option key={num} value={num}>
                                            {num} records / page
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Button onClick={submit}>Filter</Button>
                    </div>

                    <div className="flex gap-2">
    <Button
        variant="outline"
        onClick={() => {
            const query = new URLSearchParams(data as any).toString();
            window.open(`/attendance/report/export?format=pdf&${query}`, '_blank');
        }}
    >
        Export PDF
    </Button>
    <Button
        variant="outline"
        onClick={() => {
            const query = new URLSearchParams(data as any).toString();
            window.open(`/attendance/report/export?format=excel&${query}`, '_blank');
        }}
    >
        Export Excel
    </Button>
</div>

                

                    <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-md">
                            <thead>
                                <tr className="text-left text-sm bg-muted">
                                    <th className="p-3">#</th>
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
                            {/* Pagination */}
                        </div>
                    </div>
            </div>
        </AppLayout>
    );
}
