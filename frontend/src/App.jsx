import React, { useState, useEffect } from "react";
import { ModernHeader } from "./components/ModernHeader";
import { ModernFooter } from "./components/ModernFooter";
import { AuthModal } from "./components/AuthModal";
import { HomePage } from "./components/HomePage";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
      setCurrentPage("dashboard");
    }
  }, []);

  const handleAuth = async (formData, mode) => {
    setIsLoading(true);
    setMessage("");
    try {
      let endpoint = "";
      let requestData = {};

      if (mode === "register") {
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
        setShowAuthModal(false);
        setCurrentPage("dashboard");
        setMessage("");
      } else {
        setMessage(
          `❌ ${mode === "register" ? "Đăng ký" : "Đăng nhập"} thất bại: ${
            data.message
          }`
        );
      }
    } catch (err) {
      setMessage(`❌ Lỗi: ${err.message}`);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentPage("home");
      setMessage("");
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleShowAuth = (mode = "login") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const renderPage = () => {
    if (isAuthenticated && currentPage === "dashboard") {
      return (
        <Dashboard
          user={currentUser}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <HomePage
        onShowAuth={handleShowAuth}
        isAuthenticated={isAuthenticated}
        user={currentUser}
      />
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {!isAuthenticated || currentPage !== "dashboard" ? (
        <ModernHeader
          isAuthenticated={isAuthenticated}
          user={currentUser}
          onShowAuth={handleShowAuth}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        />
      ) : null}

      {renderPage()}

      {!isAuthenticated || currentPage !== "dashboard" ? (
        <ModernFooter />
      ) : null}

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => {
            setShowAuthModal(false);
            setMessage("");
          }}
          onAuth={handleAuth}
          onModeSwitch={setAuthMode}
          isLoading={isLoading}
          message={message}
        />
      )}
    </div>
  );
}

export default App;
