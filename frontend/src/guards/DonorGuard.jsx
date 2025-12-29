import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { donorService } from "../services/donorService";

/**
 * DonorGuard - Protect routes that require completed donor registration
 *
 * Behavior:
 * 1. User not logged in → redirect to /login
 * 2. User logged in but no donor profile → redirect to /donor/register with note
 * 3. User has donor profile but pending approval → show waiting message
 * 4. User approved → allow access
 */
export const DonorGuard = ({ children, requireApproved = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [donorStatus, setDonorStatus] = useState(null);

  useEffect(() => {
    checkDonorStatus();
  }, []);

  const checkDonorStatus = async () => {
    try {
      // Check if user is logged in
      const currentUser = authService.getCurrentUser();

      if (!currentUser) {
        // Not logged in → redirect to login
        navigate("/login", {
          state: {
            from: location.pathname,
            message: "Please login to continue",
          },
        });
        return;
      }

      // Check if user has donor profile
      const profile = await donorService.getProfile();

      if (!profile || !profile.donor_id) {
        // No donor profile → redirect to registration
        navigate("/donor/register", {
          state: {
            from: location.pathname,
            isNewUser: true,
            message:
              "🎉 Welcome! Please complete donor registration to use this feature.",
          },
        });
        return;
      }

      // Has profile, check approval status
      setDonorStatus(profile);

      if (requireApproved && profile.donor_status !== "approved") {
        // Pending approval
        navigate("/donor/pending", {
          state: {
            status: profile.donor_status,
            screening_status: profile.screening_status,
            director_status: profile.director_status,
          },
        });
        return;
      }

      // All checks passed
      setLoading(false);
    } catch (error) {
      console.error("Error checking donor status:", error);

      if (error.response?.status === 404) {
        // No donor profile found
        navigate("/donor/register", {
          state: {
            from: location.pathname,
            isNewUser: true,
            message:
              "🎉 Welcome! Please complete donor registration to use this feature.",
          },
        });
      } else {
        // Other error
        navigate("/error", {
          state: {
            message: "An error occurred while checking donor information",
          },
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking information...</p>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * Hook to check donor status anywhere in the app
 */
export const useDonorStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const profile = await donorService.getProfile();
      setStatus({
        hasProfile: !!profile,
        isApproved: profile?.donor_status === "approved",
        isPending: profile?.donor_status === "pending",
        isRejected: profile?.donor_status === "rejected",
        profile,
      });
    } catch (error) {
      setStatus({
        hasProfile: false,
        isApproved: false,
        isPending: false,
        isRejected: false,
        profile: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, refresh: checkStatus };
};
