import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { type Company, type Department } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-react';

interface Props {
    companies: Company[];
    departments: Department[];
}

export default function EmployeeCreate({ companies, departments }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        ic_number: '',
        name: '',
        email: '',
        phone: '',
        position: '',
        company_id: '',
        department_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Employees', href: route('employees.index') },
                { title: 'Create', href: route('employees.create') },
            ]}
        >
            <Head title="Create Employee" />

            <div className="w-full max-w-sm">
                <div className="px-4 py-6">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="ic_number">IC Number</Label>
                            <Input
                                id="ic_number"
                                value={data.ic_number}
                                onChange={(e) => setData('ic_number', e.target.value)}
                                required
                                autoFocus
                                autoComplete="off"
                                disabled={processing}
                            />
                            <InputError message={errors.ic_number} />
                        </div>

                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                disabled={processing}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                disabled={processing}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                autoComplete="off"
                                disabled={processing}
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <Label htmlFor="position">Position</Label>
                            <Input
                                id="position"
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                            />
                            <InputError message={errors.position} />
                        </div>

                        <div>
                            <Label htmlFor="company_id">Company</Label>
                            <Select
                                onValueChange={(val) => setData('company_id', val)}
                                value={data.company_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((company) => (
                                        <SelectItem key={company.id} value={String(company.id)}>
                                            {company.company_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.company_id} />
                        </div>

                        <div>
                            <Label htmlFor="department_id">Department</Label>
                            <Select
                                onValueChange={(val) => setData('department_id', val)}
                                value={data.department_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={String(dept.id)}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.department_id} />
                        </div>

                        <div className="pt-4">
                        <Button type="submit" className="mt-2 w-full" tabIndex={3} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Save Employee
                            </Button>
                        </div>
                    </form>

                </div>
            </div>

        </AppLayout>
    );
}
