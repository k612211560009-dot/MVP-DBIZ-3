const {
  Appointment,
  Donor,
  User,
  MilkBank,
  ScreeningSession,
  DonationRecord,
} = require("../models");
const { Op } = require("sequelize");

/**
 * Appointment Controller
 */
class AppointmentController {
  /**
   * Get all appointments with filtering
   * GET /api/appointments
   */
  async getAppointments(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        date,
        staff_id,
        status,
        type,
        donor_id,
        sortBy = "appointment_date",
        sortOrder = "asc",
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Build where clause for filtering
      const whereClause = {};

      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        whereClause.appointment_date = {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        };
      }

      if (staff_id) {
        whereClause.created_by = staff_id;
      }

      if (status && status !== "all") {
        whereClause.status = status;
      }

      if (type && type !== "all") {
        whereClause.appointment_type = type;
      }

      if (donor_id) {
        whereClause.donor_id = donor_id;
      }

      const appointments = await Appointment.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Donor,
            as: "donor",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["user_id", "email"],
              },
            ],
          },
          {
            model: User,
            as: "creator",
            attributes: ["user_id", "email", "role"],
          },
          {
            model: MilkBank,
            as: "milkBank",
            attributes: ["bank_id", "name", "location"],
          },
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset,
        distinct: true,
      });

      res.json({
        message: "Appointments retrieved successfully",
        data: {
          appointments: appointments.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: appointments.count,
            pages: Math.ceil(appointments.count / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({
        error: "Failed to retrieve appointments",
        message: error.message,
      });
    }
  }

  /**
   * Get appointment by ID
   * GET /api/appointments/:id
   */
  async getAppointmentById(req, res) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Donor,
            as: "donor",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["user_id", "email"],
              },
            ],
          },
          {
            model: User,
            as: "creator",
            attributes: ["user_id", "email", "role"],
          },
          {
            model: MilkBank,
            as: "milkBank",
          },
          {
            model: ScreeningSession,
            as: "screeningSessions",
          },
          {
            model: DonationRecord,
            as: "donationRecords",
          },
        ],
      });

      if (!appointment) {
        return res.status(404).json({
          error: "Appointment not found",
          message: "The specified appointment does not exist",
        });
      }

      res.json({
        message: "Appointment retrieved successfully",
        data: { appointment },
      });
    } catch (error) {
      console.error("Get appointment by ID error:", error);
      res.status(500).json({
        error: "Failed to retrieve appointment",
        message: error.message,
      });
    }
  }

  /**
   * Create new appointment
   * POST /api/appointments
   */
  async createAppointment(req, res) {
    try {
      const {
        donor_id,
        bank_id,
        appointment_type,
        appointment_date,
        time_slot,
        notes,
        preparation_instructions,
      } = req.body;

      // Check if donor exists
      const donor = await Donor.findByPk(donor_id);
      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "The specified donor does not exist",
        });
      }

      // Check if bank exists
      if (bank_id) {
        const bank = await MilkBank.findByPk(bank_id);
        if (!bank) {
          return res.status(404).json({
            error: "Milk bank not found",
            message: "The specified milk bank does not exist",
          });
        }
      }

      // Check for conflicting appointments
      const existingAppointment = await Appointment.findOne({
        where: {
          donor_id,
          appointment_date: new Date(appointment_date),
          status: ["scheduled", "confirmed", "in_progress"],
        },
      });

      if (existingAppointment) {
        return res.status(409).json({
          error: "Appointment conflict",
          message: "Donor already has an appointment scheduled for this date",
        });
      }

      const appointment = await Appointment.create({
        donor_id,
        bank_id,
        appointment_type,
        appointment_date: new Date(appointment_date),
        time_slot,
        notes,
        preparation_instructions,
        created_by: req.user.user_id,
      });

      // Fetch the created appointment with includes
      const newAppointment = await Appointment.findByPk(
        appointment.appointment_id,
        {
          include: [
            {
              model: Donor,
              as: "donor",
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["user_id", "email"],
                },
              ],
            },
            {
              model: User,
              as: "creator",
              attributes: ["user_id", "email", "role"],
            },
            {
              model: MilkBank,
              as: "milkBank",
            },
          ],
        }
      );

      res.status(201).json({
        message: "Appointment created successfully",
        data: { appointment: newAppointment },
      });
    } catch (error) {
      console.error("Create appointment error:", error);
      res.status(500).json({
        error: "Failed to create appointment",
        message: error.message,
      });
    }
  }

  /**
   * Update appointment
   * PUT /api/appointments/:id
   */
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({
          error: "Appointment not found",
          message: "The specified appointment does not exist",
        });
      }

      // Check if appointment can be updated
      if (appointment.status === "completed") {
        return res.status(400).json({
          error: "Cannot update appointment",
          message: "Completed appointments cannot be modified",
        });
      }

      // Update appointment date validation
      if (updateData.appointment_date) {
        updateData.appointment_date = new Date(updateData.appointment_date);
      }

      await appointment.update(updateData);

      // Fetch updated appointment with includes
      const updatedAppointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Donor,
            as: "donor",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["user_id", "email"],
              },
            ],
          },
          {
            model: User,
            as: "creator",
            attributes: ["user_id", "email", "role"],
          },
          {
            model: MilkBank,
            as: "milkBank",
          },
        ],
      });

      res.json({
        message: "Appointment updated successfully",
        data: { appointment: updatedAppointment },
      });
    } catch (error) {
      console.error("Update appointment error:", error);
      res.status(500).json({
        error: "Failed to update appointment",
        message: error.message,
      });
    }
  }

  /**
   * Update appointment status
   * PATCH /api/appointments/:id/status
   */
  async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({
          error: "Appointment not found",
          message: "The specified appointment does not exist",
        });
      }

      const validStatuses = [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: "Invalid status",
          message: `Status must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const updateData = { status };

      // Handle cancellation
      if (status === "cancelled") {
        updateData.cancelled_reason = reason;
        updateData.cancelled_at = new Date();
      }

      await appointment.update(updateData);

      res.json({
        message: "Appointment status updated successfully",
        data: {
          appointment_id: id,
          status,
          reason: reason || null,
        },
      });
    } catch (error) {
      console.error("Update appointment status error:", error);
      res.status(500).json({
        error: "Failed to update appointment status",
        message: error.message,
      });
    }
  }

  /**
   * Cancel appointment
   * DELETE /api/appointments/:id
   */
  async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({
          error: "Appointment not found",
          message: "The specified appointment does not exist",
        });
      }

      if (appointment.status === "completed") {
        return res.status(400).json({
          error: "Cannot cancel appointment",
          message: "Completed appointments cannot be cancelled",
        });
      }

      await appointment.update({
        status: "cancelled",
        cancelled_reason: reason || "Cancelled by staff",
        cancelled_at: new Date(),
      });

      res.json({
        message: "Appointment cancelled successfully",
        data: { appointment_id: id },
      });
    } catch (error) {
      console.error("Cancel appointment error:", error);
      res.status(500).json({
        error: "Failed to cancel appointment",
        message: error.message,
      });
    }
  }

  /**
   * Get available time slots for a specific date
   * GET /api/appointments/available-slots
   */
  async getAvailableSlots(req, res) {
    try {
      const { date, type = "donation", duration = 30 } = req.query;

      if (!date) {
        return res.status(400).json({
          error: "Date required",
          message: "Date parameter is required",
        });
      }

      const targetDate = new Date(date);
      const startDate = new Date(targetDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);

      // Get existing appointments for the day
      const existingAppointments = await Appointment.findAll({
        where: {
          appointment_date: {
            [Op.between]: [startDate, endDate],
          },
          status: ["scheduled", "confirmed", "in_progress"],
        },
        attributes: ["time_slot", "appointment_date"],
      });

      // Generate available slots (simplified logic)
      const workingHours = {
        start: 8, // 8 AM
        end: 17, // 5 PM
      };

      const slots = [];
      for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        for (let minute = 0; minute < 60; minute += parseInt(duration)) {
          const timeSlot = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

          // Check if slot is already booked
          const isBooked = existingAppointments.some(
            (apt) => apt.time_slot === timeSlot
          );

          if (!isBooked) {
            slots.push({
              time: timeSlot,
              available: true,
            });
          }
        }
      }

      res.json({
        message: "Available slots retrieved successfully",
        data: {
          date,
          availableSlots: slots,
        },
      });
    } catch (error) {
      console.error("Get available slots error:", error);
      res.status(500).json({
        error: "Failed to retrieve available slots",
        message: error.message,
      });
    }
  }
}

module.exports = new AppointmentController();
