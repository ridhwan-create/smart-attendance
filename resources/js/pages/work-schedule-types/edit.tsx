import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type WorkScheduleType } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';

interface Props {
    workScheduleType: WorkScheduleType;
}

export default function WorkScheduleTypeEdit({ workScheduleType }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Work Schedule Types', href: '/work-schedule-types' },
        { title: `Edit`, href: route('work-schedule-types.edit', workScheduleType.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        type: workScheduleType.type || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('work-schedule-types.update', workScheduleType.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Work Schedule Type" />

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
                                autoComplete="off"
                                disabled={processing}
                                placeholder="e.g. Night Shift"
                            />
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="w-4 h-4 animate-spin mr-2" />}
                            Update
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
