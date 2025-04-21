import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Users, CalendarCheck, AlarmClock, LogOut } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

type CompanyStats = {
  company_id: number;
  company_name: string;
  totalEmployees: number;
  presentToday: number;
  lateArrivals: number;
  earlyDepartures: number;
  weeklyStats: { name: string; attendance: number }[];
  lateStats: { name: string; late: number }[];
  topEmployees: { name: string; presentDays: number }[];
};

type PageProps = {
  companies: CompanyStats[];
};

export default function Dashboard({ companies }: PageProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-8 p-6">
        {companies.map((company) => (
          <div
            key={company.company_id}
            className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {company.company_name}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<Users className="w-5 h-5" />}
                label="Total Employees"
                value={company.totalEmployees}
                bgColor="bg-indigo-100 dark:bg-indigo-900/50"
                iconColor="text-indigo-600 dark:text-indigo-300"
              />
              <SummaryCard
                icon={<CalendarCheck className="w-5 h-5" />}
                label="Present Today"
                value={company.presentToday}
                bgColor="bg-emerald-100 dark:bg-emerald-900/50"
                iconColor="text-emerald-600 dark:text-emerald-300"
              />
              <SummaryCard
                icon={<AlarmClock className="w-5 h-5" />}
                label="Late Arrivals"
                value={company.lateArrivals}
                bgColor="bg-rose-100 dark:bg-rose-900/50"
                iconColor="text-rose-600 dark:text-rose-300"
              />
              <SummaryCard
                icon={<LogOut className="w-5 h-5" />}
                label="Early Departures"
                value={company.earlyDepartures}
                bgColor="bg-purple-100 dark:bg-purple-900/50"
                iconColor="text-purple-600 dark:text-purple-300"
              />
            </div>

            <div>
              <h3 className="mb-2 text-md font-medium text-gray-800 dark:text-white">
                Weekly Attendance Rate
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={company.weeklyStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#4f46e5" name="Attendance Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="mb-2 mt-4 text-md font-medium text-gray-800 dark:text-white">
                Weekly Late Trend
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={company.lateStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="late" stroke="#e11d48" name="Late Count" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="mb-2 mt-4 text-md font-medium text-gray-800 dark:text-white">
                Top Performing Employees (Attendance)
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {company.topEmployees.map((emp, idx) => (
                  <div
                    key={idx}
                    className="rounded border bg-gray-50 px-4 py-2 text-sm text-gray-700 shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {emp.name} - {emp.presentDays} days
                  </div>
                ))}
              </div>
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
