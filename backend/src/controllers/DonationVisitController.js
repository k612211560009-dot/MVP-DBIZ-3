const {
  DonationVisit,
  VisitSchedule,
  Donor,
  User,
  MilkBank,
  PointTransaction,
  RewardRules,
} = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

/**
 * DonationVisitController
 * Handles donation visit operations for Process 2: Donated Milk Collection
 */
class DonationVisitController {
  /**
   * Get all donation visits with filters
   * GET /api/donation-visits
   */
  async getAllVisits(req, res) {
    try {
      const {
        donor_id,
        status,
        date_from,
        date_to,
        bank_id,
        page = 1,
        limit = 20,
      } = req.query;

      const where = {};

      if (donor_id) where.donor_id = donor_id;
      if (status) where.status = status;
      if (bank_id) where.bank_id = bank_id;

      if (date_from || date_to) {
        where.scheduled_start = {};
        if (date_from) where.scheduled_start[Op.gte] = new Date(date_from);
        if (date_to) where.scheduled_start[Op.lte] = new Date(date_to);
      }

      const offset = (page - 1) * limit;

      const { count, rows: visits } = await DonationVisit.findAndCountAll({
        where,
        include: [
          {
            model: Donor,
            as: "donor",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["user_id", "email", "name", "phone"],
              },
            ],
          },
          {
            model: MilkBank,
            as: "bank",
            attributes: ["bank_id", "name", "address"],
          },
          {
            model: User,
            as: "recorder",
            attributes: ["user_id", "email", "name"],
          },
          {
            model: VisitSchedule,
            as: "schedule",
          },
        ],
        order: [["scheduled_start", "DESC"]],
        limit: parseInt(limit),
        offset,
      });

      res.json({
        success: true,
        message: "Donation visits retrieved successfully",
        data: {
          visits,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      console.error("Get all donation visits error:", error);
      res.status(500).json({
        error: "Failed to retrieve donation visits",
        message: error.message,
      });
    }
  }

  /**
   * Get donation visit by ID
   * GET /api/donation-visits/:id
   */
  async getVisitById(req, res) {
    try {
      const { id } = req.params;

      const visit = await DonationVisit.findByPk(id, {
        include: [
          {
            model: Donor,
            as: "donor",
            include: [
              {
                model: User,
                as: "user",
                attributes: [
                  "user_id",
                  "email",
                  "name",
                  "phone",
                  "national_id",
                ],
              },
            ],
          },
          {
            model: MilkBank,
            as: "bank",
            attributes: ["bank_id", "name", "address", "phone"],
          },
          {
            model: User,
            as: "recorder",
            attributes: ["user_id", "email", "name"],
          },
          {
            model: VisitSchedule,
            as: "schedule",
          },
        ],
      });

      if (!visit) {
        return res.status(404).json({
          error: "Donation visit not found",
          message: "The specified donation visit does not exist",
        });
      }

      res.json({
        success: true,
        message: "Donation visit retrieved successfully",
        data: { visit },
      });
    } catch (error) {
      console.error("Get donation visit by ID error:", error);
      res.status(500).json({
        error: "Failed to retrieve donation visit",
        message: error.message,
      });
    }
  }

  /**
   * Create new donation visit (Schedule visit)
   * POST /api/donation-visits
   */
  async createVisit(req, res) {
    try {
      const {
        donor_id,
        bank_id,
        scheduled_start,
        scheduled_end,
        origin = "system",
        notes,
      } = req.body;

      // Validate donor exists
      const donor = await Donor.findByPk(donor_id);
      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "The specified donor does not exist",
        });
      }

      // Validate bank exists
      const bank = await MilkBank.findByPk(bank_id);
      if (!bank) {
        return res.status(404).json({
          error: "Milk bank not found",
          message: "The specified milk bank does not exist",
        });
      }

      // Check for conflicting visits
      const conflictingVisit = await DonationVisit.findOne({
        where: {
          donor_id,
          scheduled_start: new Date(scheduled_start),
          status: ["scheduled", "confirmed", "in_progress"],
        },
      });

      if (conflictingVisit) {
        return res.status(409).json({
          error: "Visit conflict",
          message: "Donor already has a visit scheduled for this time",
        });
      }

