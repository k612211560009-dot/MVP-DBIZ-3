import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Droplet,
  Clock,
  AlertCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { donorService } from "../../services/donorService";

/**
 * VisitScheduleCard - Dashboard widget for visit schedule
 * Always visible, but content depends on donor status
 */
export const VisitScheduleCard = () => {
  const [loading, setLoading] = useState(true);
  const [donorStatus, setDonorStatus] = useState(null);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const status = await donorService.getStatus();
      setDonorStatus(status);

      // Show data for approved OR in_progress (demo mode)
      if (status.isApproved || status.donor_status === "in_progress") {
        const upcomingVisits = await donorService.getUpcomingVisits();
        setVisits(upcomingVisits.slice(0, 3)); // Show only 3 upcoming
      }
    } catch (error) {
      console.error("Error loading visit schedule:", error);
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
              <Calendar className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Donation Schedule
              </h3>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Not Registered as Donor Yet
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Register now for the system to automatically create milk
                  donation schedules based on your preferences
                </p>
                <Link
                  to="/donor/register"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
              <Calendar className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Donation Schedule
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
                  Donation schedule will be automatically created after your
                  application is approved (1-3 days)
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
              <Calendar className="h-6 w-6 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Donation Schedule
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
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Approved - show actual visits
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Donation Schedule
            </h3>
          </div>
          <Link
            to="/visit-schedule"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {visits.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">
              No upcoming donation schedule
            </p>
            <Link
              to="/visit-schedule"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Full Schedule
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <div
                key={visit.visit_id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      visit.status === "confirmed"
                        ? "bg-green-100"
                        : visit.status === "scheduled"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Calendar
                      className={`h-6 w-6 ${
                        visit.status === "confirmed"
                          ? "text-green-600"
                          : visit.status === "scheduled"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(visit.scheduled_start).toLocaleDateString(
                      "vi-VN",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(visit.scheduled_start).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}{" "}
                    • {visit.bank?.name || "Milk Bank"}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      visit.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : visit.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {visit.status === "proposed"
                      ? "Proposed"
                      : visit.status === "scheduled"
                      ? "Scheduled"
                      : visit.status === "confirmed"
                      ? "Confirmed"
                      : visit.status}
                  </span>
                </div>
              </div>
            ))}

            <Link
              to="/visit-schedule"
              className="block text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border-t border-gray-200 mt-4 pt-4"
            >
              View All Appointments →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
