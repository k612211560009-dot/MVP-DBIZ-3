const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const ScheduleGeneratorService = require("../services/ScheduleGeneratorService");

/**
 * POST /api/schedules/generate
 * Generate donation schedules for a donor
 * Can be called by:
 * - System (when donor is approved)
 * - Admin/Staff (manual trigger)
 * - Donor (if they update preferences)
 */
router.post("/generate", authenticate, async (req, res) => {
  try {
    const { donor_id, month } = req.body;
    const targetDonorId = donor_id || req.user.user_id;

    // Check authorization
    if (
      req.user.user_id !== targetDonorId &&
      !["admin_staff", "medical_staff", "milk_bank_manager"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message: "Not authorized to generate schedules for other donors",
      });
    }

    const visits = await ScheduleGeneratorService.generateMonthlySchedule(
      targetDonorId,
      { month }
    );

    res.json({
      success: true,
      message: `Generated ${visits.length} visits`,
      data: { visits },
    });
  } catch (error) {
    console.error("Generate schedule error:", error);
    res.status(500).json({
      error: "Failed to generate schedule",
      message: error.message,
    });
  }
});

/**
 * POST /api/schedules/auto-approve/:donor_id
 * Trigger auto-schedule generation when donor is approved
 * Staff/Admin only
 */
router.post(
  "/auto-approve/:donor_id",
  authenticate,
  authorize(["admin_staff", "medical_staff", "milk_bank_manager"]),
  async (req, res) => {
    try {
      const { donor_id } = req.params;

      const result = await ScheduleGeneratorService.onDonorApproved(donor_id);

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          data: { visits: result.visits },
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Auto-approve schedule error:", error);
      res.status(500).json({
        error: "Failed to auto-generate schedule",
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/schedules/check/:donor_id
 * Check if donor needs schedule generation
 * Staff/Admin only
 */
router.get(
  "/check/:donor_id",
  authenticate,
  authorize(["admin_staff", "medical_staff", "milk_bank_manager"]),
  async (req, res) => {
    try {
      const { donor_id } = req.params;

      const needsGeneration =
        await ScheduleGeneratorService.needsScheduleGeneration(donor_id);

      res.json({
        success: true,
        data: {
          donor_id,
          needs_generation: needsGeneration,
          next_month: require("moment")().add(1, "month").format("YYYY-MM"),
        },
      });
    } catch (error) {
      console.error("Check schedule error:", error);
      res.status(500).json({
        error: "Failed to check schedule",
        message: error.message,
      });
    }
  }
);

module.exports = router;
