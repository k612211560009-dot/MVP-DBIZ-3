import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Droplet,
  TrendingUp,
  Award,
  AlertCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { donorService } from "../../services/donorService";

/**
 * DonationRecordCard - Dashboard widget for donation history
 * Always visible, but content depends on donor status
 */
export const DonationRecordCard = () => {
  const [loading, setLoading] = useState(true);
  const [donorStatus, setDonorStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const status = await donorService.getStatus();
      setDonorStatus(status);

      // Show data for approved OR in_progress (demo mode)
      if (status.isApproved || status.donor_status === "in_progress") {
        const profile = await donorService.getProfile();
        const visitsData = await donorService.getVisits({
          limit: 3,
          page: 1,
        });

        setStats({
          total_points: profile.points_total || 0,
          total_donations: visitsData.statistics?.totalVisits || 0,
          total_volume: visitsData.statistics?.totalVolume || 0,
        });

        setRecentVisits(visitsData.visits || []);
      }
    } catch (error) {
      console.error("Error loading donation record:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // No donor profile - show registration prompt
  if (!donorStatus?.hasProfile) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Droplet className="h-6 w-6 text-pink-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Lịch sử hiến tặng
              </h3>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Not Registered as Donor
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Register now to start donating milk and track your
                  contribution history
                </p>
                <Link
                  to="/donor/register"
                  className="inline-flex items-center px-4 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Register as Donor Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Has profile but pending approval
  if (donorStatus?.isPending) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Droplet className="h-6 w-6 text-pink-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Donation History
              </h3>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              Pending Approval
            </span>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Application Under Review
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  You will be able to start donating after your application is
                  approved
                </p>
                <Link
                  to="/donor/pending"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Review Status →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rejected
  if (donorStatus?.isRejected) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Droplet className="h-6 w-6 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Donation History
              </h3>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
              Rejected
            </span>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Application Not Approved
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Please contact the milk bank for more details
                </p>
                <Link
                  to="/contact"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Liên hệ hỗ trợ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Approved - show actual donation history
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Droplet className="h-6 w-6 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Lịch sử hiến tặng
            </h3>
          </div>
          <Link
            to="/donation-record"
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-pink-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-5 w-5 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.total_points || 0}
            </p>
            <p className="text-xs text-gray-600">Điểm</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.total_donations || 0}
            </p>
            <p className="text-xs text-gray-600">Lần hiến</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Droplet className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.total_volume || 0}
            </p>
            <p className="text-xs text-gray-600">ml</p>
          </div>
        </div>

        {/* Recent Donations */}
        {recentVisits.length === 0 ? (
          <div className="text-center py-8 border-t border-gray-200 mt-4 pt-4">
            <Droplet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">
              Chưa có lần hiến tặng nào
            </p>
            <Link
              to="/visit-schedule"
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors"
            >
              Xem lịch hiến sữa
            </Link>
          </div>
        ) : (
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Lần hiến gần đây
            </p>
            {recentVisits.map((visit) => (
              <div
                key={visit.visit_id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                    <Droplet className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(
                      visit.actual_end || visit.scheduled_start
                    ).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {visit.milk_volume_ml || 0} ml • +
                    {visit.points_awarded || 0} điểm
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Hoàn thành
                  </span>
                </div>
              </div>
            ))}

            <Link
              to="/donation-record"
              className="block text-center py-2 text-sm text-pink-600 hover:text-pink-700 font-medium border-t border-gray-200 mt-4 pt-4"
            >
              Xem tất cả lịch sử →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
