import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  ExternalLink,
} from "lucide-react";
import { api } from "../../services/api";
import { getSafeAppointments } from "../../lib/safe-mock-data";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(
        `/staff/appointments?date=${selectedDate}`
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Use mock data as fallback
      setAppointments(getSafeAppointments());
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.patch(`/staff/appointments/${appointmentId}`, { status });
      fetchAppointments(); // Refresh list
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <h1 className="text-2xl font-bold text-gray-900">
          Appointment Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage donor appointments and schedules
        </p>
      </div>

      {/* Date Filter */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              Select Date:
            </label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input w-auto"
          />
          <div className="text-sm text-gray-500">
            {appointments.length} appointments scheduled
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Time */}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {appointment.time}
                    </span>
                  </div>

                  {/* Donor Info */}
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${appointment.donorName}&background=2563eb&color=fff`}
                      alt=""
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.donorName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.donorEmail}
                      </p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {appointment.type}
                  </div>

                  {/* Status */}
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {appointment.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "confirmed")
                        }
                        className="btn-secondary text-green-600 border-green-300 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "cancelled")
                        }
                        className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </>
                  )}

                  {appointment.status === "confirmed" && (
                    <>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "completed")
                        }
                        className="btn-primary"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </button>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "no-show")
                        }
                        className="btn-secondary text-gray-600"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        No Show
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Notes:</strong> {appointment.notes}
                  </p>
                </div>
              )}

              {/* Meeting Link for Screening Appointments */}
              {appointment.type === "screening" && appointment.meetingLink && (
                <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Video className="h-5 w-5 text-pink-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-pink-900">
                          Video Interview Link
                        </p>
                        <p className="text-xs text-pink-700 mt-1">
                          {appointment.meetingLink}
                        </p>
                      </div>
                    </div>
                    <a
                      href={appointment.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Phone: {appointment.donorPhone}</span>
                </div>
                <div>
                  Last Donation:{" "}
                  {appointment.lastDonation
                    ? new Date(appointment.lastDonation).toLocaleDateString()
                    : "First time donor"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No appointments scheduled for this date
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Select a different date to view appointments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
