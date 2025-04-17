import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Department, type Company } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Departments', href: '/departments' },
    { title: 'Show', href: '#' },
];

type Props = {
    department: Department & { company: Company };
};

export default function DepartmentShow({ department }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Department: ${department.name}`} />

            <div className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <h2 className="text-xl font-semibold">Department Information</h2>
                
                <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                    <div>
                        <span className="font-medium">Department Name:</span>{' '}
                        {department.name}
                    </div>
                    <div>
                        <span className="font-medium">Company:</span>{' '}
                        {department.company?.company_name}
                    </div>
                    <div>
                        <span className="font-medium">Created at:</span>{' '}
                        {department.created_at ? new Date(department.created_at).toLocaleString() : '-'}
                    </div>
                    <div>
                        <span className="font-medium">Updated at:</span>{' '}
                        {department.updated_at ? new Date(department.updated_at).toLocaleString() : '-'}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
