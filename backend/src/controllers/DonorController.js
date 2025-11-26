const {
  Donor,
  User,
  Appointment,
  ScreeningSession,
  DonationRecord,
  PointTransaction,
} = require("../models");
const { Op } = require("sequelize");
const { validationMiddleware } = require("../middleware/validation");

/**
 * Donor Controller
 */
class DonorController {
  /**
   * Get all donors with filtering and pagination
   * GET /api/donors
   */
  async getDonors(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        q,
        sortBy = "created_at",
        sortOrder = "desc",
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Build where clause for filtering
      const whereClause = {};
      const userWhereClause = {};

      if (status && status !== "all") {
        whereClause.donor_status = status;
      }

      if (q) {
        userWhereClause[Op.or] = [
          { email: { [Op.like]: `%${q}%` } },
          // Add name search when User model has name field
        ];
      }

      const donors = await Donor.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "user",
            where:
              Object.keys(userWhereClause).length > 0
                ? userWhereClause
                : undefined,
            attributes: ["user_id", "email", "role", "is_active", "created_at"],
          },
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset,
        distinct: true,
      });

      res.json({
        message: "Donors retrieved successfully",
        data: {
          donors: donors.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: donors.count,
            pages: Math.ceil(donors.count / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get donors error:", error);
      res.status(500).json({
        error: "Failed to retrieve donors",
        message: error.message,
      });
    }
  }

  /**
   * Get donor by ID with detailed information
   * GET /api/donors/:id
   */
  async getDonorById(req, res) {
    try {
      const { id } = req.params;

      const donor = await Donor.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "user_id",
              "email",
              "role",
              "is_active",
              "email_verified",
              "last_login",
              "created_at",
            ],
          },
          {
            model: Appointment,
            as: "appointments",
            order: [["appointment_date", "DESC"]],
            limit: 10,
            include: [
              {
                model: User,
                as: "creator",
                attributes: ["user_id", "email"],
              },
            ],
          },
          {
            model: DonationRecord,
            as: "donationRecords",
            order: [["donation_date", "DESC"]],
            limit: 10,
            include: [
              {
                model: User,
                as: "collector",
                attributes: ["user_id", "email"],
              },
            ],
          },
          {
            model: ScreeningSession,
            as: "screeningSessions",
            order: [["created_at", "DESC"]],
            limit: 5,
          },
        ],
      });

      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "The specified donor does not exist",
        });
      }

      // Calculate statistics
      const totalDonations = await DonationRecord.count({
        where: { donor_id: id },
      });

      const totalVolume = await DonationRecord.sum("volume_collected", {
        where: { donor_id: id },
      });

      const totalAppointments = await Appointment.count({
        where: { donor_id: id },
      });

      res.json({
        message: "Donor retrieved successfully",
        data: {
          donor,
          statistics: {
            totalDonations: totalDonations || 0,
            totalVolume: totalVolume || 0,
            totalAppointments: totalAppointments || 0,
          },
        },
      });
    } catch (error) {
      console.error("Get donor by ID error:", error);
      res.status(500).json({
        error: "Failed to retrieve donor",
        message: error.message,
      });
    }
  }

  /**
   * Update donor profile
   * PUT /api/donors/:id
   */
  async updateDonor(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if donor exists
      const donor = await Donor.findByPk(id);
      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "The specified donor does not exist",
        });
      }

      // Separate donor fields from user fields
      const donorFields = [
        "date_of_birth",
        "address",
        "emergency_contact",
        "donor_status",
        "screening_status",
        "director_status",
        "registration_step",
        "weekly_availability",
        "home_bank_id",
      ];

      const donorUpdateData = {};
      const userUpdateData = {};

      Object.keys(updateData).forEach((key) => {
        if (donorFields.includes(key)) {
          donorUpdateData[key] = updateData[key];
        } else if (key === "email") {
          userUpdateData[key] = updateData[key];
        }
      });

      // Update donor record
      if (Object.keys(donorUpdateData).length > 0) {
        await donor.update(donorUpdateData);
      }

      // Update user record if email is being updated
      if (Object.keys(userUpdateData).length > 0) {
        await User.update(userUpdateData, {
          where: { user_id: id },
        });
      }

      // Fetch updated donor data
      const updatedDonor = await Donor.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "email", "role", "is_active"],
          },
        ],
      });

      res.json({
        message: "Donor updated successfully",
        data: { donor: updatedDonor },
      });
    } catch (error) {
      console.error("Update donor error:", error);
      res.status(500).json({
        error: "Failed to update donor",
        message: error.message,
      });
    }
  }

  /**
   * Update donor status
   * PATCH /api/donors/:id/status
   */
  async updateDonorStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const donor = await Donor.findByPk(id);
      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "The specified donor does not exist",
        });
      }

      const validStatuses = [
        "in_progress",
        "active",
        "suspended",
        "removed",
        "rejected",
        "failed_positive",
        "abandoned",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: "Invalid status",
          message: `Status must be one of: ${validStatuses.join(", ")}`,
        });
      }

      await donor.update({
        donor_status: status,
        // Store reason in a notes field if available
        ...(reason && { notes: reason }),
      });

      res.json({
        message: "Donor status updated successfully",
        data: {
          donor_id: id,
          status,
          reason: reason || null,
        },
      });
    } catch (error) {
      console.error("Update donor status error:", error);
      res.status(500).json({
        error: "Failed to update donor status",
        message: error.message,
      });
    }
  }

  /**
   * Get donor's point transactions
   * GET /api/donors/:id/points
   */
  async getDonorPoints(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const donor = await Donor.findByPk(id);
      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "The specified donor does not exist",
        });
      }

      const transactions = await PointTransaction.findAndCountAll({
        where: { donor_id: id },
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset,
        include: [
          {
            model: User,
            as: "processor",
            attributes: ["user_id", "email"],
          },
        ],
      });

      res.json({
        message: "Point transactions retrieved successfully",
        data: {
          currentBalance: donor.points_total,
          transactions: transactions.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: transactions.count,
            pages: Math.ceil(transactions.count / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get donor points error:", error);
      res.status(500).json({
        error: "Failed to retrieve point transactions",
        message: error.message,
      });
    }
  }

  /**
   * Get donor dashboard statistics
   * GET /api/donors/:id/dashboard
   */
  async getDonorDashboard(req, res) {
    try {
      const { id } = req.params;

      const donor = await Donor.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["email", "last_login"],
          },
        ],
      });

      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "The specified donor does not exist",
        });
      }

      // Get upcoming appointments
      const upcomingAppointments = await Appointment.findAll({
        where: {
          donor_id: id,
          appointment_date: { [Op.gte]: new Date() },
          status: ["scheduled", "confirmed"],
        },
        order: [["appointment_date", "ASC"]],
        limit: 5,
      });

      // Get recent donations
      const recentDonations = await DonationRecord.findAll({
        where: { donor_id: id },
        order: [["donation_date", "DESC"]],
        limit: 5,
        include: [
          {
            model: User,
            as: "collector",
            attributes: ["user_id", "email"],
          },
        ],
      });

      // Calculate statistics for current month
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const monthlyDonations = await DonationRecord.count({
        where: {
          donor_id: id,
          donation_date: { [Op.gte]: currentMonth },
        },
      });

      const monthlyVolume = await DonationRecord.sum("volume_collected", {
        where: {
          donor_id: id,
          donation_date: { [Op.gte]: currentMonth },
        },
      });

      res.json({
        message: "Donor dashboard data retrieved successfully",
        data: {
          donor,
          upcomingAppointments,
          recentDonations,
          statistics: {
            monthlyDonations: monthlyDonations || 0,
            monthlyVolume: monthlyVolume || 0,
          },
        },
      });
    } catch (error) {
      console.error("Get donor dashboard error:", error);
      res.status(500).json({
        error: "Failed to retrieve dashboard data",
        message: error.message,
      });
    }
  }

  /**
   * POST /api/donors/:id/appointments
   * Book a new appointment (Donor-facing)
   */
  async bookAppointment(req, res) {
    try {
      const { id } = req.params;
      const { appointment_date, appointment_type, notes } = req.body;

      if (!appointment_date) {
        return res.status(400).json({
          message: "Appointment date is required",
        });
      }

      // Verify donor exists
      const donor = await Donor.findOne({ where: { donor_id: id } });
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }

      // Check slot availability
      const existingAppointment = await Appointment.findOne({
        where: {
          appointment_date: new Date(appointment_date),
          status: { [Op.in]: ["scheduled", "confirmed"] },
        },
      });

      if (existingAppointment) {
        return res.status(400).json({
          message: "This time slot is not available",
        });
      }

      // Create appointment
      const appointment = await Appointment.create({
        donor_id: id,
        appointment_date: new Date(appointment_date),
        appointment_type: appointment_type || "donation",
        status: "scheduled",
        notes,
      });

      return res.status(201).json({
        message: "Appointment booked successfully",
        data: appointment,
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      return res.status(500).json({
        message: "Failed to book appointment",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/donors/appointments/available-slots
   * Get available appointment slots
   */
  async getAvailableSlots(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          message: "Date parameter is required",
        });
      }

      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Get existing appointments for that date
      const existingAppointments = await Appointment.findAll({
        where: {
          appointment_date: {
            [Op.between]: [targetDate, nextDay],
          },
          status: { [Op.in]: ["scheduled", "confirmed"] },
        },
        attributes: ["appointment_date"],
      });

      // Generate time slots (9:00 AM to 5:00 PM, 30-minute intervals)
      const allSlots = [];
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          const slotTime = new Date(targetDate);
          slotTime.setHours(hour, minute, 0, 0);
          allSlots.push(slotTime);
        }
      }

      // Filter out booked slots
      const bookedTimes = existingAppointments.map((a) =>
        a.appointment_date.getTime()
      );
      const availableSlots = allSlots
        .filter((slot) => !bookedTimes.includes(slot.getTime()))
        .map((slot) => ({
          datetime: slot.toISOString(),
          time: slot.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        }));

      return res.json({
        message: "Available slots retrieved successfully",
        data: {
          date: targetDate.toISOString().split("T")[0],
          availableSlots,
        },
      });
    } catch (error) {
      console.error("Error fetching available slots:", error);
      return res.status(500).json({
        message: "Failed to fetch available slots",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/donors/:id/appointments/upcoming
   * Get donor's upcoming appointments
   */
  async getUpcomingAppointments(req, res) {
    try {
      const { id } = req.params;

      const appointments = await Appointment.findAll({
        where: {
          donor_id: id,
          status: { [Op.in]: ["scheduled", "confirmed"] },
          appointment_date: { [Op.gte]: new Date() },
        },
        order: [["appointment_date", "ASC"]],
        limit: 10,
      });

      return res.json({
        message: "Upcoming appointments retrieved successfully",
        data: appointments,
      });
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      return res.status(500).json({
        message: "Failed to fetch appointments",
        error: error.message,
      });
    }
  }
}

module.exports = new DonorController();
