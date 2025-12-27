import React, { useState, useEffect } from "react";
import {
  Beaker,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { api } from "../../services/api";

const ScreeningManagement = () => {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchScreenings();
  }, []);

  const fetchScreenings = async () => {
    try {
      const response = await api.get("/staff/screenings");
      setScreenings(response.data);
    } catch (error) {
      console.error("Error fetching screenings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateScreeningStatus = async (screeningId, status, results = {}) => {
    try {
      await api.patch(`/staff/screenings/${screeningId}`, {
        status,
        results,
        completedAt: new Date().toISOString(),
        completedBy: "current-staff-id", // This should be the actual staff ID
      });
      fetchScreenings();
      setShowModal(false);
      setSelectedScreening(null);
    } catch (error) {
      console.error("Error updating screening:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
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
    <div className="container mx-auto px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Screening Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage health screenings and medical assessments
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {screenings.filter((s) => s.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Beaker className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {screenings.filter((s) => s.status === "in-progress").length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {screenings.filter((s) => s.status === "completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {screenings.filter((s) => s.status === "failed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Screenings List */}
      <div className="card overflow-hidden max-w-7xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Screening Queue</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {screenings.length > 0 ? (
            screenings.map((screening) => (
              <div key={screening.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    {/* Priority Indicator */}
                    <div
                      className={`w-3 h-3 rounded-full ${
                        screening.priority === "high"
                          ? "bg-red-500"
                          : screening.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>

                    {/* Donor Info */}
                    <div className="flex items-center space-x-3">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${screening.donorName}&background=2563eb&color=fff`}
                        alt=""
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {screening.donorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {screening.donorId}
                        </p>
                      </div>
                    </div>

                    {/* Screening Type */}
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {screening.type}
                    </div>

                    {/* Status */}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        screening.status
                      )}`}
                    >
                      {screening.status}
                    </span>

                    {/* Scheduled Date */}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(screening.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {screening.status === "pending" && (
                      <button
                        onClick={() =>
                          updateScreeningStatus(screening.id, "in-progress")
                        }
                        className="btn-primary"
                      >
                        Start Screening
                      </button>
                    )}

                    {screening.status === "in-progress" && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedScreening(screening);
                            setShowModal(true);
                          }}
                          className="btn-primary"
                        >
                          Complete Screening
                        </button>
                        <button
                          onClick={() =>
                            updateScreeningStatus(screening.id, "failed")
                          }
                          className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Mark as Failed
                        </button>
                      </>
                    )}

                    {(screening.status === "completed" ||
                      screening.status === "failed") && (
                      <button className="btn-secondary">View Results</button>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Last Screening:</span>{" "}
                    {screening.lastScreening
                      ? new Date(screening.lastScreening).toLocaleDateString()
                      : "Never"}
                  </div>
                  <div>
                    <span className="font-medium">Total Donations:</span>{" "}
                    {screening.totalDonations || 0}
                  </div>
                  <div className={getPriorityColor(screening.priority)}>
                    <span className="font-medium">Priority:</span>{" "}
                    {screening.priority?.toUpperCase()}
                  </div>
                </div>

                {screening.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {screening.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Beaker className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No screenings scheduled</p>
              <p className="text-sm text-gray-400 mt-1">
                Screening appointments will appear here when scheduled.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Complete Screening Modal */}
      {showModal && selectedScreening && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Complete Screening for {selectedScreening.donorName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overall Result
                </label>
                <select className="input">
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="needs-retest">Needs Retest</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="input resize-none"
                  placeholder="Add screening notes..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() =>
                  updateScreeningStatus(selectedScreening.id, "completed")
                }
                className="btn-primary flex-1"
              >
                Complete Screening
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedScreening(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningManagement;
