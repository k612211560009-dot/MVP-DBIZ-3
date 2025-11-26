import { KPICard } from "../components/KPICard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Users, Calendar, Droplet, Bell, TrendingUp } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  mockDonors,
  mockAppointments,
  mockDonations,
  mockAlerts,
} from "../lib/mock-data";
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

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

const recentActivities = [
  {
    id: "1",
    type: "approval",
    message: "Profile for Le Thi C has been approved",
    time: "2 hours ago",
    donor: "MB-000125",
  },
  {
    id: "2",
    type: "donation",
    message: "Hoang Thi E donated 400ml milk",
    time: "3 hours ago",
    donor: "MB-000127",
  },
  {
    id: "3",
    type: "payment",
    message: "Payment transferred to Hoang Thi E - 300,000đ",
    time: "5 hours ago",
    donor: "MB-000127",
  },
  {
    id: "4",
    type: "registration",
    message: "Do Thi G registered",
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
  const newDonors = mockDonors.filter(
    (d) => new Date(d.registeredAt) >= new Date("2025-10-01")
  ).length;

  const approvedDonors = mockDonors.filter(
    (d) => d.status === "approved"
  ).length;

  const thisMonthDonations = mockDonations.filter(
    (d) => new Date(d.date) >= new Date("2025-10-01")
  );

  const totalVolume = thisMonthDonations.reduce((sum, d) => sum + d.volume, 0);

  const todayAppointments = mockAppointments.filter(
    (a) => a.date === "2025-10-21"
  ).length;

  const activeAlerts = mockAlerts.filter((a) => a.status === "active").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Breast Milk Bank System Overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="New Donor Registrations"
          value={newDonors}
          icon={Users}
          trend={{ value: "+12%", direction: "up" }}
          subtitle="This month"
        />
        <KPICard
          title="Official Donors"
          value={approvedDonors}
          icon={TrendingUp}
          trend={{ value: "+8%", direction: "up" }}
          subtitle="Approved"
        />
        <KPICard
          title="Milk This Month"
          value={`${totalVolume}ml`}
          icon={Droplet}
          trend={{ value: "-4%", direction: "down" }}
          subtitle="Compared to last month"
        />
        <KPICard
          title="Today's Appointments"
          value={todayAppointments}
          icon={Calendar}
          subtitle="21/10/2025"
        />
        <KPICard
          title="Alerts"
          value={activeAlerts}
          icon={Bell}
          subtitle="Need attention"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Milk Volume by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="volume"
                  fill="hsl(var(--chart-1))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Type Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p>{activity.message}</p>
                    <p className="text-muted-foreground">{activity.donor}</p>
                  </div>
                </div>
                <Badge variant="secondary">{activity.time}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>Server-side pagination for activities timeline</li>
          <li>
            Real-time updates using WebSocket for new registrations and
            donations
          </li>
          <li>Cache KPI data for 5 minutes to reduce database load</li>
          <li>Permission: Director and Admin roles can view full dashboard</li>
          <li>
            Medical Staff can only view their assigned appointments section
          </li>
        </ul>
      </div>
    </div>
  );
}
