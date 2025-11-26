const express = require("express");
const ScreeningController = require("../controllers/ScreeningController");
const { authenticate, authorize } = require("../middleware/auth");
const { validationMiddleware } = require("../middleware/validation");
const Joi = require("joi");

const router = express.Router();

/**
 * Screening validation schemas
 */
const screeningValidation = {
  createScreening: Joi.object({
    donor_id: Joi.string().guid({ version: "uuidv4" }).required(),
    appointment_id: Joi.string().guid({ version: "uuidv4" }).optional(),
    questionnaire_data: Joi.object().required(),
    interview_notes: Joi.string().max(2000).optional(),
    health_status: Joi.object().optional(),
    consent_signed: Joi.boolean().default(false),
    consent_document_url: Joi.string().uri().max(500).optional(),
  }),

  updateScreening: Joi.object({
    questionnaire_data: Joi.object().optional(),
    interview_notes: Joi.string().max(2000).optional(),
    health_status: Joi.object().optional(),
    consent_signed: Joi.boolean().optional(),
    consent_document_url: Joi.string().uri().max(500).optional(),
    screening_result: Joi.string()
      .valid("passed", "failed", "pending_review")
      .optional(),
    next_steps: Joi.string().max(1000).optional(),
    expiry_date: Joi.date().iso().optional(),
  }),

  submitResult: Joi.object({
    screening_result: Joi.string()
      .valid("passed", "failed", "pending_review")
      .required(),
    next_steps: Joi.string().max(1000).optional(),
    expiry_date: Joi.date().iso().optional(),
  }),
};

/**
 * Screening Routes
 */

// @route   GET /api/screening
// @desc    Get all screening sessions with filtering
// @access  Private (Staff, Admin)
router.get(
  "/",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validatePagination,
  ScreeningController.getScreeningSessions
);

// @route   GET /api/screening/form-template
// @desc    Get screening form template
// @access  Private (Staff, Admin)
router.get(
  "/form-template",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  ScreeningController.getFormTemplate
);

// @route   GET /api/screening/:id
// @desc    Get screening session by ID
// @access  Private (Staff, Admin)
router.get(
  "/:id",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validateUUID("id"),
  ScreeningController.getScreeningById
);

// @route   POST /api/screening
// @desc    Create new screening session
// @access  Private (Staff, Admin, Nurse)
router.post(
  "/",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validateCustom(screeningValidation.createScreening),
  ScreeningController.createScreening
);

// @route   PUT /api/screening/:id
// @desc    Update screening session
// @access  Private (Staff, Admin, Nurse)
router.put(
  "/:id",
  authenticate,
  authorize("staff", "admin", "nurse", "coordinator"),
  validationMiddleware.validateUUID("id"),
  validationMiddleware.validateCustom(screeningValidation.updateScreening),
  ScreeningController.updateScreening
);

// @route   POST /api/screening/:id/review
// @desc    Submit screening result (review)
// @access  Private (Staff, Admin)
router.post(
  "/:id/review",
  authenticate,
  authorize("staff", "admin", "coordinator"),
  validationMiddleware.validateUUID("id"),
  validationMiddleware.validateCustom(screeningValidation.submitResult),
  ScreeningController.submitScreeningResult
);

module.exports = router;
