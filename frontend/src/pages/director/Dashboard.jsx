import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  Award,
  BarChart,
  DollarSign,
} from "lucide-react";
import { api } from "../../services/api";

const DirectorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalDonors: 0,
    totalStaff: 0,
    monthlyDonations: 0,
    totalRevenue: 0,
    growthMetrics: {
      donorGrowth: 0,
      donationGrowth: 0,
      revenueGrowth: 0,
    },
    recentAlerts: [],
    keyMetrics: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/director/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Director Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Executive overview and key performance indicators
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Donors</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.totalDonors}
              </p>
              <p
                className={`text-sm ${
                  dashboardData.growthMetrics.donorGrowth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {dashboardData.growthMetrics.donorGrowth >= 0 ? "+" : ""}
                {dashboardData.growthMetrics.donorGrowth}% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Monthly Donations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.monthlyDonations}
              </p>
              <p
                className={`text-sm ${
                  dashboardData.growthMetrics.donationGrowth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {dashboardData.growthMetrics.donationGrowth >= 0 ? "+" : ""}
                {dashboardData.growthMetrics.donationGrowth}% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.totalStaff}
              </p>
              <p className="text-sm text-gray-500">Active employees</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardData.totalRevenue}
              </p>
              <p
                className={`text-sm ${
                  dashboardData.growthMetrics.revenueGrowth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {dashboardData.growthMetrics.revenueGrowth >= 0 ? "+" : ""}
                {dashboardData.growthMetrics.revenueGrowth}% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Performance Indicators */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Key Performance Indicators
            </h3>
          </div>
          <div className="p-6">
            {dashboardData.keyMetrics.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.keyMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{metric.name}</p>
                      <p className="text-sm text-gray-500">
                        {metric.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {metric.value}
                      </p>
                      <p
                        className={`text-sm ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : metric.trend === "down"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {metric.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No metrics available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Alerts & Issues
            </h3>
          </div>
          <div className="p-6">
            {dashboardData.recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === "high"
                        ? "bg-red-50 border-red-400"
                        : alert.severity === "medium"
                        ? "bg-yellow-50 border-yellow-400"
                        : "bg-blue-50 border-blue-400"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            alert.severity === "high"
                              ? "text-red-800"
                              : alert.severity === "medium"
                              ? "text-yellow-800"
                              : "text-blue-800"
                          }`}
                        >
                          {alert.title}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            alert.severity === "high"
                              ? "text-red-700"
                              : alert.severity === "medium"
                              ? "text-yellow-700"
                              : "text-blue-700"
                          }`}
                        >
                          {alert.message}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          alert.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : alert.severity === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent alerts</p>
                <p className="text-sm text-gray-400 mt-1">
                  System is running smoothly
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="/director/analytics"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <BarChart className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Detailed insights</p>
            </div>
          </a>

          <a
            href="/director/reports"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Generate Reports</p>
              <p className="text-sm text-gray-500">Custom reporting</p>
            </div>
          </a>

          <a
            href="/director/staff"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Manage Staff</p>
              <p className="text-sm text-gray-500">Team management</p>
            </div>
          </a>

          <a
            href="/director/settings"
            className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Award className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">System Settings</p>
              <p className="text-sm text-gray-500">Configuration</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
