import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employee } from '@/types';
import { Button } from '@/components/ui/button';

interface Props {
    employee: Employee;
}

export default function EmployeeShow({ employee }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Employees', href: route('employees.index') },
        { title: employee.name, href: route('employees.show', employee.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Employee: ${employee.name}`} />

            <div className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Employee Details</h1>
                    <Button asChild>
                        <Link href={route('employees.edit', employee.id)}>Edit</Link>
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm border space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">IC Number</p>
                        <p className="font-medium">{employee.ic_number}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{employee.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{employee.email}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{employee.phone}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Position</p>
                        <p className="font-medium">{employee.position}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{employee.company?.company_name ?? '-'}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{employee.department?.name ?? '-'}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
