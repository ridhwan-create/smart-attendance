import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';

type Company = {
    id: number;
    registration_number: string;
    company_name: string;
    created_at?: string;
    updated_at?: string;
};

type Props = {
    company: Company;
};

export default function CompanyShow({ company }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Companies', href: '/companies' },
        { title: company.company_name, href: `/companies/${company.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Company: ${company.company_name}`} />

            <div className="w-full max-w-sm px-4 py-6">
                <div className="grid gap-6">
                    <div className="grid gap-1">
                        <Label className="text-muted-foreground">Registration Number</Label>
                        <div className="text-lg font-medium">{company.registration_number}</div>
                    </div>

                    <div className="grid gap-1">
                        <Label className="text-muted-foreground">Company Name</Label>
                        <div className="text-lg font-medium">{company.company_name}</div>
                    </div>

                    {company.created_at && (
                        <div className="grid gap-1">
                            <Label className="text-muted-foreground">Created At</Label>
                            <div className="text-sm">{new Date(company.created_at).toLocaleString()}</div>
                        </div>
                    )}

                    {company.updated_at && (
                        <div className="grid gap-1">
                            <Label className="text-muted-foreground">Last Updated</Label>
                            <div className="text-sm">{new Date(company.updated_at).toLocaleString()}</div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
