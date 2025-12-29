const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const { authenticate, authorize } = require("../middleware/auth");

// All notification routes require staff authentication
router.use(authenticate);
router.use(
  authorize("staff", "medical_staff", "admin_staff", "milk_bank_manager")
);

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications with filters
 * @access  Private (Staff only)
 */
router.get("/", NotificationController.getNotifications);

/**
 * @route   PATCH /api/notifications/:id/status
 * @desc    Update notification status (read/resolved)
 * @access  Private (Staff only)
 */
router.patch("/:id/status", NotificationController.updateNotificationStatus);

module.exports = router;
