import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  FileText,
  Edit,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Clock,
  Hash,
  MapPinned,
  Loader2,
  Activity,
  TrendingUp,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal"); // personal, health, history
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/donors/profile");

      if (response.data.hasProfile) {
        setProfile(response.data.data);
      } else if (user) {
        // Use data from auth context if available
        setProfile({
          fullName: user.name || "N/A",
          email: user.email,
          phone: user.phone || "N/A",
          donorId: user.user_id,
          donor_status: "pending",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // If API fails but user is logged in, show basic info from context
      if (user) {
        setProfile({
          fullName: user.name || "N/A",
          email: user.email,
          phone: user.phone || "N/A",
          donorId: user.user_id,
          donor_status: "pending",
        });
      } else if (error.response?.status === 404) {
        setProfile(null);
      } else {
        toast.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      email: profile.email || "",
      address: profile.address || "",
      province: profile.province || "",
      district: profile.district || "",
      ward: profile.ward || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/donors/profile", editForm);
      toast.success("Profile updated successfully!");
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="card p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Profile Information
            </h2>
            <p className="text-gray-600 mb-6">
              Please complete your donor registration form to view your profile.
            </p>
            <button
              onClick={() => navigate("/donor/register")}
              className="btn btn-primary"
            >
              Complete Registration Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render status badge
  const renderStatusBadge = (status, label) => {
    const statusConfig = {
      active: { color: "green", text: "Active" },
      approved: { color: "blue", text: "Approved" },
      pending: { color: "yellow", text: "Pending" },
      suspended: { color: "red", text: "Suspended" },
      rejected: { color: "red", text: "Rejected" },
    };

    const config = statusConfig[status?.toLowerCase()] || {
      color: "gray",
      text: status,
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}
      >
        {config.text}
      </span>
    );
  };

  // Helper function to render yes/no answer
  const renderAnswer = (answer) => {
    if (answer === "yes") {
      return (
        <span className="inline-flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          Yes
        </span>
      );
    } else if (answer === "no") {
      return (
        <span className="inline-flex items-center gap-1 text-gray-500">
          <XCircle className="h-4 w-4" />
          No
        </span>
      );
    }
    return <span className="text-gray-400">Not answered</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Donor Profile
              </h1>
              <p className="text-gray-600">
                Complete information about your donor account
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={isEditing ? handleSave : handleEdit}
          >
            {isEditing ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </button>
          {isEditing && (
            <button
              className="btn btn-secondary flex items-center gap-2 ml-2"
              onClick={handleCancel}
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>

        {/* Donor ID Card - Prominent */}
        <div className="card p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-full shadow-md">
              <Hash className="h-8 w-8 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Donor ID</p>
              <p className="text-3xl font-mono font-bold text-pink-600">
                {profile.donorId}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-pink-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">
                      {profile.fullName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{profile.dob}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">ID / Passport</p>
                  <p className="font-medium text-gray-900">
                    {profile.personalInfo?.idPassport || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPinned className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Province</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.province}
                      onChange={(e) =>
                        setEditForm({ ...editForm, province: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">
                      {profile.province}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Full Address</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">
                      {profile.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Contact Method Preference
                  </p>
                  <p className="font-medium text-gray-900 capitalize">
                    {profile.personalInfo?.contactMethod || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Status Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Donor Status</p>
                {renderStatusBadge(profile.donor_status, "Donor Status")}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Screening Status</p>
                {renderStatusBadge(profile.screening_status, "Screening")}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Director Approval Status
                </p>
                {renderStatusBadge(profile.director_status, "Director")}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-500">Registration Date</p>
                </div>
                <p className="font-medium text-gray-900">
                  {profile.consent_signed_at
                    ? new Date(profile.consent_signed_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Not available"}
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-500">Total Reward Points</p>
                </div>
                <p className="text-2xl font-bold text-pink-600">
                  {profile.points_total || 0} points
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Health Screening Results */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Health Screening Questionnaire
          </h2>
          {profile.screeningAnswers ? (
            <div className="space-y-4">
              {Object.entries(profile.screeningAnswers).map(([key, value]) => {
                // Find question text from the questions array
                const questionTexts = {
                  q1: "Are you currently breastfeeding?",
                  q2: "Do you have any infectious diseases?",
                  q3: "Are you currently taking antibiotics?",
                  q4: "Do you smoke or drink alcohol?",
                  q5: "Do you have a history of cardiovascular disease?",
                  q6: "Are you being treated for chronic diseases?",
                  q7: "Have you gotten a tattoo in the past 12 months?",
                  q8: "Have you received a blood transfusion in the past 12 months?",
                  q9: "Are you willing to commit to regular milk donation?",
                  q10: "Do you agree to allow storage of your medical information?",
                };

                return (
                  <div
                    key={key}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        {questionTexts[key] || key}
                      </p>
                      <div className="flex items-center gap-4">
                        <div>{renderAnswer(value.answer)}</div>
                        {value.comment && (
                          <p className="text-sm text-gray-600 italic">
                            Note: {value.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No screening data available.</p>
          )}
        </div>

        {/* EHR Test Results */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Medical Test Results (EHR)
          </h2>
          {profile.ehrTestResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "hiv", label: "HIV Test" },
                { key: "hepatitisB", label: "Hepatitis B Test" },
                { key: "hepatitisC", label: "Hepatitis C Test" },
                { key: "syphilis", label: "Syphilis Test" },
                { key: "tuberculosis", label: "Tuberculosis (TB) Test" },
              ].map((test) => {
                const result = profile.ehrTestResults[test.key];
                const isNegative = result?.result?.toLowerCase() === "negative";

                return (
                  <div
                    key={test.key}
                    className={`p-4 rounded-lg border-2 ${
                      isNegative
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{test.label}</p>
                      {isNegative ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        isNegative ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {result?.result || "Not tested"}
                    </p>
                    {result?.test_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Test Date:{" "}
                        {new Date(result.test_date).toLocaleDateString("en-US")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No test results available.</p>
          )}
        </div>

        {/* Interview Schedule */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Interview Schedule
          </h2>
          {profile.interviewSlot ? (
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {new Date(profile.interviewSlot.date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-purple-600 font-semibold">
                  {profile.interviewSlot.time}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No interview scheduled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
