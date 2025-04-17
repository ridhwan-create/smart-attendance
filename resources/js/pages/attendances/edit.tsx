import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type Attendance, type BreadcrumbItem, type Company, type Employee, type Location, type WorkScheduleType } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
    attendance: Attendance;
    employees: Employee[];
    locations: Location[];
    companies: Company[];
    workScheduleTypes: WorkScheduleType[];
}

export default function EditAttendance({ attendance, employees, locations, companies, workScheduleTypes }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendances', href: '/attendances' },
        { title: `Edit`, href: route('attendances.edit', attendance.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        employee_id: attendance.employee_id ?? '',
        check_in_time: attendance.check_in_time ?? '',
        check_out_time: attendance.check_out_time ?? '',
        location_id: attendance.location_id ?? '',
        notes: attendance.notes ?? '',
        company_id: attendance.company_id ?? '',
        work_schedule_type_id: attendance.work_schedule_type_id ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('attendances.update', attendance.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Attendance" />

            <div className="w-full max-w-sm">
                <div className="px-4 py-6">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Employee */}
                        <div>
                            <Label htmlFor="employee_id">Employee</Label>
                            <select
                                id="employee_id"
                                name="employee_id"
                                value={data.employee_id}
                                onChange={(e) => setData('employee_id', parseInt(e.target.value))}
                                className="w-full mt-1 border rounded px-3 py-2 text-sm"
                            >
                                <option value="">Select employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                            {errors.employee_id && <div className="text-sm text-red-600">{errors.employee_id}</div>}
                        </div>

                        {/* Check In / Out */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="check_in_time">Check-in Time</Label>
                                <Input
                                    type="datetime-local"
                                    id="check_in_time"
                                    value={data.check_in_time}
                                    onChange={(e) => setData('check_in_time', e.target.value)}
                                />
                                {errors.check_in_time && <div className="text-sm text-red-600">{errors.check_in_time}</div>}
                            </div>

                            <div>
                                <Label htmlFor="check_out_time">Check-out Time</Label>
                                <Input
                                    type="datetime-local"
                                    id="check_out_time"
                                    value={data.check_out_time}
                                    onChange={(e) => setData('check_out_time', e.target.value)}
                                />
                                {errors.check_out_time && <div className="text-sm text-red-600">{errors.check_out_time}</div>}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <Label htmlFor="location_id">Location</Label>
                            <select
                                id="location_id"
                                name="location_id"
                                value={data.location_id}
                                onChange={(e) => setData('location_id', parseInt(e.target.value))}
                                className="w-full mt-1 border rounded px-3 py-2 text-sm"
                            >
                                <option value="">Select location</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                            {errors.location_id && <div className="text-sm text-red-600">{errors.location_id}</div>}
                        </div>

                        {/* Company */}
                        <div>
                            <Label htmlFor="company_id">Company</Label>
                            <select
                                id="company_id"
                                name="company_id"
                                value={data.company_id}
                                onChange={(e) => setData('company_id', parseInt(e.target.value))}
                                className="w-full mt-1 border rounded px-3 py-2 text-sm"
                            >
                                <option value="">Select company</option>
                                {companies.map(comp => (
                                    <option key={comp.id} value={comp.id}>
                                        {comp.company_name}
                                    </option>
                                ))}
                            </select>
                            {errors.company_id && <div className="text-sm text-red-600">{errors.company_id}</div>}
                        </div>

                        {/* Schedule Type */}
                        <div>
                            <Label htmlFor="work_schedule_type_id">Work Schedule</Label>
                            <select
                                id="work_schedule_type_id"
                                name="work_schedule_type_id"
                                value={data.work_schedule_type_id}
                                onChange={(e) => setData('work_schedule_type_id', parseInt(e.target.value))}
                                className="w-full mt-1 border rounded px-3 py-2 text-sm"
                            >
                                <option value="">Select schedule</option>
                                {workScheduleTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.type}
                                    </option>
                                ))}
                            </select>
                            {errors.work_schedule_type_id && <div className="text-sm text-red-600">{errors.work_schedule_type_id}</div>}
                        </div>

                        {/* Notes */}
                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            {errors.notes && <div className="text-sm text-red-600">{errors.notes}</div>}
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Update
                            </Button>
                            <Link href={route('attendances.index')} className="text-sm text-gray-600 hover:underline">
                                Cancel
                            </Link>
                        </div>
                    </form>
                    
                </div>
            </div>
        </AppLayout>
    );
}
