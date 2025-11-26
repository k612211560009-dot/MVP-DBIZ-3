const { Appointment, Donor, EhrDonor, User, AuditLog } = require("../models");
const { Op } = require("sequelize");

/**
 * Appointment Management Controller for Staff
 * Handles appointment listing, check-in, marking as failed, and rescheduling
 */
class AppointmentManagementController {
  /**
   * GET /api/staff/appointments
   * Get list of appointments with filtering
   */
  async getAppointments(req, res) {
    try {
      const {
        status,
        type,
        date,
        page = 1,
        per_page = 25,
        sort_by = "appointment_date",
        order = "desc",
      } = req.query;

      const limit = parseInt(per_page);
      const offset = (parseInt(page) - 1) * limit;

      // Build where clause
      const where = {};

      if (status && status !== "all") {
        where.status = status;
      }

      if (type && type !== "all") {
        where.appointment_type = type;
      }

      if (date) {
        // Filter by specific date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        where.appointment_date = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }

      // Get appointments with donor info
      const { count, rows: appointments } = await Appointment.findAndCountAll({
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
            as: "creator",
            attributes: ["user_id", "email"],
          },
        ],
      });

      // Calculate pagination
      const total_pages = Math.ceil(count / limit);

      return res.json({
        message: "Appointments retrieved successfully",
        data: {
          appointments,
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
      console.error("Error fetching appointments:", error);
      return res.status(500).json({
        message: "Failed to fetch appointments",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/staff/appointments/:id/check-in
   * Check-in donor for appointment
   */
  async checkInAppointment(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const appointment = await Appointment.findOne({
        where: { appointment_id: id },
      });

      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      if (appointment.status === "completed") {
        return res.status(400).json({
          message: "Appointment already completed",
        });
      }

      if (appointment.status === "cancelled") {
        return res.status(400).json({
          message: "Cannot check-in a cancelled appointment",
        });
      }

      // Update appointment
      await appointment.update({
        status: "completed",
        actual_check_in_time: new Date(),
        notes: notes || appointment.notes,
        updated_at: new Date(),
      });

      // Create audit log
      await AuditLog.create({
        user_id: req.user.user_id,
        action: "APPOINTMENT_CHECK_IN",
        resource_type: "appointment",
        resource_id: id,
        changes: JSON.stringify({
          status: "completed",
          check_in_time: new Date(),
          notes,
        }),
        ip_address: req.ip,
      });

      return res.json({
        message: "Appointment checked in successfully",
        data: appointment,
      });
    } catch (error) {
      console.error("Error checking in appointment:", error);
      return res.status(500).json({
        message: "Failed to check-in appointment",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/staff/appointments/:id/mark-failed
   * Mark appointment as failed/no-show
   */
  async markAppointmentFailed(req, res) {
    try {
      const { id } = req.params;
      const { reason, notes } = req.body;

      if (!reason) {
        return res.status(400).json({
          message: "Reason is required",
        });
      }

      const appointment = await Appointment.findOne({
        where: { appointment_id: id },
      });

      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      if (appointment.status === "completed") {
        return res.status(400).json({
          message: "Cannot mark completed appointment as failed",
        });
      }

      // Update appointment
      await appointment.update({
        status: "failed",
        failure_reason: reason,
        notes: notes
          ? `${appointment.notes || ""}\n${notes}`
          : appointment.notes,
        updated_at: new Date(),
      });

      // Create audit log
      await AuditLog.create({
        user_id: req.user.user_id,
        action: "APPOINTMENT_MARK_FAILED",
        resource_type: "appointment",
        resource_id: id,
        changes: JSON.stringify({
          status: "failed",
          reason,
          notes,
        }),
        ip_address: req.ip,
      });

      return res.json({
        message: "Appointment marked as failed",
        data: appointment,
      });
    } catch (error) {
      console.error("Error marking appointment as failed:", error);
      return res.status(500).json({
        message: "Failed to mark appointment as failed",
        error: error.message,
      });
    }
  }

  /**
   * PATCH /api/staff/appointments/:id/reschedule
   * Reschedule an appointment
   */
  async rescheduleAppointment(req, res) {
    try {
      const { id } = req.params;
      const { new_date, notes } = req.body;

      if (!new_date) {
        return res.status(400).json({
          message: "New appointment date is required",
        });
      }

      const appointment = await Appointment.findOne({
        where: { appointment_id: id },
      });

      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      if (appointment.status === "completed") {
        return res.status(400).json({
          message: "Cannot reschedule completed appointment",
        });
      }

      const oldDate = appointment.appointment_date;

      // Update appointment
      await appointment.update({
        appointment_date: new Date(new_date),
        status: "scheduled",
        notes: notes
          ? `${appointment.notes || ""}\nRescheduled: ${notes}`
          : appointment.notes,
        updated_at: new Date(),
      });

      // Create audit log
      await AuditLog.create({
        user_id: req.user.user_id,
        action: "APPOINTMENT_RESCHEDULE",
        resource_type: "appointment",
        resource_id: id,
        changes: JSON.stringify({
          old_date: oldDate,
          new_date,
          notes,
        }),
        ip_address: req.ip,
      });

      return res.json({
        message: "Appointment rescheduled successfully",
        data: appointment,
      });
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      return res.status(500).json({
        message: "Failed to reschedule appointment",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/staff/appointments/today
   * Get today's appointments
   */
  async getTodayAppointments(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointments = await Appointment.findAll({
        where: {
          appointment_date: {
            [Op.between]: [today, tomorrow],
          },
        },
        order: [["appointment_date", "ASC"]],
        include: [
          {
            model: Donor,
            as: "donor",
            attributes: ["donor_id", "full_name", "phone"],
          },
        ],
      });

      return res.json({
        message: "Today's appointments retrieved successfully",
        data: {
          date: today.toISOString().split("T")[0],
          total: appointments.length,
          appointments,
        },
      });
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
      return res.status(500).json({
        message: "Failed to fetch today's appointments",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/staff/appointments/stats
   * Get appointment statistics
   */
  async getAppointmentStats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayCount = await Appointment.count({
        where: {
          appointment_date: {
            [Op.between]: [today, tomorrow],
          },
        },
      });

      const scheduledCount = await Appointment.count({
        where: { status: "scheduled" },
      });

      const completedCount = await Appointment.count({
        where: { status: "completed" },
      });

      const failedCount = await Appointment.count({
        where: { status: "failed" },
      });

      return res.json({
        message: "Appointment statistics retrieved successfully",
        data: {
          today: todayCount,
          scheduled: scheduledCount,
          completed: completedCount,
          failed: failedCount,
        },
      });
    } catch (error) {
      console.error("Error fetching appointment stats:", error);
      return res.status(500).json({
        message: "Failed to fetch appointment statistics",
        error: error.message,
      });
    }
  }
}

module.exports = new AppointmentManagementController();
