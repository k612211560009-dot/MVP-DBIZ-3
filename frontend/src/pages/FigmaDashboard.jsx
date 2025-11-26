import React from "react";
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
    status: "success",
  },
  {
    id: "2",
    type: "appointment",
    message: "Appointment with Nguyen Thi D has been scheduled",
    time: "1 hour ago",
    status: "info",
  },
  {
    id: "3",
    type: "donation",
    message: "Tran Thi E completed donation of 250ml",
    time: "30 minutes ago",
    status: "success",
  },
  {
    id: "4",
    type: "alert",
    message: "Storage nearly full, needs inspection",
    time: "15 minutes ago",
    status: "warning",
  },
];

export default function Dashboard() {
  const kpiData = [
    {
      title: "Total Donors",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      description: "vs. last month",
    },
    {
      title: "Appointments Today",
      value: "28",
      change: "+5%",
      changeType: "positive",
      icon: Calendar,
      description: "vs. yesterday",
    },
    {
      title: "Milk Volume (L)",
      value: "3,847",
      change: "+8%",
      changeType: "positive",
      icon: Droplet,
      description: "this month",
    },
    {
      title: "Active Alerts",
      value: "7",
      change: "-2",
      changeType: "negative",
      icon: Bell,
      description: "vs. last week",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your milk bank operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
            description={kpi.description}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Volume Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Milk Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Types */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Appointment Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={appointmentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-yellow-500"
                        : activity.status === "info"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <p className="text-sm">{activity.message}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
