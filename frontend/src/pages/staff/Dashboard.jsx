import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { api } from "../../services/api";

const StaffDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalDonors: 0,
    todayAppointments: 0,
    pendingScreenings: 0,
    monthlyDonations: 0,
    recentActivities: [],
    alerts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/staff/dashboard");
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of daily operations and activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.totalDonors}
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
                Today's Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.todayAppointments}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Screenings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.pendingScreenings}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Monthly Donations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.monthlyDonations}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            {dashboardData.recentActivities.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Alerts & Notifications
            </h3>
          </div>
          <div className="p-6">
            {dashboardData.alerts.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === "warning"
                        ? "bg-yellow-50 border-yellow-400"
                        : alert.type === "error"
                        ? "bg-red-50 border-red-400"
                        : "bg-blue-50 border-blue-400"
                    }`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle
                          className={`h-5 w-5 ${
                            alert.type === "warning"
                              ? "text-yellow-400"
                              : alert.type === "error"
                              ? "text-red-400"
                              : "text-blue-400"
                          }`}
                        />
                      </div>
                      <div className="ml-3">
                        <p
                          className={`text-sm font-medium ${
                            alert.type === "warning"
                              ? "text-yellow-800"
                              : alert.type === "error"
                              ? "text-red-800"
                              : "text-blue-800"
                          }`}
                        >
                          {alert.title}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            alert.type === "warning"
                              ? "text-yellow-700"
                              : alert.type === "error"
                              ? "text-red-700"
                              : "text-blue-700"
                          }`}
                        >
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No alerts</p>
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
            href="/staff/donors"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Manage Donors</p>
              <p className="text-sm text-gray-500">View and edit donor info</p>
            </div>
          </a>

          <a
            href="/staff/appointments"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Appointments</p>
              <p className="text-sm text-gray-500">Schedule and manage</p>
            </div>
          </a>

          <a
            href="/staff/screening"
            className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <AlertCircle className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Screening</p>
              <p className="text-sm text-gray-500">Health assessments</p>
            </div>
          </a>

          <a
            href="/staff/donations"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Donation Log</p>
              <p className="text-sm text-gray-500">Track donations</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
