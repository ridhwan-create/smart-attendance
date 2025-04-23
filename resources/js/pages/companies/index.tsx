import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import type { BreadcrumbItem, Company } from '@/types';
import type { PaginatedData } from '@/types/pagination';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Companies', href: '/companies' },
];

type PageProps = {
    companies: PaginatedData<Company>;
    filters: {
        search: string;
    };
};

export default function CompanyIndex({ companies, filters }: PageProps) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        get(route('companies.index'), {
            preserveState: true,
            preserveScroll: true,
            only: ['companies'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Companies</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href={route('companies.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Company
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <Input
                        name="search"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Search company name..."
                        className="max-w-sm"
                    />
                    <Button type="submit">Search</Button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                        <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">#</th>
                                <th className="p-3">Registration No</th>
                                <th className="p-3">Company Name</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No companies found.
                                    </td>
                                </tr>
                            ) : (
                                companies.data.map((company, index) => (
                                    <tr key={company.id} className="border-t text-sm">
                                        <td className="p-3">{(companies.from ?? 0) + index}</td>
                                        <td className="p-3">{company.registration_number}</td>
                                        <td className="p-3">{company.company_name}</td>
                                        <td className="p-3 space-x-2 flex gap-2">
                                                <Link
                                                    href={route('companies.show', company.id)}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('companies.edit', company.id)}
                                                    className="text-yellow-600 hover:underline"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={companies.links} />
            </div>
        </AppLayout>
    );
}
