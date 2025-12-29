const {
  Appointment,
  Donor,
  User,
  MilkBank,
  ScreeningSession,
  DonationVisit,
} = require("../models");
const { Op } = require("sequelize");
const MeetingLinkService = require("../services/MeetingLinkService");
const NotificationController = require("./NotificationController");
const { v4: uuidv4 } = require("uuid");

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

      // If user is a donor, only show their appointments
      if (req.user.role === "donor") {
        whereClause.donor_id = req.user.user_id;
      } else {
        // For staff, allow filtering by donor_id
        if (donor_id) {
          whereClause.donor_id = donor_id;
        }
      }

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
            attributes: ["bank_id", "name", "address", "province"],
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
            model: DonationVisit,
            as: "donations",
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
   * Get upcoming appointments for a donor
   * GET /api/appointments/upcoming
   */
  async getUpcomingAppointments(req, res) {
    try {
      const donorId =
        req.user.role === "donor" ? req.user.user_id : req.params.id;

      // Check if donor exists
      const donor = await Donor.findByPk(donorId);
      if (!donor) {
        return res.status(400).json({
          error: "Donor profile not found",
          message: "Please complete your registration first",
        });
      }

      const appointments = await Appointment.findAll({
        where: {
          donor_id: donorId,
          appointment_date: {
            [Op.gte]: new Date(),
          },
          status: {
            [Op.in]: ["scheduled", "confirmed"],
          },
        },
        include: [
          {
            model: MilkBank,
            as: "milkBank",
            attributes: ["bank_id", "name", "address", "province"],
          },
        ],
        order: [["appointment_date", "ASC"]],
        limit: 5,
      });

      res.json({
        message: "Upcoming appointments retrieved successfully",
        data: { appointments },
      });
    } catch (error) {
      console.error("Get upcoming appointments error:", error);
      res.status(500).json({
        error: "Failed to retrieve appointments",
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

      // Auto-generate meeting link for screening appointments
      if (appointment_type === "screening") {
        const meetingLink = MeetingLinkService.generateMeetLink({
          appointmentId: appointment.appointment_id,
          donorEmail: donor.user?.email || "donor@milkbank.com",
          appointmentDate: new Date(appointment_date),
        });

        await appointment.update({ meeting_link: meetingLink });
      }

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
   * Book appointment (for donors)
   * POST /api/appointments/book
   */
  async bookAppointment(req, res) {
    try {
      // Log incoming request for debugging
      console.log("📋 Book appointment request:", {
        user: req.user,
        body: req.body,
      });

      const donor_id = req.user.user_id;
      const { date, time, type = "donation", notes } = req.body;

      if (!date || !time) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Date and time are required",
        });
      }

      // Check if donor exists
      console.log("🔍 Looking up donor with ID:", donor_id);
      const donor = await Donor.findByPk(donor_id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "email", "name", "phone"],
          },
        ],
      });

      console.log("👤 Donor found:", donor ? "Yes" : "No");

      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "Please complete your registration first",
        });
      }

      // Use donor's home bank or get default bank
      let bank_id = donor.home_bank_id;

      // If donor doesn't have a home bank, get the first available bank
      if (!bank_id) {
        const defaultBank = await MilkBank.findOne({
          attributes: ["bank_id"],
        });

        if (!defaultBank) {
          return res.status(400).json({
            error: "No milk bank available",
            message: "Please contact support to set up your milk bank",
          });
        }

        bank_id = defaultBank.bank_id;
        console.log("📍 Using default bank:", bank_id);
      }

      // Parse date and time
      const appointmentDate = new Date(date);

      // Check for conflicting appointments
      const existingAppointment = await Appointment.findOne({
        where: {
          donor_id,
          appointment_date: appointmentDate,
          time_slot: time,
          status: {
            [Op.in]: ["scheduled", "confirmed", "in_progress"],
          },
        },
      });

      if (existingAppointment) {
        return res.status(409).json({
          error: "Appointment conflict",
          message: "You already have an appointment at this time",
        });
      }

      // Create appointment
      const appointment = await Appointment.create({
        appointment_id: uuidv4(),
        donor_id,
        bank_id,
        appointment_type: type,
        appointment_date: appointmentDate,
        time_slot: time,
        status: "scheduled",
        notes,
        created_by: donor_id,
      });

      // Create notification for staff
      try {
        await NotificationController.createNotification({
          type: "new_appointment",
          title: "New Appointment Booked",
          message: `${
            donor.user?.name || "Donor"
          } has booked a ${type} appointment for ${date} at ${time}`,
          priority: "medium",
          related_donor_id: donor_id,
          related_entity_type: "appointment",
          related_entity_id: appointment.appointment_id,
          metadata: {
            donor_name: donor.user?.name,
            donor_email: donor.user?.email,
            donor_phone: donor.user?.phone,
            appointment_type: type,
            appointment_date: date,
            appointment_time: time,
          },
        });
        console.log(
          `🔔 Notification created for new appointment by ${donor.user?.name}`
        );
      } catch (notifError) {
        console.error("Error creating notification:", notifError);
        // Don't fail booking if notification creation fails
      }

      res.status(201).json({
        message: "Appointment booked successfully!",
        data: { appointment },
      });
    } catch (error) {
      console.error("Book appointment error:", error);
      res.status(500).json({
        error: "Failed to book appointment",
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

      // Auto-create donation visit when appointment is confirmed (for donation type)
      if (
        status === "confirmed" &&
        appointment.appointment_type === "donation"
      ) {
        try {
          const { v4: uuidv4 } = require("uuid");
          const VisitSchedule = require("../models").VisitSchedule;

          // Check if visit already exists
          const existingVisit = await DonationVisit.findOne({
            where: {
              donor_id: appointment.donor_id,
              scheduled_start: appointment.appointment_date,
              status: ["scheduled", "confirmed", "in_progress"],
            },
          });

          if (!existingVisit) {
            // Calculate scheduled_end (appointment_date + 1 hour)
            const scheduledEnd = new Date(appointment.appointment_date);
            scheduledEnd.setHours(scheduledEnd.getHours() + 1);

            // Create donation visit
            const visit = await DonationVisit.create({
              visit_id: uuidv4(),
              donor_id: appointment.donor_id,
              bank_id: appointment.bank_id || 1, // Default bank if not set
              scheduled_start: appointment.appointment_date,
              scheduled_end: scheduledEnd,
              origin: "staff",
              status: "scheduled",
              recorded_by: req.user?.user_id || null,
            });

            // Create visit schedule record
            await VisitSchedule.create({
              schedule_id: uuidv4(),
              visit_id: visit.visit_id,
              proposed_time: appointment.appointment_date,
              proposed_by: req.user?.user_id || null,
              status: "accepted",
              notes: `Auto-created from appointment ${appointment.appointment_id}`,
            });

            console.log(
              `✅ Auto-created donation visit ${visit.visit_id} for confirmed appointment ${id}`
            );
          }
        } catch (visitError) {
          console.error("Error auto-creating donation visit:", visitError);
          // Don't fail the appointment confirmation if visit creation fails
        }
      }

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
