import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import { api } from "../../services/api";

const VisitScheduleManagement = () => {
  const [pendingVisits, setPendingVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchPendingVisits();
  }, []);

  const fetchPendingVisits = async () => {
    try {
      setLoading(true);
      const response = await api.get("/donation-visits/pending");
      setPendingVisits(response.data.data?.visits || []);
    } catch (error) {
      console.error("Error fetching pending visits:", error);
      setPendingVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (visitId) => {
    try {
      setActionLoading(visitId);
      await api.patch(`/donation-visits/${visitId}/confirm`, {
        notes: "Visit confirmed by staff",
      });

      // Show success message
      alert("✅ Visit confirmed successfully!");

      // Refresh list
      fetchPendingVisits();
    } catch (error) {
      console.error("Error confirming visit:", error);
      alert("❌ An error occurred while confirming the appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter a reason for rejection");
      return;
    }

    try {
      setActionLoading(selectedVisit.visit_id);
      await api.patch(`/donation-visits/${selectedVisit.visit_id}/reject`, {
        reason: rejectReason,
      });

      // Show success message
      alert("❌ Visit has been rejected");

      // Close modal and refresh
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedVisit(null);
      fetchPendingVisits();
    } catch (error) {
      console.error("Error rejecting visit:", error);
      alert("❌ An error occurred while rejecting the visit");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (visit) => {
    setSelectedVisit(visit);
    setShowRejectModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visit schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-pink-600" />
              Donation Visit Schedule Management
            </h1>
            <p className="mt-2 text-gray-600">
              Confirm or reject visit requests from donors
            </p>
          </div>
          <div className="bg-pink-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Pending Review</p>
            <p className="text-2xl font-bold text-pink-600">
              {pendingVisits.length}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Visits List */}
      {pendingVisits.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Pending Visits
          </h3>
          <p className="text-gray-600">
            All visit requests have been processed
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingVisits.map((visit) => (
            <div
              key={visit.visit_id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                {/* Visit Info */}
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    {/* Date/Time Section */}
                    <div className="bg-pink-50 rounded-lg p-4 text-center min-w-[120px]">
                      <Calendar className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(visit.scheduled_start)}
                      </p>
                      <div className="flex items-center justify-center mt-2 text-pink-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-semibold">
                          {formatTime(visit.scheduled_start)}
                        </span>
                      </div>
                    </div>

                    {/* Donor Info */}
                    <div className="flex-1">
                      <div className="flex items-start mb-3">
                        <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {visit.donor?.ehrData?.full_name || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Donor ID: {visit.donor_id}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {visit.donor?.ehrData?.phone || "N/A"}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {visit.donor?.user?.email || "N/A"}
                        </div>
                        <div className="flex items-center text-gray-600 col-span-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          {visit.bank?.name || "N/A"} -{" "}
                          {visit.bank?.address || ""}
                        </div>
                      </div>

                      {visit.schedule?.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            <span className="font-medium">Notes:</span>{" "}
                            {visit.schedule.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="ml-6 flex flex-col space-y-2">
                  <button
                    onClick={() => handleConfirm(visit.visit_id)}
                    disabled={actionLoading === visit.visit_id}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                  >
                    {actionLoading === visit.visit_id ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => openRejectModal(visit)}
                    disabled={actionLoading === visit.visit_id}
                    className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Visit
            </h3>
            <p className="text-gray-600 mb-4">
              Please enter the reason for rejecting the visit from donor{" "}
              <span className="font-semibold">
                {selectedVisit?.donor?.ehrData?.full_name}
              </span>
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedVisit(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitScheduleManagement;
