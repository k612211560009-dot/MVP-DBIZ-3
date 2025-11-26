const express = require("express");
const router = express.Router();
const DonationVisitController = require("../controllers/DonationVisitController");
const { authenticate } = require("../middleware/auth");

/**
 * Donation Visit Routes
 * Base path: /api/donation-visits
 */

/**
 * @route   GET /api/donation-visits
 * @desc    Get all donation visits with filters
 * @access  Private (Medical Staff, Admin)
 * @query   donor_id, status, date_from, date_to, bank_id, page, limit
 */
router.get("/", authenticate, DonationVisitController.getAllVisits);

/**
 * @route   GET /api/donation-visits/:id
 * @desc    Get donation visit by ID
 * @access  Private (Medical Staff, Admin, Donor - own visits)
 * @params  id - visit_id
 */
router.get("/:id", authenticate, DonationVisitController.getVisitById);

/**
 * @route   POST /api/donation-visits
 * @desc    Create new donation visit (Schedule visit)
 * @access  Private (Medical Staff, Admin, Donor)
 * @body    { donor_id, bank_id, scheduled_start, scheduled_end, origin, notes }
 */
router.post("/", authenticate, DonationVisitController.createVisit);

/**
 * @route   PATCH /api/donation-visits/:id
 * @desc    Update donation visit (e.g., check health status)
 * @access  Private (Medical Staff, Admin)
 * @params  id - visit_id
 * @body    { status, health_status, health_notes, actual_start, actual_end }
 */
router.patch("/:id", authenticate, DonationVisitController.updateVisit);

/**
 * @route   POST /api/donation-visits/:id/record-donation
 * @desc    Record milk donation (Step 5 in Process 2)
 * @access  Private (Medical Staff, Admin)
 * @params  id - visit_id
 * @body    { milk_volume_ml, container_count, health_status, health_notes, quality_notes }
 */
router.post(
  "/:id/record-donation",
  authenticate,
  DonationVisitController.recordMilkDonation
);

/**
 * @route   GET /api/donation-visits/donor/:donor_id/upcoming
 * @desc    Get donor's upcoming visits
 * @access  Private (Medical Staff, Admin, Donor - own visits)
 * @params  donor_id
 * @query   limit
 */
router.get(
  "/donor/:donor_id/upcoming",
  authenticate,
  DonationVisitController.getDonorUpcomingVisits
);

/**
 * @route   GET /api/donation-visits/donor/:donor_id/history
 * @desc    Get donor's donation history
 * @access  Private (Medical Staff, Admin, Donor - own visits)
 * @params  donor_id
 * @query   page, limit
 */
router.get(
  "/donor/:donor_id/history",
  authenticate,
  DonationVisitController.getDonorDonationHistory
);

module.exports = router;
