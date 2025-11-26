import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  User,
  LogOut,
  Home,
  Menu,
  X,
  Gift,
  Search,
  Shield,
} from "lucide-react";
import { useState } from "react";

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileMenuOpen(false);
  };

  const handleDonorRegister = () => {
    if (!isAuthenticated) {
      // Not logged in -> Go to account registration
      navigate("/register");
    } else {
      // Already logged in -> Go to donor registration flow
      navigate("/donor/register");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-pink-600" />
                <span className="text-xl font-bold text-gray-900">
                  Milk Bank
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/testimonials"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Testimonials
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Desktop Right Side - Search + CTA + Profile/Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Icon */}
              <button className="text-gray-600 hover:text-pink-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Register to Donate Button */}
              <button
                onClick={handleDonorRegister}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
              >
                Register to Donate
              </button>

              {/* Profile Menu or Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-pink-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {user?.email?.split("@")[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                        <Link
                          to={`/${user?.role}/dashboard`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <Home className="h-4 w-4" />
                            <span>Dashboard</span>
                          </div>
                        </Link>
                        <Link
                          to={`/${user?.role}/profile`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </div>
                        </Link>
                        {user?.role === "donor" && (
                          <Link
                            to="/donor/rewards"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <Gift className="h-4 w-4" />
                              <span>Redeem Gift</span>
                            </div>
                          </Link>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-pink-600 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?role=medical_staff"
                    className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg border border-gray-300 flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>For Hospital Staff</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button + Search */}
            <div className="flex md:hidden items-center space-x-3">
              {/* Search Icon - Mobile */}
              <button className="text-gray-600 hover:text-pink-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Hamburger Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/how-it-works"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/testimonials"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <button
                onClick={() => {
                  handleDonorRegister();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 rounded-md"
              >
                Register to Donate
              </button>

              {isAuthenticated ? (
                <>
                  <hr className="my-2" />
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">
                    {user?.email}
                  </div>
                  <Link
                    to={`/${user?.role}/dashboard`}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={`/${user?.role}/profile`}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user?.role === "donor" && (
                    <Link
                      to="/donor/rewards"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5" />
                        <span>Redeem Gift</span>
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?role=medical_staff"
                    className="flex items-center justify-center space-x-2 px-3 py-2 text-base font-medium bg-black text-white hover:bg-gray-800 rounded-md shadow-md border border-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    <span>For Hospital Staff</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