      // Create visit
      const visit = await DonationVisit.create({
        visit_id: uuidv4(),
        donor_id,
        bank_id,
        scheduled_start: new Date(scheduled_start),
        scheduled_end: scheduled_end ? new Date(scheduled_end) : null,
        origin,
        status: "scheduled",
        recorded_by: req.user?.user_id || null,
      });

      // Create visit schedule if needed
      if (origin === "user" || origin === "staff") {
        await VisitSchedule.create({
          schedule_id: uuidv4(),
          visit_id: visit.visit_id,
          proposed_time: new Date(scheduled_start),
          proposed_by: req.user?.user_id || null,
          status: "accepted",
          notes,
        });
      }

      // Fetch the created visit with associations
      const newVisit = await DonationVisit.findByPk(visit.visit_id, {
        include: [
          {
            model: Donor,
            as: "donor",
            include: [{ model: User, as: "user" }],
          },
          {
            model: MilkBank,
            as: "bank",
          },
          {
            model: VisitSchedule,
            as: "schedule",
          },
        ],
      });

      res.status(201).json({
        success: true,
        message: "Donation visit created successfully",
        data: { visit: newVisit },
      });
    } catch (error) {
      console.error("Create donation visit error:", error);
      res.status(500).json({
        error: "Failed to create donation visit",
        message: error.message,
      });
    }
  }

  /**
   * Update donation visit (e.g., check health status)
   * PATCH /api/donation-visits/:id
   */
  async updateVisit(req, res) {
    try {
      const { id } = req.params;
      const {
        status,
        health_status,
        health_notes,
        actual_start,
        actual_end,
        notes,
      } = req.body;

      const visit = await DonationVisit.findByPk(id);
      if (!visit) {
        return res.status(404).json({
          error: "Donation visit not found",
          message: "The specified donation visit does not exist",
        });
      }

      // Update visit
      const updateData = {};
      if (status) updateData.status = status;
      if (health_status) updateData.health_status = health_status;
      if (health_notes) updateData.health_notes = health_notes;
      if (actual_start) updateData.actual_start = new Date(actual_start);
      if (actual_end) updateData.actual_end = new Date(actual_end);
      if (notes) updateData.notes = notes;

      await visit.update(updateData);

      // Fetch updated visit
      const updatedVisit = await DonationVisit.findByPk(id, {
        include: [
          {
            model: Donor,
            as: "donor",
            include: [{ model: User, as: "user" }],
          },
          {
            model: MilkBank,
            as: "bank",
          },
          {
            model: VisitSchedule,
            as: "schedule",
          },
        ],
      });

      res.json({
        success: true,
        message: "Donation visit updated successfully",
        data: { visit: updatedVisit },
      });
    } catch (error) {
      console.error("Update donation visit error:", error);
      res.status(500).json({
        error: "Failed to update donation visit",
        message: error.message,
      });
    }
  }

  /**
   * Record milk donation (Step 5 in Process 2)
   * POST /api/donation-visits/:id/record-donation
   */
  async recordMilkDonation(req, res) {
    try {
      const { id } = req.params;
      const {
        milk_volume_ml,
        container_count,
        health_status,
        health_notes,
        quality_notes,
      } = req.body;

      // Validate visit exists
      const visit = await DonationVisit.findByPk(id, {
        include: [
          {
            model: Donor,
            as: "donor",
          },
        ],
      });

      if (!visit) {
        return res.status(404).json({
          error: "Donation visit not found",
          message: "The specified donation visit does not exist",
        });
      }

      // Validate health status
      if (!health_status || !["good", "bad"].includes(health_status)) {
        return res.status(400).json({
          error: "Invalid health status",
          message: "Health status must be 'good' or 'bad'",
        });
      }

      // If health is bad, volume should be 0
      const actualVolume = health_status === "bad" ? 0 : milk_volume_ml;

      // Calculate points based on reward rules
      let pointsAwarded = 0;
      if (health_status === "good" && actualVolume > 0) {
        const rewardRule = await RewardRules.findOne({
          where: {
            rule_type: "donation_volume",
            is_active: true,
            volume_min_ml: { [Op.lte]: actualVolume },
            volume_max_ml: { [Op.gte]: actualVolume },
          },
        });

        pointsAwarded = rewardRule ? rewardRule.points_awarded : 0;

        // Fallback to default calculation if no rule found
        if (!rewardRule) {
          if (actualVolume >= 500) pointsAwarded = 15;
          else if (actualVolume >= 300) pointsAwarded = 10;
          else if (actualVolume >= 100) pointsAwarded = 5;
        }
      }

      // Update visit with donation data
      await visit.update({
        health_status,
        health_notes,
        milk_volume_ml: actualVolume,
        container_count: container_count || 0,
        quality_notes,
        status: "completed",
        actual_end: new Date(),
        recorded_by: req.user?.user_id || null,
      });

      // Award points to donor
      if (pointsAwarded > 0) {
        await PointTransaction.create({
          transaction_id: uuidv4(),
          donor_id: visit.donor_id,
          transaction_type: "earned",
          points: pointsAwarded,
          reason: `Milk donation - ${actualVolume}ml`,
          reference_type: "donation_visit",
          reference_id: visit.visit_id,
          created_by: req.user?.user_id || null,
        });

        // Update donor's total points
        const donor = await Donor.findByPk(visit.donor_id);
        if (donor) {
          await donor.update({
            points_total: donor.points_total + pointsAwarded,
            total_donation_volume: donor.total_donation_volume + actualVolume,
          });
        }
      }

      // Fetch updated visit
      const updatedVisit = await DonationVisit.findByPk(id, {
        include: [
          {
            model: Donor,
            as: "donor",
            include: [{ model: User, as: "user" }],
          },
          {
            model: MilkBank,
            as: "bank",
          },
        ],
      });

      res.json({
        success: true,
        message: "Milk donation recorded successfully",
        data: {
          visit: updatedVisit,
          pointsAwarded,
        },
      });
    } catch (error) {
      console.error("Record milk donation error:", error);
      res.status(500).json({
        error: "Failed to record milk donation",
        message: error.message,
      });
    }
  }

  /**
   * Get donor's upcoming visits
   * GET /api/donation-visits/donor/:donor_id/upcoming
   */
  async getDonorUpcomingVisits(req, res) {
    try {
      const { donor_id } = req.params;
      const { limit = 5 } = req.query;

      const visits = await DonationVisit.findAll({
        where: {
          donor_id,
          scheduled_start: { [Op.gte]: new Date() },
          status: ["scheduled", "confirmed"],
        },
        include: [
          {
            model: MilkBank,
            as: "bank",
            attributes: ["bank_id", "name", "address"],
          },
          {
            model: VisitSchedule,
            as: "schedule",
          },
        ],
        order: [["scheduled_start", "ASC"]],
        limit: parseInt(limit),
      });

      res.json({
        success: true,
        message: "Upcoming visits retrieved successfully",
        data: { visits },
      });
    } catch (error) {
      console.error("Get donor upcoming visits error:", error);
      res.status(500).json({
        error: "Failed to retrieve upcoming visits",
        message: error.message,
      });
    }
  }

  /**
   * Get donor's donation history
   * GET /api/donation-visits/donor/:donor_id/history
   */
  async getDonorDonationHistory(req, res) {
    try {
      const { donor_id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const offset = (page - 1) * limit;

      const { count, rows: visits } = await DonationVisit.findAndCountAll({
        where: {
          donor_id,
          status: "completed",
          milk_volume_ml: { [Op.gt]: 0 },
        },
        include: [
          {
            model: MilkBank,
            as: "bank",
            attributes: ["bank_id", "name"],
          },
          {
            model: User,
            as: "recorder",
            attributes: ["name"],
          },
        ],
        order: [["actual_end", "DESC"]],
        limit: parseInt(limit),
        offset,
      });

      // Calculate statistics
      const totalVolume = visits.reduce(
        (sum, v) => sum + (v.milk_volume_ml || 0),
        0
      );
      const totalVisits = count;

      res.json({
        success: true,
        message: "Donation history retrieved successfully",
        data: {
          visits,
          statistics: {
            totalVolume,
            totalVisits,
            averageVolume: totalVisits > 0 ? totalVolume / totalVisits : 0,
          },
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      console.error("Get donor donation history error:", error);
      res.status(500).json({
        error: "Failed to retrieve donation history",
        message: error.message,
      });
    }
  }
}

module.exports = new DonationVisitController();
