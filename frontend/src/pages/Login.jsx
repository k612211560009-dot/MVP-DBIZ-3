import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Award,
  Mail,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(
    !location.pathname.includes("/register")
  );
  const [searchParams] = useSearchParams();
  const [roleContext, setRoleContext] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Debug: Log when error changes
  useEffect(() => {
    if (error) {
      console.log("🔴 Error set:", error);
    }
  }, [error]);

  // Check for role-specific access from URL params
  useEffect(() => {
    const role = searchParams.get("role");
    if (role) {
      setRoleContext(role);
      // Persist role context in sessionStorage to survive errors
      sessionStorage.setItem("loginRoleContext", role);
    } else {
      // If no URL param, try to restore from sessionStorage
      const savedRole = sessionStorage.getItem("loginRoleContext");
      if (savedRole) {
        setRoleContext(savedRole);
      }
    }
    // Check if we're on the register page
    if (location.pathname.includes("/register")) {
      setIsLogin(false);
    }
  }, [searchParams, location]);

  const getRoleInfo = (role) => {
    switch (role) {
      case "medical_staff":
        return {
          title: "Hospital Staff Login",
          subtitle: "Access medical management system",
          icon: Shield,
          color: "blue",
        };
      case "donor":
        return {
          title: "Donor Login",
          subtitle: "Manage your donation profile",
          icon: Heart,
          color: "pink",
        };
      default:
        return {
          title: "System Login",
          subtitle: "Access Breast Milk Bank",
          icon: Heart,
          color: "pink",
        };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear global error when user starts typing
    if (error) {
      setError("");
    }

    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }

    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "username":
        if (!isLogin && value) {
          // Username validation for registration
          if (value.length < 3) {
            errorMsg = "Username must be at least 3 characters long";
          } else if (value.length > 50) {
            errorMsg = "Username must not exceed 50 characters";
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            errorMsg =
              "Username can only contain letters, numbers, and underscores";
          }
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMsg = "Email is required";
        } else if (!emailRegex.test(value)) {
          errorMsg = "Please provide a valid email address";
        } else if (value.length > 255) {
          errorMsg = "Email must not exceed 255 characters";
        }
        break;

      case "password":
        if (!value) {
          errorMsg = "Password is required";
        } else if (value.length < 8) {
          errorMsg = "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])/.test(value)) {
          errorMsg = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          errorMsg = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          errorMsg = "Password must contain at least one number";
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          errorMsg =
            "Password must contain at least one special character (@$!%*?&)";
        }
        break;

      case "confirmPassword":
        if (!isLogin && value !== formData.password) {
          errorMsg = "Passwords do not match";
        }
        break;

      case "fullName":
        if (!isLogin) {
          if (!value) {
            errorMsg = "Full name is required";
          } else if (value.length < 2) {
            errorMsg = "Full name must be at least 2 characters long";
          } else if (value.length > 255) {
            errorMsg = "Full name must not exceed 255 characters";
          }
        }
        break;

      case "phoneNumber":
        if (value && !isLogin) {
          // International phone validation (more relaxed)
          // Accept + at start, then digits, spaces, dashes, parentheses
          const phoneRegex =
            /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
          if (!phoneRegex.test(value.replace(/\s/g, ""))) {
            errorMsg =
              "Please provide a valid phone number (e.g., +1234567890, 0123456789)";
          } else if (value.replace(/\D/g, "").length < 8) {
            errorMsg = "Phone number must contain at least 8 digits";
          }
        }
        break;

      case "dateOfBirth":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          if (selectedDate > today) {
            errorMsg = "Date of birth cannot be in the future";
          }
        }
        break;

      default:
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Don't clear error here - let user see previous error until backend responds

    try {
      if (isLogin) {
        const result = await login(
          {
            email: formData.email,
            password: formData.password,
          },
          rememberMe
        );

        if (result.success) {
          // Clear login role context after successful login
          sessionStorage.removeItem("loginRoleContext");

          // Check if user just registered as donor and needs to complete registration
          const donorRegistrationIntent = sessionStorage.getItem(
            "donorRegistrationIntent"
          );

          if (donorRegistrationIntent === "true") {
            sessionStorage.removeItem("donorRegistrationIntent");
            // Navigate to donor registration form
            navigate("/screening");
            return;
          }

          // Use redirectUrl from backend based on user role
          const redirectPath = result.redirectUrl || "/";
          navigate(redirectPath);
        } else {
          // Set error and keep it visible
          const errorMsg = result.message || "Invalid email or password";
          setError(errorMsg);
          console.error("Login failed:", errorMsg);
          setLoading(false);
          return;
        }
      } else {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const result = await register({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullName: formData.fullName,
          phone: formData.phoneNumber, // Backend expects 'phone' not 'phoneNumber'
          role: "donor", // Default role for registration
        });

        if (result.success) {
          // Mark that user just registered as donor and needs to complete registration
          if (roleContext === "donor") {
            sessionStorage.setItem("donorRegistrationIntent", "true");
          }

          // After successful registration, switch to login mode
          setIsLogin(true);
          setFormData({
            username: "",
            email: formData.email, // Keep email for easy login
            password: "",
            confirmPassword: "",
            fullName: "",
            phoneNumber: "",
            dateOfBirth: "",
            address: "",
          });
          toast.success("Registration successful! Please sign in.", {
            duration: 3000,
          });
        } else {
          const errorMsg =
            result.message || "Registration failed. Please try again.";

          // Handle field-specific errors from backend
          if (result.details && Array.isArray(result.details)) {
            const newFieldErrors = {};
            result.details.forEach((error) => {
              newFieldErrors[error.field] = error.message;
            });
            setFieldErrors(newFieldErrors);
          }

          setError(errorMsg);
          console.error("Registration failed:", errorMsg);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      console.error("Exception:", error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = getRoleInfo(roleContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home Link */}
        <div className="text-left">
          <Link
            to="/"
            onClick={() => {
              // Clear role context when going back to home
              sessionStorage.removeItem("loginRoleContext");
            }}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <div
            className={`mx-auto h-20 w-20 bg-gradient-to-r ${
              roleInfo.color === "blue"
                ? "from-blue-500 to-blue-600"
                : roleInfo.color === "purple"
                ? "from-purple-500 to-purple-600"
                : "from-pink-500 to-rose-500"
            } rounded-full flex items-center justify-center`}
          >
            <roleInfo.icon className="h-10 w-10 text-white" />
          </div>

          {/* Role-specific title */}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? roleInfo.title : "Create account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? roleInfo.subtitle
              : "Register as a donor to help save lives"}
          </p>

          {/* Role context indicator */}
          {roleContext && (
            <div
              className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                roleInfo.color === "blue"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800"
              }`}
            >
              <roleInfo.icon className="h-3 w-3 mr-1" />
              {roleContext === "medical_staff"
                ? "Hospital Staff"
                : roleContext === "donor"
                ? "Milk Donor"
                : "System"}
            </div>
          )}
        </div>

        <div className="card p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-medium shadow-sm animate-shake">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Email/Username */}
            <div>
              <label
                htmlFor={isLogin ? "email" : "username"}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {isLogin ? "Email" : "Username"}
              </label>
              <input
                id={isLogin ? "email" : "username"}
                name={isLogin ? "email" : "username"}
                type={isLogin ? "email" : "text"}
                required
                className={`input ${
                  (isLogin ? fieldErrors.email : fieldErrors.username)
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder={
                  isLogin ? "Enter your email" : "Enter your username"
                }
                value={isLogin ? formData.email : formData.username}
                onChange={handleChange}
              />
              {(isLogin ? fieldErrors.email : fieldErrors.username) && (
                <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
                  <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {isLogin ? fieldErrors.email : fieldErrors.username}
                  </span>
                </p>
              )}
            </div>

            {/* Registration fields */}
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`input ${
                      fieldErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className={`input ${
                      fieldErrors.fullName
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{fieldErrors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    className={`input ${
                      fieldErrors.phoneNumber
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="+1234567890 or 0123456789 (optional)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  {fieldErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{fieldErrors.phoneNumber}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    className={`input ${
                      fieldErrors.dateOfBirth
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="Optional"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  {fieldErrors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{fieldErrors.dateOfBirth}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className={`input resize-none ${
                      fieldErrors.address
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="Enter your address (optional)"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {fieldErrors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{fieldErrors.address}</span>
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`input pr-10 ${
                    fieldErrors.password
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
                  <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password for registration */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`input ${
                    fieldErrors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
                    <svg
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{fieldErrors.confirmPassword}</span>
                  </p>
                )}
              </div>
            )}

            {/* Remember me for login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  onClick={() => {
                    // TODO: Implement forgot password functionality
                    alert("Forgot password feature will be implemented soon");
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {isLogin ? (
                    <LogIn className="h-4 w-4 mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  {isLogin ? "Sign In" : "Register"}
                </>
              )}
            </button>

            {/* Social Login - Hide for staff login */}
            {roleContext !== "medical_staff" &&
              roleContext !== "admin_staff" && (
                <>
                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        alert("Gmail login feature will be implemented soon");
                      }}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Mail className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Gmail
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        alert("Zalo login feature will be implemented soon");
                      }}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Zalo
                      </span>
                    </button>
                  </div>
                </>
              )}
          </form>

          {/* Toggle between login/register - Hide for staff login */}
          {roleContext !== "medical_staff" && roleContext !== "admin_staff" && (
            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFieldErrors({});
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    fullName: "",
                    phoneNumber: "",
                    dateOfBirth: "",
                    address: "",
                  });
                }}
              >
                {isLogin
                  ? "Don't have an account? Register here"
                  : "Already have an account? Sign in here"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
