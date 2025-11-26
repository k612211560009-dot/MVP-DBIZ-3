const express = require("express");
const DonorController = require("../controllers/DonorController");
const DonorProfileController = require("../controllers/DonorProfileController");
const DonorRegistrationController = require("../controllers/DonorRegistrationController");
const { authenticate, authorize } = require("../middleware/auth");
const { validationMiddleware } = require("../middleware/validation");
const Joi = require("joi");

const router = express.Router();

/**
 * Donor validation schemas
 */
const donorValidation = {
  updateDonor: Joi.object({
    date_of_birth: Joi.date().optional(),
    address: Joi.string().max(500).optional(),
    emergency_contact: Joi.object().optional(),
    donor_status: Joi.string()
      .valid(
        "in_progress",
        "active",
        "suspended",
        "removed",
        "rejected",
        "failed_positive",
        "abandoned"
      )
      .optional(),
    screening_status: Joi.string()
      .valid("pending", "approved", "rejected")
      .optional(),
    director_status: Joi.string()
      .valid("pending", "approved", "rejected")
      .optional(),
    registration_step: Joi.number().integer().min(1).max(10).optional(),
    weekly_availability: Joi.object().optional(),
    home_bank_id: Joi.string().guid({ version: "uuidv4" }).optional(),
    email: Joi.string().email().optional(),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid(
        "in_progress",
        "active",
        "suspended",
        "removed",
        "rejected",
        "failed_positive",
        "abandoned"
      )
      .required(),
    reason: Joi.string().max(500).optional(),
  }),
};

/**
 * Donor Routes
 */

// @route   POST /api/donors/register
// @desc    Submit donor registration (for donor portal)
// @access  Private (Donor only)
router.post(
  "/register",
  authenticate,
  async (req, res, next) => {
    if (req.user.role !== "donor") {
      return res.status(403).json({
        error: "Access forbidden",
        message: "This endpoint is only for donors",
      });
    }
    next();
  },
  DonorRegistrationController.submitRegistration
);

// @route   GET /api/donors/registration/status
// @desc    Get registration status
// @access  Private (Donor only)
router.get(
  "/registration/status",
  authenticate,
  async (req, res, next) => {
    if (req.user.role !== "donor") {
      return res.status(403).json({
        error: "Access forbidden",
        message: "This endpoint is only for donors",
      });
    }
    next();
  },
  DonorRegistrationController.getRegistrationStatus
);

// @route   GET /api/donors/profile
// @desc    Get current donor's profile (for donor portal)
// @access  Private (Donor only)
router.get(
  "/profile",
  authenticate,
  async (req, res, next) => {
    // Only allow donors to access this endpoint
    if (req.user.role !== "donor") {
      return res.status(403).json({
        error: "Access forbidden",
        message: "This endpoint is only for donors",
      });
    }
    next();
  },
  DonorProfileController.getProfile
);

// @route   PUT /api/donors/profile
// @desc    Update current donor's profile
// @access  Private (Donor only)
router.put(
  "/profile",
  authenticate,
  async (req, res, next) => {
    if (req.user.role !== "donor") {
      return res.status(403).json({
        error: "Access forbidden",
        message: "This endpoint is only for donors",
      });
    }
    next();
  },
  DonorProfileController.updateProfile
);

// @route   GET /api/donors
// @desc    Get all donors with filtering and pagination
// @access  Private (Staff, Admin)
router.get(
  "/",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validatePagination,
  DonorController.getDonors
);

// @route   GET /api/donors/:id
// @desc    Get donor by ID with detailed information
// @access  Private (Staff, Admin, or Own Profile)
router.get(
  "/:id",
  authenticate,
  validationMiddleware.validateUUID("id"),
  async (req, res, next) => {
    // Allow donors to access their own profile
    if (req.user.role === "donor" && req.user.user_id !== req.params.id) {
      return res.status(403).json({
        error: "Access forbidden",
        message: "You can only access your own profile",
      });
    }
    next();
  },
  DonorController.getDonorById
);

