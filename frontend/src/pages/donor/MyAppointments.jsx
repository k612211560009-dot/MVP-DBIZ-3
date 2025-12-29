import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { api } from "../../services/api";

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filter, setFilter] = useState("all"); // all, upcoming, completed, cancelled

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const response = await api.get("/appointments", { params });

      const appointmentsData = response.data.data?.appointments || [];
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      showMessage("error", "Unable to load appointments list");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await api.patch(`/appointments/${appointmentId}`, {
        status: "cancelled",
      });
      showMessage("success", "Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      showMessage("error", "Unable to cancel appointment");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      no_show: "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const texts = {
      scheduled: "Scheduled",
      confirmed: "Confirmed",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      no_show: "No Show",
    };
    return texts[status] || status;
  };

  const getTypeText = (type) => {
    const types = {
      screening: "Screening Interview",
      donation: "Milk Donation",
      medical_test: "Medical Test",
      consultation: "Consultation",
    };
    return types[type] || type;
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

  const formatTime = (dateString, timeSlot) => {
    if (timeSlot) return timeSlot;
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/donor/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">
            Manage all your interview and donation appointments
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex flex-wrap border-b">
            {[
              { key: "all", label: "All" },
              { key: "scheduled", label: "Scheduled" },
              { key: "confirmed", label: "Confirmed" },
              { key: "completed", label: "Completed" },
              { key: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  filter === tab.key
                    ? "border-pink-600 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {getTypeText(appointment.appointment_type)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {appointment.appointment_id.slice(0, 8)}...
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Date */}
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Appointment Date</p>
                      <p className="text-gray-900 font-medium">
                        {formatDate(appointment.appointment_date)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-gray-900 font-medium">
                        {formatTime(
                          appointment.appointment_date,
                          appointment.time_slot
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {appointment.milkBank && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-900 font-medium">
                          {appointment.milkBank.bank_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.milkBank.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Meeting Link for Screening */}
                  {appointment.appointment_type === "screening" &&
                    appointment.meeting_link && (
                      <div className="flex items-start md:col-span-2">
                        <Video className="h-5 w-5 text-pink-600 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-2">
                            Link phỏng vấn trực tuyến
                          </p>
                          <a
                            href={appointment.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Tham gia phỏng vấn
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                          <p className="text-xs text-gray-500 mt-2">
                            Link sẽ hoạt động vào ngày hẹn
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </p>
                    <p className="text-gray-600">{appointment.notes}</p>
                  </div>
                )}

                {/* Preparation Instructions */}
                {appointment.preparation_instructions && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Preparation Instructions
                    </p>
                    <p className="text-blue-800 text-sm">
                      {appointment.preparation_instructions}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {(appointment.status === "scheduled" ||
                  appointment.status === "confirmed") && (
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      onClick={() =>
                        handleCancelAppointment(appointment.appointment_id)
                      }
                      className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Appointments Yet
            </h3>
            <p className="text-gray-500 mb-6">
              You don't have any appointments in the system
            </p>
            <button
              onClick={() => navigate("/donor/appointment")}
              className="btn-primary"
            >
              Book New Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
