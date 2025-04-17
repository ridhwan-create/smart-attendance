// src/pages/companies/index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";

type Company = {
    id: number;
    company_name: string;
    registration_number: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Companies', href: '/companies' },
];

export default function CompanyIndex() {
    const { companies } = usePage<{ companies: Company[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="p-4">
            <div className="flex items-center justify-between mb-6">                    <h1 className="text-xl font-semibold">Companies</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href="/companies/create">
                            + Add Company
                        </Link>
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border">
                        <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">ID</th>
                                <th className="p-3">Registration No</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company: any) => (
                                <tr key={company.id} className="border-t text-sm">
                                    <td className="p-3">{company.id}</td>
                                    <td className="p-3">{company.registration_number}</td>
                                    <td className="p-3">{company.company_name}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/companies/${company.id}/edit`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={route('companies.show', company.id)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
