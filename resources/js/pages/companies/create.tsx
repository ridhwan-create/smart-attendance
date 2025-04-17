import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Companies', href: '/companies' },
    { title: 'Create', href: '/companies/create' },
];

export default function CompanyCreate() {
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        company_name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('companies.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Company" />

            <div className="w-full max-w-sm">
            <div className="px-4 py-6">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="registration_number">Registration Number</Label>
                            <Input
                                id="registration_number"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="off"
                                value={data.registration_number}
                                onChange={(e) => setData('registration_number', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. 20240101"
                            />
                            <InputError message={errors.registration_number} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input
                                id="company_name"
                                type="text"
                                required
                                tabIndex={2}
                                autoComplete="organization"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. SmartTech Solutions"
                            />
                            <InputError message={errors.company_name} />
                        </div>

                        <Button type="submit" className="mt-2 w-full" tabIndex={3} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Save Company
                        </Button>
                    </div>
                </form>
            </div></div>

        </AppLayout>
    );
}
