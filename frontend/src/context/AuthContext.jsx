import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { setAuthToken, clearAuthToken } from "../utils/token";
import { api } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const useMock = Boolean(import.meta.env?.VITE_USE_MOCK);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (token) {
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }

        setAuthToken(token);
        setUser({
          user_id: decoded.user_id,
          id: decoded.user_id,
          email: decoded.email,
          role: decoded.role,
          username: decoded.email, // Use email as username
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Token validation error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get role-based redirect
  const getRoleBasedRedirect = (role) => {
    if (role === "donor") return "/"; // Donors go to landing page
    if (role === "medical_staff" || role === "admin_staff")
      return "/staff/dashboard";
    if (role === "milk_bank_manager") return "/manager/dashboard";
    return "/";
  };

  const login = async (credentials, rememberMe = false) => {
    try {
      if (useMock) {
        const mockToken = btoa(
          JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            user_id: "mock-user",
            email: credentials.email,
            role: "donor",
          })
        );
        if (rememberMe) {
          localStorage.setItem("token", mockToken);
        } else {
          sessionStorage.setItem("token", mockToken);
        }
        setAuthToken(mockToken);
        setUser({
          user_id: "mock-user",
          id: "mock-user",
          email: credentials.email,
          role: "donor",
          username: credentials.email,
        });
        setIsAuthenticated(true);
        return {
          success: true,
          user: { email: credentials.email, role: "donor" },
          redirectUrl: "/donor/dashboard",
        };
      }
      const response = await api.post("/auth/login", credentials);
      const { accessToken, user: userData, redirectUrl } = response.data;

      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem("token", accessToken);
      } else {
        sessionStorage.setItem("token", accessToken);
      }

      setAuthToken(accessToken);
      setUser({
        user_id: userData.user_id,
        id: userData.user_id,
        email: userData.email,
        role: userData.role,
        username: userData.email, // Use email as username since backend doesn't have username
      });
      setIsAuthenticated(true);

      // Fallback redirect logic if backend doesn't provide redirectUrl
      const finalRedirect = redirectUrl || getRoleBasedRedirect(userData.role);

      return { success: true, user: userData, redirectUrl: finalRedirect };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      if (useMock) {
        return { success: true, message: "Registration successful (mock)" };
      }
      const response = await api.post("/auth/register", userData);
      return {
        success: true,
        message: "Registration successful",
        details: response.data.details, // Pass backend validation errors if any
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        details: error.response?.data?.details || [], // Backend field errors
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (donorProfile) => {
    setUser((prevUser) => ({
      ...prevUser,
      donorProfile: donorProfile,
    }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
