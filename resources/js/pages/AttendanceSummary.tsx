import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Users, CalendarCheck, MapPin, Building2, AlarmClock, LogOut } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

type Props = {
  summary: {
    total: number;
    late: number;
    early_leave: number;
    late_percentage: number;
    early_leave_percentage: number;
    total_companies: number;
    total_locations: number;
    total_employees: number;
    locations_by_company: {
      name: string;
      location_count: number;
      employee_count: number;
      today_attendance_count: number;
      present_percentage: number;
      late: number;
      late_percentage: number;
      early_leave: number;
      early_leave_percentage: number;
    }[];
    late_early_by_company: {
      company: string;
      total_attendances: number;
      late: number;
      late_percentage: number;
      early_leave: number;
      early_leave_percentage: number;
    }[];
  };
};

export default function AttendanceSummary({ summary }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ringkasan Kehadiran" />
      <div className="flex flex-col gap-8 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ringkasan Kehadiran</h1>

        {/* Kad Ringkasan Global */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<Building2 className="w-5 h-5" />}
            label="Jumlah Syarikat"
            value={summary.total_companies}
            bgColor="bg-blue-100 dark:bg-blue-900/50"
            iconColor="text-blue-600 dark:text-blue-300"
          />
          <SummaryCard
            icon={<Users className="w-5 h-5" />}
            label="Jumlah Pekerja"
            value={summary.total_employees}
            bgColor="bg-indigo-100 dark:bg-indigo-900/50"
            iconColor="text-indigo-600 dark:text-indigo-300"
          />
          <SummaryCard
            icon={<MapPin className="w-5 h-5" />}
            label="Jumlah Lokasi"
            value={summary.total_locations}
            bgColor="bg-emerald-100 dark:bg-emerald-900/50"
            iconColor="text-emerald-600 dark:text-emerald-300"
          />
        </div>

        {/* Rumusan Lokasi & Kehadiran per Syarikat */}
        {summary.locations_by_company.map((company, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {company.name}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<Users className="w-5 h-5" />}
                label="Jumlah Pekerja"
                value={company.employee_count}
                bgColor="bg-indigo-100 dark:bg-indigo-900/50"
                iconColor="text-indigo-600 dark:text-indigo-300"
              />
              <SummaryCard
                icon={<CalendarCheck className="w-5 h-5" />}
                label="Kehadiran Hari Ini"
                value={`${company.today_attendance_count} (${company.present_percentage}%)`}
                bgColor="bg-emerald-100 dark:bg-emerald-900/50"
                iconColor="text-emerald-600 dark:text-emerald-300"
              />
              <SummaryCard
                icon={<AlarmClock className="w-5 h-5" />}
                label="Lewat Hari Ini"
                value={`${company.late} (${company.late_percentage}%)`}
                bgColor="bg-rose-100 dark:bg-rose-900/50"
                iconColor="text-rose-600 dark:text-rose-300"
              />
              <SummaryCard
                icon={<LogOut className="w-5 h-5" />}
                label="Balik Awal"
                value={`${company.early_leave} (${company.early_leave_percentage}%)`}
                bgColor="bg-purple-100 dark:bg-purple-900/50"
                iconColor="text-purple-600 dark:text-purple-300"
              />
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-4 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    {company.location_count}  lokasi
                </span>
            </div>

          </div>
        ))}
      </div>
    </AppLayout>
  );
}

function SummaryCard({
  icon,
  bgColor,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${bgColor}`}>
          <div className={`${iconColor}`}>{icon}</div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
