import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, MapPin, CalendarCheck, AlarmClock, LogOut } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

const attendanceData = [
  { name: 'Mon', attendance: 75 },
  { name: 'Tue', attendance: 82 },
  { name: 'Wed', attendance: 90 },
  { name: 'Thu', attendance: 70 },
  { name: 'Fri', attendance: 65 },
  { name: 'Sat', attendance: 78 },
  { name: 'Sun', attendance: 88 },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            icon={<Users className="w-5 h-5" />}
            bgColor="bg-indigo-100 dark:bg-indigo-900/50"
            iconColor="text-indigo-600 dark:text-indigo-300"
            label="Total Employees"
            value="132"
          />
          <SummaryCard
            icon={<CalendarCheck className="w-5 h-5" />}
            bgColor="bg-emerald-100 dark:bg-emerald-900/50"
            iconColor="text-emerald-600 dark:text-emerald-300"
            label="Present Today"
            value="89"
          />
          <SummaryCard
            icon={<MapPin className="w-5 h-5" />}
            bgColor="bg-amber-100 dark:bg-amber-900/50"
            iconColor="text-amber-600 dark:text-amber-300"
            label="Active Locations"
            value="7"
          />
          <SummaryCard
            icon={<AlarmClock className="w-5 h-5" />}
            bgColor="bg-rose-100 dark:bg-rose-900/50"
            iconColor="text-rose-600 dark:text-rose-300"
            label="Late Arrivals"
            value="5"
          />
          <SummaryCard
            icon={<LogOut className="w-5 h-5" />}
            bgColor="bg-purple-100 dark:bg-purple-900/50"
            iconColor="text-purple-600 dark:text-purple-300"
            label="Early Departures"
            value="3"
          />
        </div>

        {/* Chart Section - Using Recharts */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Weekly Attendance Overview
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last 7 Days
            </span>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attendanceData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid 
                  stroke="#f3f4f6" 
                  strokeDasharray="3 3" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [`${value}%`, 'Attendance']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Attendance Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// SummaryCard component remains the same
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
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}