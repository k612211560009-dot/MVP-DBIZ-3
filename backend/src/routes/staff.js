const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/StaffController");
const DonorManagementController = require("../controllers/DonorManagementController");
const AppointmentManagementController = require("../controllers/AppointmentManagementController");
const DonationManagementController = require("../controllers/DonationManagementController");
const { authenticate } = require("../middleware/auth");

/**
 * Staff Routes
 * All routes require authentication and staff role
 */

// Middleware to check staff role
const requireStaffRole = (req, res, next) => {
  if (
    !["medical_staff", "admin_staff", "milk_bank_manager"].includes(
      req.user.role
    )
  ) {
    return res.status(403).json({
      error: "Access denied",
      message: "This endpoint is only accessible to staff members",
    });
  }
  next();
};

// @route   GET /api/staff/dashboard
// @desc    Get staff dashboard statistics
// @access  Private (Staff only)
router.get(
  "/dashboard",
  authenticate,
  requireStaffRole,
  StaffController.getDashboard
);

// @route   GET /api/staff/profile
// @desc    Get staff profile
// @access  Private (Staff only)
router.get(
  "/profile",
  authenticate,
  requireStaffRole,
  StaffController.getProfile
);

// ========== Donor Management Routes ==========

// @route   GET /api/staff/donors
// @desc    Get list of donors with filtering and search
// @access  Private (Staff only)
router.get(
  "/donors",
  authenticate,
  requireStaffRole,
  DonorManagementController.getDonors
);

// @route   GET /api/staff/donors/stats
// @desc    Get donor statistics
// @access  Private (Staff only)
router.get(
  "/donors/stats",
  authenticate,
  requireStaffRole,
  DonorManagementController.getDonorStats
);

// @route   GET /api/staff/donors/:id
// @desc    Get detailed donor information
// @access  Private (Staff only)
router.get(
  "/donors/:id",
  authenticate,
  requireStaffRole,
  DonorManagementController.getDonorDetail
);

// @route   PATCH /api/staff/donors/:id/status
// @desc    Update donor status (approve/reject/suspend)
// @access  Private (Staff only)
router.patch(
  "/donors/:id/status",
  authenticate,
  requireStaffRole,
  DonorManagementController.updateDonorStatus
);

// @route   GET /api/staff/donors/:id/history
// @desc    Get donor activity history
// @access  Private (Staff only)
router.get(
  "/donors/:id/history",
  authenticate,
  requireStaffRole,
  DonorManagementController.getDonorHistory
);

// ========== Appointment Management Routes ==========

// @route   GET /api/staff/appointments
// @desc    Get list of appointments with filtering
// @access  Private (Staff only)
router.get(
  "/appointments",
  authenticate,
  requireStaffRole,
  AppointmentManagementController.getAppointments
);

// @route   GET /api/staff/appointments/today
// @desc    Get today's appointments
// @access  Private (Staff only)
router.get(
  "/appointments/today",
  authenticate,
  requireStaffRole,
  AppointmentManagementController.getTodayAppointments
);

// @route   GET /api/staff/appointments/stats
// @desc    Get appointment statistics
// @access  Private (Staff only)
router.get(
  "/appointments/stats",
  authenticate,
  requireStaffRole,
  AppointmentManagementController.getAppointmentStats
);

// @route   POST /api/staff/appointments/:id/check-in
// @desc    Check-in donor for appointment
// @access  Private (Staff only)
router.post(
  "/appointments/:id/check-in",
  authenticate,
  requireStaffRole,
  AppointmentManagementController.checkInAppointment
);

// @route   POST /api/staff/appointments/:id/mark-failed
// @desc    Mark appointment as failed/no-show
// @access  Private (Staff only)
router.post(
  "/appointments/:id/mark-failed",
  authenticate,
  requireStaffRole,
  AppointmentManagementController.markAppointmentFailed
);

// @route   PATCH /api/staff/appointments/:id/reschedule
// @desc    Reschedule an appointment
// @access  Private (Staff only)
router.patch(
  "/appointments/:id/reschedule",
  authenticate,
  requireStaffRole,
  AppointmentManagementController.rescheduleAppointment
);

// ========== Donation Management Routes ==========

// @route   GET /api/staff/donations
// @desc    Get list of donations with filtering
// @access  Private (Staff only)
router.get(
  "/donations",
  authenticate,
  requireStaffRole,
  DonationManagementController.getDonations
);

// @route   GET /api/staff/donations/stats
// @desc    Get donation statistics
// @access  Private (Staff only)
router.get(
  "/donations/stats",
  authenticate,
  requireStaffRole,
  DonationManagementController.getDonationStats
);

// @route   GET /api/staff/donations/:id
// @desc    Get donation detail by ID
// @access  Private (Staff only)
router.get(
  "/donations/:id",
  authenticate,
  requireStaffRole,
  DonationManagementController.getDonationDetail
);

// @route   PUT /api/staff/donations/:id
// @desc    Update donation record
// @access  Private (Staff only)
router.put(
  "/donations/:id",
  authenticate,
  requireStaffRole,
  DonationManagementController.updateDonation
);

module.exports = router;
