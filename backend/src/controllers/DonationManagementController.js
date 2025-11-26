const { DonationVisit, Donor, EhrDonor, User, AuditLog } = require("../models");
const { Op } = require("sequelize");

/**
 * Donation Management Controller for Staff
 * Handles donation listing, approval, and history
 */
class DonationManagementController {
  /**
   * GET /api/staff/donations
   * Get list of donations with filtering
   */
  async getDonations(req, res) {
    try {
      const {
        status,
        date,
        donor_id,
        page = 1,
        per_page = 25,
        sort_by = "scheduled_start",
        order = "desc",
      } = req.query;

      const limit = parseInt(per_page);
      const offset = (parseInt(page) - 1) * limit;

      // Build where clause
      const where = {};

      if (status && status !== "all") {
        where.status = status;
      }

      if (donor_id) {
        where.donor_id = donor_id;
      }

      if (date) {
        // Filter by specific date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        where.scheduled_start = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }

      // Get donations with donor info
      const { count, rows: donations } = await DonationVisit.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sort_by, order.toUpperCase()]],
        include: [
          {
            model: Donor,
            as: "donor",
            attributes: ["donor_id", "donor_status"],
            include: [
              {
                model: EhrDonor,
                as: "ehrData",
                attributes: ["full_name", "phone", "email"],
              },
            ],
          },
          {
            model: User,
            as: "recorder",
            attributes: ["user_id", "email"],
          },
        ],
      });

      // Calculate pagination
      const total_pages = Math.ceil(count / limit);

      return res.json({
        message: "Donations retrieved successfully",
        data: {
          donations,
          pagination: {
            current_page: parseInt(page),
            per_page: limit,
            total: count,
            total_pages,
            has_more: parseInt(page) < total_pages,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching donations:", error);
      return res.status(500).json({
        message: "Failed to fetch donations",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/staff/donations/:id
   * Get donation detail by ID
   */
  async getDonationDetail(req, res) {
    try {
      const { id } = req.params;

      const donation = await DonationVisit.findByPk(id, {
        include: [
          {
            model: Donor,
            as: "donor",
            attributes: ["donor_id", "donor_status", "points_total"],
            include: [
              {
                model: EhrDonor,
                as: "ehrData",
                attributes: [
                  "full_name",
                  "phone",
                  "email",
                  "date_of_birth",
                  "address",
                ],
              },
            ],
          },
          {
            model: User,
            as: "recorder",
            attributes: ["user_id", "email"],
          },
        ],
      });

      if (!donation) {
        return res.status(404).json({
          message: "Donation not found",
        });
      }

      return res.json({
        message: "Donation detail retrieved successfully",
        data: donation,
      });
    } catch (error) {
      console.error("Error fetching donation detail:", error);
      return res.status(500).json({
        message: "Failed to fetch donation detail",
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/staff/donations/:id
   * Update donation record
   */
  async updateDonation(req, res) {
    try {
      const { id } = req.params;
      const {
        volume_ml,
        milk_quality,
        storage_notes,
        status: donationStatus,
      } = req.body;
      const staff = req.user;

      const donation = await DonationVisit.findByPk(id);

      if (!donation) {
        return res.status(404).json({
          message: "Donation not found",
        });
      }

      // Update donation
      const updates = {};
      if (volume_ml !== undefined) updates.volume_ml = volume_ml;
      if (milk_quality !== undefined) updates.quality_note = milk_quality;
      if (storage_notes !== undefined) updates.quality_note = storage_notes;
      if (donationStatus !== undefined) updates.status = donationStatus;

      await donation.update(updates);

      // Log audit
      await AuditLog.create({
        user_id: staff.user_id,
        action: "update",
        resource_type: "donation",
        resource_id: id,
        changes: updates,
        ip_address: req.ip,
        user_agent: req.get("user-agent"),
      });

      return res.json({
        message: "Donation updated successfully",
        data: donation,
      });
    } catch (error) {
      console.error("Error updating donation:", error);
      return res.status(500).json({
        message: "Failed to update donation",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/staff/donations/stats
   * Get donation statistics
   */
  async getDonationStats(req, res) {
    try {
      const { start_date, end_date } = req.query;

      const where = {};

      if (start_date && end_date) {
        where.scheduled_start = {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        };
      }

      // Get total donations and volume
      const stats = await DonationVisit.findAll({
        where,
        attributes: [
          [
            DonationVisit.sequelize.fn(
              "COUNT",
              DonationVisit.sequelize.col("visit_id")
            ),
            "total_donations",
          ],
          [
            DonationVisit.sequelize.fn(
              "SUM",
              DonationVisit.sequelize.col("volume_ml")
            ),
            "total_volume",
          ],
          [
            DonationVisit.sequelize.fn(
              "AVG",
              DonationVisit.sequelize.col("volume_ml")
            ),
            "avg_volume",
          ],
        ],
        raw: true,
      });

      // Get donations by status
      const statusBreakdown = await DonationVisit.findAll({
        where,
        attributes: [
          "status",
          [
            DonationVisit.sequelize.fn(
              "COUNT",
              DonationVisit.sequelize.col("visit_id")
            ),
            "count",
          ],
        ],
        group: ["status"],
        raw: true,
      });

      return res.json({
        message: "Donation statistics retrieved successfully",
        data: {
          summary: stats[0],
          by_status: statusBreakdown,
        },
      });
    } catch (error) {
      console.error("Error fetching donation stats:", error);
      return res.status(500).json({
        message: "Failed to fetch donation statistics",
        error: error.message,
      });
    }
  }
}

module.exports = new DonationManagementController();
