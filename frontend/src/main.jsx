import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import "./index.css";

/**
 * Auto-clear tokens when domain changes (localhost <-> ngrok)
 * This fixes the issue where tokens saved on localhost don't work on ngrok and vice versa
 */
const currentDomain = window.location.hostname;
const lastDomain = localStorage.getItem("lastDomain");

if (lastDomain && lastDomain !== currentDomain) {
  console.log(`🔄 Domain changed from ${lastDomain} to ${currentDomain}`);
  console.log("🧹 Clearing old authentication tokens...");

  // Clear all auth-related data
  localStorage.removeItem("authToken");
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("token");

  console.log("✅ Tokens cleared. Please login again.");
}

// Save current domain for next time
localStorage.setItem("lastDomain", currentDomain);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);
