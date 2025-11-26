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
  { name: "Sàng lọc", value: 35 },
  { name: "Hiến sữa", value: 65 },
];

const COLORS = ["#2563eb", "#8b5cf6"]; // Blue and Purple

const recentActivities = [
  {
    id: "1",
    type: "approval",
    message: "Hồ sơ Lê Thị C đã được duyệt",
    time: "2 giờ trước",
    donor: "MB-000125",
  },
  {
    id: "2",
    type: "donation",
    message: "Hoàng Thị E đã hiến 400ml sữa",
    time: "3 giờ trước",
    donor: "MB-000127",
  },
  {
    id: "3",
    type: "payment",
    message: "Đã chuyển khoản cho Hoàng Thị E - 300.000đ",
    time: "5 giờ trước",
    donor: "MB-000127",
  },
  {
    id: "4",
    type: "registration",
    message: "Đỗ Thị G đã đăng ký mới",
    time: "1 ngày trước",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-blue-100">
          Tổng quan hệ thống quản lý ngân hàng sữa mẹ
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{newDonors}</h3>
          <p className="text-sm text-gray-600">Donor mới đăng ký</p>
          <p className="text-xs text-gray-500 mt-1">Tháng này</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              +8%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {approvedDonors}
          </h3>
          <p className="text-sm text-gray-600">Donor chính thức</p>
          <p className="text-xs text-gray-500 mt-1">Đã được duyệt</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
              -4%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {totalVolume}ml
          </h3>
          <p className="text-sm text-gray-600">Sữa mẹ tháng này</p>
          <p className="text-xs text-gray-500 mt-1">So với tháng trước</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {todayAppointments}
          </h3>
          <p className="text-sm text-gray-600">Lịch hẹn hôm nay</p>
          <p className="text-xs text-gray-500 mt-1">21/10/2025</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {activeAlerts}
          </h3>
          <p className="text-sm text-gray-600">Cảnh báo</p>
          <p className="text-xs text-gray-500 mt-1">Cần xử lý</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-600" />
            Lượng sữa theo tháng
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
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Lịch hẹn theo loại
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
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.donor}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
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
