import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User role not allowed, redirect to their own dashboard based on role
    let userDashboard = "/";

    if (user?.role === "donor") {
      userDashboard = "/donor/dashboard";
    } else if (
      user?.role === "staff" ||
      user?.role === "medical_staff" ||
      user?.role === "admin_staff"
    ) {
      userDashboard = "/staff/dashboard";
    } else if (user?.role === "milk_bank_manager") {
      userDashboard = "/manager/dashboard";
    }

    return <Navigate to={userDashboard} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
