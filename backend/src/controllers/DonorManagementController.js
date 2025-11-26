const {
  Donor,
  EhrDonor,
  User,
  DonationVisit,
  Appointment,
  ScreeningSession,
  MedicalTest,
  AuditLog,
} = require("../models");
const { Op } = require("sequelize");

/**
 * Donor Management Controller for Staff
 * Handles donor listing, filtering, approval, and history
 */
class DonorManagementController {
  /**
   * GET /api/staff/donors
   * Get list of donors with filtering and search
   */
  async getDonors(req, res) {
    try {
      const {
        status,
        q, // search query
        page = 1,
        per_page = 25,
        sort_by = "created_at",
        order = "desc",
      } = req.query;

      const limit = parseInt(per_page);
      const offset = (parseInt(page) - 1) * limit;

      // Build where clause for Donor table
      const donorWhere = {};

      if (status && status !== "all") {
        donorWhere.donor_status = status;
      }

      // Build where clause for search (in EhrDonor)
      const ehrWhere = {};
      if (q) {
        ehrWhere[Op.or] = [
          { full_name: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
        ];
      }

      // Get donors with associations
      const { count, rows: donors } = await Donor.findAndCountAll({
        where: donorWhere,
        limit,
        offset,
        order: [[sort_by, order.toUpperCase()]],
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
            where: Object.keys(ehrWhere).length > 0 ? ehrWhere : undefined,
            required: Object.keys(ehrWhere).length > 0,
          },
          {
            model: User,
            as: "user",
            attributes: ["email", "is_active"],
          },
        ],
        attributes: [
          "donor_id",
          "donor_status",
          "screening_status",
          "director_status",
          "created_at",
          "updated_at",
        ],
      });

      // Calculate pagination
      const total_pages = Math.ceil(count / limit);

      return res.json({
        message: "Donors retrieved successfully",
        data: {
          donors,
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
      console.error("Error fetching donors:", error);
      return res.status(500).json({
        message: "Failed to fetch donors",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/staff/donors/:id
   * Get detailed donor information
   */
  async getDonorDetail(req, res) {
    try {
      const { id } = req.params;

      const donor = await Donor.findOne({
        where: { donor_id: id },
        include: [
          {
            model: DonationVisit,
            as: "donations",
            limit: 10,
            order: [["donation_date", "DESC"]],
            attributes: ["visit_id", "donation_date", "volume_ml", "status"],
          },
          {
            model: Appointment,
            as: "appointments",
            limit: 10,
            order: [["appointment_date", "DESC"]],
            attributes: [
              "appointment_id",
              "appointment_date",
              "status",
              "appointment_type",
            ],
          },
          {
            model: ScreeningSession,
            as: "screeningSessions",
            limit: 5,
            order: [["session_date", "DESC"]],
            attributes: [
              "session_id",
              "session_date",
              "session_status",
              "result",
            ],
          },
        ],
      });

      if (!donor) {
        return res.status(404).json({
          message: "Donor not found",
        });
      }

      return res.json({
        message: "Donor details retrieved successfully",
        data: donor,
      });
    } catch (error) {
      console.error("Error fetching donor detail:", error);
      return res.status(500).json({
        message: "Failed to fetch donor details",
        error: error.message,
      });
    }
  }

  /**
   * PATCH /api/staff/donors/:id/status
   * Update donor status (approve/reject)
   */
  async updateDonorStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      // Validate status
      const validStatuses = ["pending", "approved", "rejected", "suspended"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
          validStatuses,
        });
      }

      const donor = await Donor.findOne({ where: { donor_id: id } });

      if (!donor) {
        return res.status(404).json({
          message: "Donor not found",
        });
      }

      const oldStatus = donor.status;

      // Update donor status
      await donor.update({
        status,
        updated_at: new Date(),
      });

      // Create audit log
      await AuditLog.create({
        user_id: req.user.user_id,
        action: "UPDATE_DONOR_STATUS",
        resource_type: "donor",
        resource_id: id,
        changes: JSON.stringify({
          old_status: oldStatus,
          new_status: status,
          notes,
        }),
        ip_address: req.ip,
      });

      return res.json({
        message: `Donor status updated to ${status}`,
        data: {
          donor_id: donor.donor_id,
          full_name: donor.full_name,
          old_status: oldStatus,
          new_status: status,
        },
      });
    } catch (error) {
      console.error("Error updating donor status:", error);
      return res.status(500).json({
        message: "Failed to update donor status",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/staff/donors/:id/history
   * Get donor activity history (donations, appointments, tests)
   */
  async getDonorHistory(req, res) {
    try {
      const { id } = req.params;
      const { type = "all", limit = 50 } = req.query;

      const donor = await Donor.findOne({ where: { donor_id: id } });

      if (!donor) {
        return res.status(404).json({
          message: "Donor not found",
        });
      }

      const history = [];

      // Fetch donations
      if (type === "all" || type === "donations") {
        const donations = await DonationVisit.findAll({
          where: { donor_id: id },
          order: [["donation_date", "DESC"]],
          limit: parseInt(limit),
          attributes: [
            "visit_id",
            "donation_date",
            "volume_ml",
            "status",
            "notes",
          ],
        });

        donations.forEach((d) => {
          history.push({
            type: "donation",
            date: d.donation_date,
            description: `Hiến ${d.volume_ml}ml sữa`,
            status: d.status,
            details: d,
          });
        });
      }

      // Fetch appointments
      if (type === "all" || type === "appointments") {
        const appointments = await Appointment.findAll({
          where: { donor_id: id },
          order: [["appointment_date", "DESC"]],
          limit: parseInt(limit),
          attributes: [
            "appointment_id",
            "appointment_date",
            "status",
            "appointment_type",
            "notes",
          ],
        });

        appointments.forEach((a) => {
          history.push({
            type: "appointment",
            date: a.appointment_date,
            description: `Lịch hẹn ${a.appointment_type}`,
            status: a.status,
            details: a,
          });
        });
      }

      // Fetch screening sessions
      if (type === "all" || type === "screening") {
        const sessions = await ScreeningSession.findAll({
          where: { donor_id: id },
          order: [["session_date", "DESC"]],
          limit: parseInt(limit),
          attributes: [
            "session_id",
            "session_date",
            "session_status",
            "result",
            "notes",
          ],
        });

        sessions.forEach((s) => {
          history.push({
            type: "screening",
            date: s.session_date,
            description: `Sàng lọc - ${s.result || "Chưa có kết quả"}`,
            status: s.session_status,
            details: s,
          });
        });
      }

      // Fetch medical tests
      if (type === "all" || type === "tests") {
        const tests = await MedicalTest.findAll({
          where: { donor_id: id },
          order: [["test_date", "DESC"]],
          limit: parseInt(limit),
          attributes: ["test_id", "test_date", "test_type", "result", "status"],
        });

        tests.forEach((t) => {
          history.push({
            type: "test",
            date: t.test_date,
            description: `Xét nghiệm ${t.test_type}`,
            status: t.status,
            details: t,
          });
        });
      }

      // Sort all history by date
      history.sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.json({
        message: "Donor history retrieved successfully",
        data: {
          donor_id: id,
          donor_name: donor.full_name,
          history: history.slice(0, parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Error fetching donor history:", error);
      return res.status(500).json({
        message: "Failed to fetch donor history",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/staff/donors/stats
   * Get donor statistics for dashboard
   */
  async getDonorStats(req, res) {
    try {
      const totalDonors = await Donor.count();
      const pendingDonors = await Donor.count({ where: { status: "pending" } });
      const approvedDonors = await Donor.count({
        where: { status: "approved" },
      });
      const rejectedDonors = await Donor.count({
        where: { status: "rejected" },
      });

      // Get new donors this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const newThisMonth = await Donor.count({
        where: {
          created_at: { [Op.gte]: startOfMonth },
        },
      });

      return res.json({
        message: "Donor statistics retrieved successfully",
        data: {
          total: totalDonors,
          pending: pendingDonors,
          approved: approvedDonors,
          rejected: rejectedDonors,
          new_this_month: newThisMonth,
        },
      });
    } catch (error) {
      console.error("Error fetching donor stats:", error);
      return res.status(500).json({
        message: "Failed to fetch donor statistics",
        error: error.message,
      });
    }
  }
}

module.exports = new DonorManagementController();
