import React, { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [userType, setUserType] = useState("donor");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleAuth = async (formData) => {
    setIsLoading(true);
    setMessage("");

    try {
      let endpoint = "";
      let requestData = {};

      if (authMode === "register") {
        if (userType !== "donor") {
          setMessage(
            "❌ Only donors can register. Staff accounts are created by admin."
          );
          setIsLoading(false);
          return;
        }
        endpoint = "/api/auth/register";
        requestData = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: "donor",
        };
      } else {
        endpoint = "/api/auth/login";
        requestData = {
          email: formData.email,
          password: formData.password,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        setMessage(
          `✅ ${authMode === "register" ? "Registration" : "Login"} successful!`
        );
      } else {
        setMessage(
          `❌ ${authMode === "register" ? "Registration" : "Login"} failed: ${
            data.message
          }`
        );
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setMessage("Logged out successfully");
  };

  const AuthForm = () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      fullName: "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAuth(formData);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🥛 Milk Bank
            </h1>
            <p className="text-gray-600">
              {userType === "donor" ? "Donor Portal" : "Staff Portal"}
            </p>
          </div>

          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setUserType("donor");
                setAuthMode("login");
              }}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                userType === "donor"
                  ? "bg-white text-green-700 shadow-sm font-medium"
                  : "text-gray-600"
              }`}
            >
              👤 Donor
            </button>
            <button
              onClick={() => {
                setUserType("staff");
                setAuthMode("login");
              }}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                userType === "staff"
                  ? "bg-white text-purple-700 shadow-sm font-medium"
                  : "text-gray-600"
              }`}
            >
              👨‍⚕️ Staff
            </button>
          </div>

          {userType === "donor" && (
            <div className="flex mb-4 bg-green-50 rounded-lg p-1">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
                  authMode === "login"
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-green-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
                  authMode === "register"
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-green-700"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {userType === "staff" && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-purple-700 text-sm">
                <strong>Staff Login:</strong> Use your admin-provided
                credentials.
              </p>
              <p className="text-purple-600 text-xs mt-1">
                Demo: medical.staff@milkbank.com / StaffPassword123!
              </p>
            </div>
          )}

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.includes("✅")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "register" && userType === "donor" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                userType === "donor"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              } disabled:opacity-50`}
            >
              {isLoading
                ? "Processing..."
                : authMode === "register"
                ? "Register"
                : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const DonorDashboard = () => (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">👤 Donor Dashboard</h1>
              <p>Welcome back, {currentUser?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4">📋 My Profile</h3>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {currentUser?.name}
                </p>
                <p>
                  <strong>Email:</strong> {currentUser?.email}
                </p>
                <p>
                  <strong>Role:</strong> Donor
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600">Active</span>
                </p>
              </div>
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Edit Profile
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4">🥛 Donation History</h3>
              <div className="text-center text-gray-500 py-8">
                <p>No donations yet</p>
                <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Schedule Donation
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4">🏆 Rewards</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">0</div>
                <p className="text-gray-600">Points Earned</p>
                <button className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                  View Rewards
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">🚀 Quick Actions</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: "📅", title: "Book Appointment" },
                { icon: "📋", title: "Health Screening" },
                { icon: "💬", title: "Contact Support" },
                { icon: "📊", title: "View Reports" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
                >
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <div className="font-semibold">{action.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    const StaffDashboard = () => (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-purple-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">👨‍⚕️ Staff Dashboard</h1>
              <p>Welcome back, {currentUser?.name}!</p>
              <span className="inline-block bg-purple-700 px-2 py-1 rounded text-xs mt-1">
                {currentUser?.role?.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { value: "12", label: "Today's Appointments", color: "blue" },
              { value: "8", label: "Donations Processed", color: "green" },
              { value: "5", label: "Pending Screenings", color: "orange" },
              { value: "156", label: "Active Donors", color: "purple" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow text-center"
              >
                <div className={`text-3xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4">
                📅 Today's Appointments
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-semibold">Donor {i}</div>
                    <div className="text-sm text-gray-600">
                      10:00 AM - Donation
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                View All Appointments
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4">🥛 Recent Donations</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div>
                      <div className="font-semibold">Donor {i}</div>
                      <div className="text-sm text-gray-600">
                        250ml - Grade A
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      Processed
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Process Donation
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">⚡ Staff Actions</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: "👥", title: "Manage Donors" },
                { icon: "🔬", title: "Lab Tests" },
                { icon: "📊", title: "Reports" },
                { icon: "⚙️", title: "Settings" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
                >
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <div className="font-semibold">{action.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    return currentUser?.role === "donor" ? (
      <DonorDashboard />
    ) : (
      <StaffDashboard />
    );
  };

  return isAuthenticated ? <Dashboard /> : <AuthForm />;
}

export default App;
