import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Users, CalendarCheck, MapPin, Building2, AlarmClock, LogOut, Clock, UserCheck, UserX } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

type Props = {
  summary: {
    company: {
      name: string;
      location_count: number;
      employee_count: number;
      today_attendance_count: number;
      present_percentage: number;
      late: number;
      late_percentage: number;
      early_leave: number;
      early_leave_percentage: number;
      absent_count: number;
      absent_percentage: number;
    };
    stats: {
      total_attendances: number;
      late: number;
      early_leave: number;
      late_percentage: number;
      early_leave_percentage: number;
    };
  };
};

export default function ManagerDashboard({ summary }: Props) {
  // Data for attendance status pie chart
  const attendanceData = [
    { name: 'Present', value: summary.company.today_attendance_count },
    { name: 'Absent', value: summary.company.absent_count },
  ];

  // Data for late/early leave bar chart
  const performanceData = [
    { name: 'Late', value: summary.company.late },
    { name: 'Early Leave', value: summary.company.early_leave },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manager Dashboard" />
      <div className="flex flex-col gap-8 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Dashboard</h1>
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-4 py-2 rounded-full">
            <Building2 className="w-4 h-4" />
            {summary.company.name}
          </span>
        </div>

        {/* Company Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<Users className="w-5 h-5" />}
            label="Total Employees"
            value={summary.company.employee_count}
            bgColor="bg-indigo-100 dark:bg-indigo-900/50"
            iconColor="text-indigo-600 dark:text-indigo-300"
          />
          <SummaryCard
            icon={<MapPin className="w-5 h-5" />}
            label="Locations"
            value={summary.company.location_count}
            bgColor="bg-emerald-100 dark:bg-emerald-900/50"
            iconColor="text-emerald-600 dark:text-emerald-300"
          />
          <SummaryCard
            icon={<UserCheck className="w-5 h-5" />}
            label="Present Today"
            value={`${summary.company.today_attendance_count} (${summary.company.present_percentage}%)`}
            bgColor="bg-green-100 dark:bg-green-900/50"
            iconColor="text-green-600 dark:text-green-300"
          />
          <SummaryCard
            icon={<UserX className="w-5 h-5" />}
            label="Absent Today"
            value={`${summary.company.absent_count} (${summary.company.absent_percentage}%)`}
            bgColor="bg-rose-100 dark:bg-rose-900/50"
            iconColor="text-rose-600 dark:text-rose-300"
          />
        </div>

        {/* Attendance Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Status Pie Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Issues Bar Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Issues</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Stats Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detailed Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              title="Total Attendances"
              value={summary.stats.total_attendances}
              description="All time attendance records"
            />
            <StatCard
              icon={<AlarmClock className="w-5 h-5" />}
              title="Late Arrivals"
              value={`${summary.stats.late} (${summary.stats.late_percentage}%)`}
              description="Employees arriving late"
            />
            <StatCard
              icon={<LogOut className="w-5 h-5" />}
              title="Early Leaves"
              value={`${summary.stats.early_leave} (${summary.stats.early_leave_percentage}%)`}
              description="Employees leaving early"
            />
            <StatCard
              icon={<CalendarCheck className="w-5 h-5" />}
              title="Daily Average"
              value={`${Math.round(summary.stats.total_attendances / 30)}/day`}
              description="Based on last 30 days"
            />
          </div>
        </div>
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

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-lg p-2 bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}