// @route   GET /api/donors/:id/dashboard
// @desc    Get donor dashboard statistics
// @access  Private (Staff, Admin, or Own Profile)
router.get(
  "/:id/dashboard",
  authenticate,
  validationMiddleware.validateUUID("id"),
  async (req, res, next) => {
    // Allow donors to access their own dashboard
    if (req.user.role === "donor" && req.user.user_id !== req.params.id) {
      return res.status(403).json({
        error: "Access forbidden",
        message: "You can only access your own dashboard",
      });
    }
    next();
  },
  DonorController.getDonorDashboard
);

// @route   PUT /api/donors/:id
// @desc    Update donor profile
// @access  Private (Staff, Admin, or Own Profile)
router.put(
  "/:id",
  authenticate,
  validationMiddleware.validateUUID("id"),
  validationMiddleware.validateCustom(donorValidation.updateDonor),
  async (req, res, next) => {
    // Allow donors to update their own profile (limited fields)
    if (req.user.role === "donor") {
      if (req.user.user_id !== req.params.id) {
        return res.status(403).json({
          error: "Access forbidden",
          message: "You can only update your own profile",
        });
      }

      // Restrict fields that donors can update
      const allowedFields = [
        "date_of_birth",
        "address",
        "emergency_contact",
        "weekly_availability",
        "email",
      ];
      const restrictedFields = Object.keys(req.body).filter(
        (field) => !allowedFields.includes(field)
      );

      if (restrictedFields.length > 0) {
        return res.status(403).json({
          error: "Access forbidden",
          message: `Donors cannot update the following fields: ${restrictedFields.join(
            ", "
          )}`,
        });
      }
    }
    next();
  },
  DonorController.updateDonor
);

// @route   PATCH /api/donors/:id/status
// @desc    Update donor status
// @access  Private (Staff, Admin only)
router.patch(
  "/:id/status",
  authenticate,
  authorize("staff", "admin", "coordinator"),
  validationMiddleware.validateUUID("id"),
  validationMiddleware.validateCustom(donorValidation.updateStatus),
  DonorController.updateDonorStatus
);

// @route   GET /api/donors/:id/points
// @desc    Get donor's point transactions
// @access  Private (Staff, Admin, or Own Profile)
router.get(
  "/:id/points",
  authenticate,
  validationMiddleware.validateUUID("id"),
  validationMiddleware.validatePagination,
  async (req, res, next) => {
    // Allow donors to access their own points
    if (req.user.role === "donor" && req.user.user_id !== req.params.id) {
      return res.status(403).json({
        error: "Access forbidden",
        message: "You can only access your own point transactions",
      });
    }
    next();
  },
  DonorController.getDonorPoints
);

// ========== Donor-facing Routes (for donor portal) ==========

// @route   POST /api/donors/:id/appointments
// @desc    Book a new appointment (donor-facing)
// @access  Private (Donor only)
router.post(
  "/:id/appointments",
  authenticate,
  async (req, res, next) => {
    // Ensure donor can only book for themselves
    if (req.user.role === "donor" && req.user.user_id !== req.params.id) {
      return res.status(403).json({
        error: "Access forbidden",
        message: "You can only book appointments for yourself",
      });
    }
    next();
  },
  DonorController.bookAppointment
);

// @route   GET /api/donors/:id/appointments/upcoming
// @desc    Get donor's upcoming appointments
// @access  Private (Donor only)
router.get(
  "/:id/appointments/upcoming",
  authenticate,
  async (req, res, next) => {
    if (req.user.role === "donor" && req.user.user_id !== req.params.id) {
      return res.status(403).json({
        error: "Access forbidden",
      });
    }
    next();
  },
  DonorController.getUpcomingAppointments
);

// @route   GET /api/donors/appointments/available-slots
// @desc    Get available appointment slots (public for donors)
// @access  Private
router.get(
  "/appointments/available-slots",
  authenticate,
  DonorController.getAvailableSlots
);

module.exports = router;
