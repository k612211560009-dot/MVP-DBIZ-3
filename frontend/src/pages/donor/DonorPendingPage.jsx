import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

/**
 * DonorPendingPage - Show waiting status for pending donors
 */
export const DonorPendingPage = () => {
  const location = useLocation();
  const { status, screening_status, director_status } = location.state || {};

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case "approved":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "rejected":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = (statusValue) => {
    switch (statusValue) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending";
      default:
        return "Not Processed";
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your donor application is under review
            </h1>
            <p className="text-gray-600">
              We are reviewing your information. This process typically takes
              1-3 business days.
            </p>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4 mb-8">
            {/* Overall Status */}
            <div
              className={`border-2 rounded-lg p-4 ${getStatusColor(status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <div>
                    <p className="font-semibold text-gray-900">
                      Overall Status
                    </p>
                    <p className="text-sm text-gray-600">
                      {getStatusText(status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screening Status */}
            <div
              className={`border-2 rounded-lg p-4 ${getStatusColor(
                screening_status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(screening_status)}
                  <div>
                    <p className="font-semibold text-gray-900">
                      Medical Screening
                    </p>
                    <p className="text-sm text-gray-600">
                      {getStatusText(screening_status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Director Status */}
            <div
              className={`border-2 rounded-lg p-4 ${getStatusColor(
                director_status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(director_status)}
                  <div>
                    <p className="font-semibold text-gray-900">
                      Director Approval
                    </p>
                    <p className="text-sm text-gray-600">
                      {getStatusText(director_status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  What happens next?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      The medical team will review your screening information
                    </li>
                    <li>The milk bank director will give final approval</li>
                    <li>
                      You will receive an email notification when there is a
                      result
                    </li>
                    <li>
                      After approval, your donation schedule will be
                      automatically created
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Link
              to="/donor/profile"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View Personal Information
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Have questions?{" "}
              <Link to="/contact" className="text-blue-600 hover:text-blue-500">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
