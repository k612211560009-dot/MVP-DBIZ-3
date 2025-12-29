import { Users, Calendar, Droplet, Bell, TrendingUp } from "lucide-react";
import {
  getSafeDonors,
  getSafeAppointments,
  getSafeDonations,
  getSafeAlerts,
  getDonorsByStatus,
  getActiveAlerts,
  getTotalDonationVolume,
} from "../../lib/safe-mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock chart data
const volumeData = [
  { month: "T5", volume: 3200 },
  { month: "T6", volume: 3800 },
  { month: "T7", volume: 4200 },
  { month: "T8", volume: 3900 },
  { month: "T9", volume: 4500 },
  { month: "T10", volume: 3800 },
];

const appointmentTypeData = [
  { name: "Screening", value: 35 },
  { name: "Donation", value: 65 },
];

const COLORS = ["#2563eb", "#8b5cf6"]; // Blue and Purple

const recentActivities = [
  {
    id: "1",
    type: "approval",
    message: "Le Thi C's profile has been approved",
    time: "2 hours ago",
    donor: "MB-000125",
  },
  {
    id: "2",
    type: "donation",
    message: "Hoang Thi E donated 400ml of milk",
    time: "3 hours ago",
    donor: "MB-000127",
  },
  {
    id: "3",
    type: "payment",
    message: "Transfer completed for Hoang Thi E - 300,000đ",
    time: "5 hours ago",
    donor: "MB-000127",
  },
  {
    id: "4",
    type: "registration",
    message: "Do Thi G registered as a new donor",
    time: "1 day ago",
    donor: "MB-000129",
  },
];

/*
API Endpoints for Dashboard:
GET /api/admin/dashboard/kpis - Returns KPI metrics
GET /api/admin/dashboard/volume-chart?period=6months
GET /api/admin/dashboard/appointment-stats
GET /api/admin/dashboard/recent-activities?limit=10

Sample response structure:
{
  kpis: {
    newDonors: { count: 7, trend: "+12%" },
    approvedDonors: { count: 15, trend: "+8%" },
    monthlyVolume: { ml: 3800, trend: "-4%" },
    todayAppointments: { count: 3 },
    activeAlerts: { count: 4 }
  },
  volumeChart: [...],
  appointmentStats: [...],
  recentActivities: [...]
}
*/

export function Dashboard() {
  // Calculate metrics using safe utilities
  const allDonors = getSafeDonors();
  const newDonors = allDonors.filter(
    (d) => new Date(d.registeredAt) >= new Date("2025-10-01")
  ).length;

  const approvedDonors = getDonorsByStatus("approved").length;

  const thisMonthDonations = getSafeDonations().filter(
    (d) => new Date(d.date) >= new Date("2025-10-01")
  );
  const totalVolume = getTotalDonationVolume(thisMonthDonations);

  const todayAppointments = getSafeAppointments().filter(
    (a) => a.date === "2025-10-21"
  ).length;

  const activeAlerts = getActiveAlerts().length;

  return (
    <div className="relative space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-blue-50 text-base">
          Milk Bank Management System Overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
              +12%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{newDonors}</h3>
          <p className="text-sm font-semibold text-gray-700">
            New Registered Donors
          </p>
          <p className="text-xs font-medium text-gray-500 mt-1">This month</p>
        </div>

        <div className="relative bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
              +8%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {approvedDonors}
          </h3>
          <p className="text-sm font-semibold text-gray-700">Official Donors</p>
          <p className="text-xs font-medium text-gray-500 mt-1">Approved</p>
        </div>

        <div className="relative bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">
              -4%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {totalVolume}ml
          </h3>
          <p className="text-sm font-semibold text-gray-700">Milk This Month</p>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Compared to last month
          </p>
        </div>

        <div className="relative bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {todayAppointments}
          </h3>
          <p className="text-sm font-semibold text-gray-700">
            Today's Appointments
          </p>
          <p className="text-xs font-medium text-gray-500 mt-1">21/10/2025</p>
        </div>

        <div className="relative bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {activeAlerts}
          </h3>
          <p className="text-sm font-semibold text-gray-700">Alerts</p>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Needs attention
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <div className="relative bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-600" />
            Milk Volume by Month
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="volume" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Type Chart */}
        <div className="relative bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Appointments by Type
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="relative z-10 bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Recent Activities
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs font-medium text-gray-600">
                    {activity.donor}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
