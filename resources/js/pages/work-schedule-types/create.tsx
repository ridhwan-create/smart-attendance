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
    { title: 'Work Schedule Types', href: '/work-schedule-types' },
    { title: 'Create', href: '/work-schedule-types/create' },
];

export default function WorkScheduleTypeCreate() {
    const { data, setData, post, processing, errors } = useForm({
        type: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('work-schedule-types.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Work Schedule Type" />

            <div className="w-full max-w-md">
                <div className="px-4 py-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Input
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                required
                                autoFocus
                                autoComplete="off"
                                disabled={processing}
                                placeholder="e.g. Normal Shift"
                            />
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="w-4 h-4 animate-spin mr-2" />}
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
