import { VisitScheduleCard } from "../../components/dashboard/VisitScheduleCard";
import { DonationRecordCard } from "../../components/dashboard/DonationRecordCard";
import { useAuth } from "../../context/AuthContext";

/**
 * DonorDashboardPage - Main dashboard for donors
 * Shows visit schedule and donation record widgets
 */
export const DonorDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Xin chào, {user?.name || "Donor"}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Chào mừng bạn đến với bảng điều khiển donor
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visit Schedule Card - Always visible */}
          <VisitScheduleCard />

          {/* Donation Record Card - Always visible */}
          <DonationRecordCard />
        </div>

        {/* Additional Dashboard Widgets */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thống kê nhanh
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Lần hiến tháng này
                </span>
                <span className="text-lg font-bold text-gray-900">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Tổng điểm tích lũy
                </span>
                <span className="text-lg font-bold text-gray-900">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Xếp hạng</span>
                <span className="text-lg font-bold text-gray-900">-</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông báo
            </h3>
            <p className="text-sm text-gray-500">Không có thông báo mới</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Update Information
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Change Donation Schedule
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
