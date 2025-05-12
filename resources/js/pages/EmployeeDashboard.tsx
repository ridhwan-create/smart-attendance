import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { CalendarCheck, Clock, Clock1, User, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  employee: {
    name: string;
    ic_number: string;
    location: string;
    company: string;
  };
  attendance: {
    status: string;
    check_in_time: string;
    check_out_time: string;
    is_late: boolean;
    late_duration: number | null;
    is_early_leave: boolean;
    early_leave_duration: number | null;
  };
};

export default function EmployeeDashboard({ employee, attendance }: Props) {
  return (
    <AppLayout>
      <Head title="Employee Dashboard" />
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Smart Attendance</h1>

        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <InfoRow icon={<Building />} label="" value={employee.company} />
            <InfoRow icon={<User />} label="Name" value={employee.name} />
            <InfoRow icon={<User />} label="Identification Number" value={employee.ic_number} />
            <InfoRow icon={<MapPin />} label="Location" value={employee.location} />
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Today's Attendance Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <InfoRow icon={<CalendarCheck />} label="Status" value={attendance.status} />
            <InfoRow icon={<Clock />} label="Clock In" value={attendance.check_in_time} />
            <InfoRow icon={<Clock1 />} label="Clock Out" value={attendance.check_out_time} />
            <InfoRow
              icon={<Clock className="text-orange-400" />}
              label="Late Duration (mins)"
              value={attendance.late_duration}
            />
            <InfoRow
              icon={<Clock className="text-blue-400" />}
              label="Early Leave Duration (mins)"
              value={attendance.early_leave_duration}
            />
          </div>
        </Card>

        <div>
          <div className="inline-flex items-center gap-1">
            <Button asChild variant="success" className="rounded p-3">
              <Link href="/attendance/self">
                Attendance Register
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">
              Click here to register your attendance.
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-blue-600 dark:text-blue-300">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}