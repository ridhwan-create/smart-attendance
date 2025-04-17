import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Company } from '@/types';

type Props = {
    companies: Company[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Departments', href: '/departments' },
    { title: 'Create', href: '/departments/create' },
];

export default function DepartmentCreate({ companies }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        company_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('departments.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Department" />

            <div className="w-full max-w-sm">
                <div className="px-4 py-6">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="off"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="e.g. Human Resources"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="company_id">Company</Label>
                                <Select
                                    value={data.company_id}
                                    onValueChange={(value) => setData('company_id', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="company_id">
                                        <SelectValue placeholder="Select company" />
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

                            <Button type="submit" className="mt-2 w-full" tabIndex={3} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Save Department
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
