import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import  Textarea  from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { type BreadcrumbItem, type Company, type Employee, type Location, type WorkScheduleType } from '@/types';

interface Props {
  employees: Employee[];
  companies: Company[];
  locations: Location[];
  workScheduleTypes: WorkScheduleType[];
}

export default function CreateAttendance({ employees, companies, locations, workScheduleTypes }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendances', href: '/attendances' },
    { title: 'Create', href: '/attendances/create' },
  ];

  const { data, setData, post, processing, errors } = useForm({
    employee_id: '',
    check_in_time: '',
    check_out_time: '',
    location_id: '',
    notes: '',
    company_id: '',
    work_schedule_type_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('attendances.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Attendance" />
      <div className="w-full max-w-sm">
        <div className="px-4 py-6">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div>
                <Label htmlFor="employee_id">Employee</Label>
                <Select value={data.employee_id} onValueChange={(value) => setData('employee_id', value)}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                    {employees.map((emp) => (
                        <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.employee_id} />
                </div>

                <div>
                <Label htmlFor="check_in_time">Check In Time</Label>
                <Input type="datetime-local" value={data.check_in_time} onChange={(e) => setData('check_in_time', e.target.value)} />
                <InputError message={errors.check_in_time} />
                </div>

                <div>
                <Label htmlFor="check_out_time">Check Out Time</Label>
                <Input type="datetime-local" value={data.check_out_time} onChange={(e) => setData('check_out_time', e.target.value)} />
                <InputError message={errors.check_out_time} />
                </div>

                <div>
                <Label htmlFor="location_id">Location</Label>
                <Select value={data.location_id} onValueChange={(value) => setData('location_id', value)}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                    {locations.map((loc) => (
                        <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.location_id} />
                </div>

                <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                <InputError message={errors.notes} />
                </div>

                <div>
                <Label htmlFor="company_id">Company</Label>
                <Select value={data.company_id} onValueChange={(value) => setData('company_id', value)}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                    {companies.map((comp) => (
                        <SelectItem key={comp.id} value={String(comp.id)}>{comp.company_name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.company_id} />
                </div>

                <div>
                <Label htmlFor="work_schedule_type_id">Work Schedule Type</Label>
                <Select value={data.work_schedule_type_id} onValueChange={(value) => setData('work_schedule_type_id', value)}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select work schedule type" />
                    </SelectTrigger>
                    <SelectContent>
                    {workScheduleTypes.map((wst) => (
                        <SelectItem key={wst.id} value={String(wst.id)}>{wst.type}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.work_schedule_type_id} />
                </div>

                <div className="flex justify-end">
                <Button type="submit" disabled={processing}>Save</Button>
                </div>
            </form>
        </div>
    </div>
    </AppLayout>
  );
}
