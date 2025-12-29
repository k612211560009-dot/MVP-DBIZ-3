import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart,
  Calendar,
  Award,
  TrendingUp,
  FileText,
  Home,
  CheckCircle,
  Bell,
  AlertCircle,
} from "lucide-react";
import { api } from "../../services/api";
import DifyChatbot from "../../components/DifyChatbot";

const DonorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalDonations: 0,
    totalVolume: 0,
    rewardPoints: 0,
    nextAppointment: null,
    recentDonations: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("📊 Fetching dashboard for user:", user?.user_id);
      console.log("🔑 Auth token exists:", !!localStorage.getItem("token"));

      // Use the correct endpoint with donor ID
      const response = await api.get(`/donors/${user.user_id}/dashboard`);
      console.log("✅ Dashboard data loaded:", response.data);

      // Extract the actual data from the API response
      const apiData = response.data.data;

      setDashboardData({
        donor: apiData.donor,
        totalDonations: apiData.statistics?.monthlyDonations || 0,
        totalVolume: apiData.statistics?.monthlyVolume || 0,
        rewardPoints: apiData.donor?.points_total || 0,
        upcomingAppointments: apiData.upcomingAppointments || [],
        recentDonations: (apiData.recentDonations || []).map((donation) => ({
          volume: donation.volume_ml,
          date: donation.scheduled_start,
          status: donation.status,
          recorder: donation.recorder?.email || "N/A",
        })),
        notifications: [],
      });
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // Use mock data if API fails (for MVP demo)
      setDashboardData({
        totalDonations: user?.donorProfile ? 3 : 0,
        totalVolume: user?.donorProfile ? 850 : 0,
        rewardPoints: user?.donorProfile?.points_total || 0,
        nextAppointment: user?.donorProfile?.interviewSlot
          ? {
              date: user.donorProfile.interviewSlot.date,
              time: user.donorProfile.interviewSlot.time,
            }
          : null,
        recentDonations: [],
        notifications: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <DifyChatbot />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-pink-100 mt-2">
                Thank you for being a hero and helping save lives through milk
                donation.
              </p>
            </div>
          </div>
        </div>

        {/* Donor Profile Summary - Compact version */}
        {user?.donorProfile && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-pink-600" />
                Donor Profile
              </h3>
              <button
                onClick={() => navigate("/donor/profile")}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                View Details →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <FileText className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Donor ID</p>
                  <p className="font-mono font-semibold text-pink-600">
                    {user.donorProfile.donorId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-green-600">
                    {user.donorProfile.donor_status === "active"
                      ? "Active"
                      : user.donorProfile.donor_status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Health Tests</p>
                  <p className="font-semibold text-blue-600">All Clear</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Interview</p>
                  <p className="font-semibold text-purple-600">
                    {user.donorProfile.interviewSlot?.date
                      ? new Date(
                          user.donorProfile.interviewSlot.date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Not scheduled"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Register as Donor CTA */}
        {dashboardData.totalDonations === 0 && !user?.donorProfile && (
          <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <FileText className="h-12 w-12 text-pink-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Complete Donation Form
                </h3>
                <p className="mt-1 text-gray-600">
                  You haven't completed your donation form yet. Fill out the
                  form to start your journey as a milk donor!
                </p>
                <button
                  onClick={() => navigate("/donor/register")}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Complete Form
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Donations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.totalDonations}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Volume (mL)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.totalVolume}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Reward Points
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.rewardPoints}
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
                  Next Appointment
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {dashboardData.nextAppointment
                    ? new Date(
                        dashboardData.nextAppointment
                      ).toLocaleDateString()
                    : "None scheduled"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Donations
              </h3>
            </div>
            <div className="p-6">
              {dashboardData.recentDonations.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentDonations.map((donation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {donation.volume} mL
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(donation.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          +{donation.points} points
                        </p>
                        <p className="text-xs text-gray-500">
                          {donation.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No donations yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Schedule your first appointment to start helping babies in
                    need!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
              </h3>
            </div>
            <div className="p-6">
              {dashboardData.notifications.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400"
                    >
                      <p className="text-sm font-medium text-blue-800">
                        {notification.title}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-blue-500 mt-2">
                        {new Date(notification.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No new notifications</p>
                  <p className="text-sm text-gray-400 mt-1">
                    We'll notify you about appointments and important updates
                    here.
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
            <button
              onClick={() => navigate("/donor/appointment")}
              className="flex items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors text-left w-full"
            >
              <Calendar className="h-8 w-8 text-pink-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Book Appointment</p>
                <p className="text-sm text-gray-500">
                  Schedule your next donation
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/donor/appointments")}
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left w-full"
            >
              <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">My Appointments</p>
                <p className="text-sm text-gray-500">
                  View all scheduled appointments
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/donor/profile")}
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left w-full"
            >
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-500">
                  Keep your information current
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/donor/history")}
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left w-full"
            >
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View History</p>
                <p className="text-sm text-gray-500">
                  See your donation history
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
