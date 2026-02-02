import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Check,
  X,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { api } from "../../services/api";
import DifyChatbot from "../../components/DifyChatbot";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("donation");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await api.get("/appointments/upcoming");
      console.log("📅 Upcoming appointments response:", response.data);
      // Handle both array and object with data property
      const appointments = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setUpcomingAppointments(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setUpcomingAppointments([]);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      setLoading(true);

      // Generate fixed time slots for selection
      const timeSlots = [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
      ];

      setAvailableSlots(timeSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage("Please select both date and time");
      return;
    }

    try {
      setLoading(true);
      
      // Convert date to ISO format for backend validation
      const isoDate = new Date(selectedDate).toISOString();
      
      await api.post("/appointments/book", {
        date: isoDate,
        time: selectedTime,
        type: appointmentType,
        notes,
      });

      setMessage("Appointment booked successfully!");
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");
      fetchUpcomingAppointments();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setMessage(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await api.delete(`/appointments/${appointmentId}`);
      setMessage("Appointment cancelled successfully");
      fetchUpcomingAppointments();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setMessage("Failed to cancel appointment");
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  // Get maximum date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <DifyChatbot />
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-1">
            Schedule your donation or consultation appointment
          </p>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-md flex items-center ${
            message.includes("success")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.includes("success") ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Schedule New Appointment
          </h2>

          <div className="space-y-4">
            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="input"
              >
                <option value="donation">Milk Donation</option>
                <option value="screening">Health Screening</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                  max={maxDateStr}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Times
                </label>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`p-3 text-sm rounded-md border transition-colors ${
                          selectedTime === slot
                            ? "bg-pink-600 text-white border-pink-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        <Clock className="h-4 w-4 inline mr-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
                    No available slots for this date
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Any special requirements or notes..."
              />
            </div>

            {/* Book Button */}
            <button
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime || loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Upcoming Appointments
          </h2>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {appointment.type} Appointment
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(appointment.date).toLocaleDateString()}
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        {appointment.time}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  {appointment.location && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {appointment.location}
                    </div>
                  )}

                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mb-3">
                      {appointment.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" />
                      Contact: {appointment.contactPhone || "N/A"}
                    </div>

                    {appointment.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
              <p className="text-sm text-gray-400 mt-1">
                Schedule your first appointment using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          Important Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Before Your Appointment:</h4>
            <ul className="space-y-1">
              <li>• Get adequate rest (8+ hours)</li>
              <li>• Stay well hydrated</li>
              <li>• Eat a nutritious meal</li>
              <li>• Bring valid ID</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">What to Expect:</h4>
            <ul className="space-y-1">
              <li>• Brief health screening</li>
              <li>• Comfortable donation process</li>
              <li>• 15-30 minutes total time</li>
              <li>• Refreshments provided</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
