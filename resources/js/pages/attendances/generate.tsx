import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

export default function GenerateAttendance() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Generate Attendance', href: '/attendances/generate' },
  ];

  const handleGenerate = () => {
    router.post(route('attendance.generate'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Generate Monthly Attendance" />
      <div className="container p-4">
        <h1 className="mb-4 text-xl font-semibold">Generate Monthly Attendance</h1>
        <Button onClick={handleGenerate} className="rounded p-3">
          Generate for This Month
        </Button>
      </div>
    </AppLayout>
  );
}