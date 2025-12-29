const express = require("express");
const AppointmentController = require("../controllers/AppointmentController");
const { authenticate, authorize } = require("../middleware/auth");
const { validationMiddleware } = require("../middleware/validation");
const Joi = require("joi");

const router = express.Router();

/**
 * Appointment validation schemas
 */
const appointmentValidation = {
  createAppointment: Joi.object({
    donor_id: Joi.string().guid({ version: "uuidv4" }).required(),
    bank_id: Joi.string().guid({ version: "uuidv4" }).optional(),
    appointment_type: Joi.string()
      .valid("screening", "donation", "medical_test", "consultation")
      .required(),
    appointment_date: Joi.date().iso().required(),
    time_slot: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
    notes: Joi.string().max(1000).optional(),
    preparation_instructions: Joi.string().max(1000).optional(),
  }),

  bookAppointment: Joi.object({
    date: Joi.date().iso().required(),
    time: Joi.string()
      .pattern(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] - ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      )
      .required(),
    type: Joi.string()
      .valid("screening", "donation", "medical_test", "consultation")
      .default("donation"),
    notes: Joi.string().max(1000).optional().allow(""),
  }),

  updateAppointment: Joi.object({
    bank_id: Joi.string().guid({ version: "uuidv4" }).optional(),
    appointment_type: Joi.string()
      .valid("screening", "donation", "medical_test", "consultation")
      .optional(),
    appointment_date: Joi.date().iso().optional(),
    time_slot: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
    status: Joi.string()
      .valid(
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show"
      )
      .optional(),
    priority_level: Joi.string()
      .valid("low", "normal", "high", "urgent")
      .optional(),
    notes: Joi.string().max(1000).optional(),
    preparation_instructions: Joi.string().max(1000).optional(),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid(
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show"
      )
      .required(),
    reason: Joi.string().max(500).optional(),
  }),

  cancelAppointment: Joi.object({
    reason: Joi.string().max(500).optional(),
  }),

  availableSlots: Joi.object({
    date: Joi.date().iso().required(),
    type: Joi.string()
      .valid("screening", "donation", "medical_test", "consultation")
      .optional(),
    duration: Joi.number().integer().min(15).max(120).optional(),
  }),
};

/**
 * Appointment Routes
 */

// @route   GET /api/appointments
// @desc    Get all appointments with filtering
// @access  Private (Staff, Admin, Donor)
router.get(
  "/",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator", "donor"),
  validationMiddleware.validatePagination,
  AppointmentController.getAppointments
);

// @route   GET /api/appointments/available-slots
// @desc    Get available time slots for a specific date
// @access  Private (Donor, Staff, Admin)
router.get(
  "/available-slots",
  authenticate,
  authorize("donor", "staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validateCustom(
    appointmentValidation.availableSlots,
    "query"
  ),
  AppointmentController.getAvailableSlots
);

// @route   GET /api/appointments/upcoming
// @desc    Get upcoming appointments for current user
// @access  Private (Donor)
router.get(
  "/upcoming",
  authenticate,
  async (req, res, next) => {
    // For donors, get their own upcoming appointments
    if (req.user.role === "donor") {
      req.params.id = req.user.user_id;
    }
    next();
  },
  AppointmentController.getUpcomingAppointments
);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private (Staff, Admin, or appointment owner)
router.get(
  "/:id",
  authenticate,
  validationMiddleware.validateUUID("id"),
  async (req, res, next) => {
    // If user is a donor, verify they own this appointment
    if (req.user.role === "donor") {
      // This would require additional logic to check appointment ownership
      // For now, we'll allow it and let the controller handle the filtering
    }
    next();
  },
  AppointmentController.getAppointmentById
);

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private (Staff, Admin)
router.post(
  "/",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validateCustom(appointmentValidation.createAppointment),
  AppointmentController.createAppointment
);

// @route   POST /api/appointments/book
// @desc    Book appointment (for donors)
// @access  Private (Donor)
router.post(
  "/book",
  authenticate,
  authorize("donor"),
  validationMiddleware.validateCustom(appointmentValidation.bookAppointment),
  AppointmentController.bookAppointment
);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private (Staff, Admin)
router.put(
  "/:id",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validateUUID("id"),
  validationMiddleware.validateCustom(appointmentValidation.updateAppointment),
  AppointmentController.updateAppointment
);

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (Staff, Admin)
router.patch(
  "/:id/status",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validateUUID("id"),
  validationMiddleware.validateCustom(appointmentValidation.updateStatus),
  AppointmentController.updateAppointmentStatus
);

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private (Staff, Admin)
router.delete(
  "/:id",
  authenticate,
  authorize("staff", "admin", "coordinator"),
  validationMiddleware.validateUUID("id"),
  validationMiddleware.validateCustom(appointmentValidation.cancelAppointment),
  AppointmentController.cancelAppointment
);

module.exports = router;
