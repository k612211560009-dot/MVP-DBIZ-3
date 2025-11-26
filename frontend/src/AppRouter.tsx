import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import DonorList from "./pages/DonorList";
import AppointmentList from "./pages/AppointmentList";
import ScreeningForm from "./pages/ScreeningForm";
import DonorProfile from "./pages/DonorProfile";
import DonationLog from "./pages/DonationLog";
import RecordDonation from "./pages/RecordDonation";
import EHRTests from "./pages/EHRTests";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Rewards from "./pages/Rewards";
import Payments from "./pages/Payments";

// Import public pages
import About from "./pages/About.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Testimonials from "./pages/Testimonials.jsx";
import Contact from "./pages/Contact.jsx";

// Import layouts
import MainLayout from "./layouts/MainLayout.jsx";
import { StaffLayout } from "./layouts/StaffLayout.tsx";

// Import role-specific dashboards
import DonorDashboard from "./pages/donor/Dashboard.jsx";
import StaffDashboard from "./pages/staff/Dashboard.tsx";
import DirectorDashboard from "./pages/director/Dashboard.jsx";

// Import staff management pages
import StaffDonorList from "./pages/staff/DonorList";
import StaffAppointmentList from "./pages/staff/AppointmentList";
import StaffScreeningForm from "./pages/staff/ScreeningForm";
import StaffDonationLog from "./pages/staff/DonationLog";
import StaffEHRTests from "./pages/staff/EHRTests";
import StaffPayments from "./pages/staff/Payments";
import StaffAlerts from "./pages/staff/Alerts";

// Import registration flow
import RegistrationFlow from "./pages/RegistrationFlow.jsx";

// Import donor pages
import RewardsPage from "./pages/donor/RewardsPage.jsx";
import Profile from "./pages/donor/Profile.jsx";
import BookAppointment from "./pages/donor/BookAppointment.jsx";
import DonationHistory from "./pages/donor/DonationHistory.jsx";

// Import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <Routes>
          {/* Public routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />

          {/* Role-specific routes with protection */}
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/register"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <RegistrationFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/rewards"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/profile"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/appointment"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/history"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonationHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffDashboard />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffDashboard />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/donors"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffDonorList />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/appointments"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffAppointmentList />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/screening"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffScreeningForm />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/donations"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffDonationLog />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/ehr-tests"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffEHRTests />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/payments"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffPayments />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/alerts"
            element={
              <ProtectedRoute allowedRoles={["medical_staff", "admin_staff"]}>
                <StaffLayout>
                  <StaffAlerts />
                </StaffLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/director"
            element={
              <ProtectedRoute allowedRoles={["milk_bank_manager"]}>
                <DirectorDashboard />
              </ProtectedRoute>
            }
          />

          {/* App shell with sidebar/topbar and nested routes - Protected for staff */}
          <Route
            path="/"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "medical_staff",
                  "admin_staff",
                  "milk_bank_manager",
                ]}
              >
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="donors" element={<DonorList />} />
            <Route path="donors/:id" element={<DonorProfile />} />
            <Route path="appointments" element={<AppointmentList />} />
            <Route path="screening" element={<ScreeningForm />} />
            <Route path="donations" element={<DonationLog />} />
            <Route path="record-donation" element={<RecordDonation />} />
            <Route path="ehr-tests" element={<EHRTests />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="payments" element={<Payments />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
