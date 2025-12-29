import { useLocation, Link } from "react-router-dom";
import { AlertCircle, ArrowRight, X } from "lucide-react";
import { useState } from "react";

/**
 * NewUserBanner - Show banner for new users who haven't completed registration
 * Displays on Registration Form page
 */
export const NewUserBanner = () => {
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);

  const { isNewUser, from, message } = location.state || {};

  if (!isNewUser || dismissed) {
    return null;
  }

  const fromFeature = from?.includes("visit-schedule")
    ? "Lịch hiến sữa"
    : from?.includes("donation-record")
    ? "Lịch sử hiến tặng"
    : "tính năng này";

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 mb-6 rounded-r-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-blue-500" />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  🎉 Welcome to Milk Bank!
                </h3>
                <p className="text-gray-700 mb-3">
                  {message ||
                    `To use ${fromFeature}, please complete donor registration below.`}
                </p>
                <div className="bg-white/70 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>After completing registration:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      System will review your information (1-3 days)
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Donation schedule will be automatically created based on
                      your preferences
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      You can use all donor features
                    </li>
                  </ul>
                </div>
                {from && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span>You are attempting to access:</span>
                    <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                      {from}
                    </code>
                  </div>
                )}
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * FeatureLockedBanner - Show when user tries to access feature without registration
 * Used inline in feature pages
 */
export const FeatureLockedBanner = ({ featureName = "this feature" }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
      <div className="flex items-start">
        <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Donor Registration Required
          </h3>
          <p className="text-gray-700 mb-4">
            To use <strong>{featureName}</strong>, you need to complete donor
            registration.
          </p>
          <Link
            to="/donor/register"
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Register Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
