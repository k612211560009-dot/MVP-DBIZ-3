const { ScreeningSession, Donor, User, Appointment } = require("../models");
const { Op } = require("sequelize");

/**
 * Screening Controller
 */
class ScreeningController {
  /**
   * Get all screening sessions with filtering
   * GET /api/screening
   */
  async getScreeningSessions(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        donor_id,
        result,
        date_from,
        date_to,
        reviewer_id,
        sortBy = "created_at",
        sortOrder = "desc",
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Build where clause for filtering
      const whereClause = {};

      if (donor_id) {
        whereClause.donor_id = donor_id;
      }

      if (result && result !== "all") {
        whereClause.screening_result = result;
      }

      if (reviewer_id) {
        whereClause.reviewer_id = reviewer_id;
      }

      if (date_from || date_to) {
        whereClause.created_at = {};
        if (date_from) {
          whereClause.created_at[Op.gte] = new Date(date_from);
        }
        if (date_to) {
          const endDate = new Date(date_to);
          endDate.setHours(23, 59, 59, 999);
          whereClause.created_at[Op.lte] = endDate;
        }
      }

      const sessions = await ScreeningSession.findAndCountAll({
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
            as: "reviewer",
            attributes: ["user_id", "email", "role"],
          },
          {
            model: Appointment,
            as: "appointment",
            attributes: [
              "appointment_id",
              "appointment_date",
              "time_slot",
              "status",
            ],
          },
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset,
        distinct: true,
      });

      res.json({
        message: "Screening sessions retrieved successfully",
        data: {
          sessions: sessions.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: sessions.count,
            pages: Math.ceil(sessions.count / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get screening sessions error:", error);
      res.status(500).json({
        error: "Failed to retrieve screening sessions",
        message: error.message,
      });
    }
  }

  /**
   * Get screening session by ID
   * GET /api/screening/:id
   */
  async getScreeningById(req, res) {
    try {
      const { id } = req.params;

      const session = await ScreeningSession.findByPk(id, {
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
            as: "reviewer",
            attributes: ["user_id", "email", "role"],
          },
          {
            model: Appointment,
            as: "appointment",
          },
        ],
      });

      if (!session) {
        return res.status(404).json({
          error: "Screening session not found",
          message: "The specified screening session does not exist",
        });
      }

      res.json({
        message: "Screening session retrieved successfully",
        data: { session },
      });
    } catch (error) {
      console.error("Get screening by ID error:", error);
      res.status(500).json({
        error: "Failed to retrieve screening session",
        message: error.message,
      });
    }
  }

  /**
   * Create new screening session
   * POST /api/screening
   */
  async createScreening(req, res) {
    try {
      const {
        donor_id,
        appointment_id,
        questionnaire_data,
        interview_notes,
        health_status,
        consent_signed,
        consent_document_url,
      } = req.body;

      // Check if donor exists
      const donor = await Donor.findByPk(donor_id);
      if (!donor) {
        return res.status(404).json({
          error: "Donor not found",
          message: "The specified donor does not exist",
        });
      }

      // Check if appointment exists (if provided)
      if (appointment_id) {
        const appointment = await Appointment.findByPk(appointment_id);
        if (!appointment) {
          return res.status(404).json({
            error: "Appointment not found",
            message: "The specified appointment does not exist",
          });
        }
      }

      const session = await ScreeningSession.create({
        donor_id,
        appointment_id,
        questionnaire_data,
        interview_notes,
        health_status,
        consent_signed,
        consent_document_url,
        screening_result: "pending_review", // Default status
      });

      // Fetch the created session with includes
      const newSession = await ScreeningSession.findByPk(session.session_id, {
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
            model: Appointment,
            as: "appointment",
          },
        ],
      });

      res.status(201).json({
        message: "Screening session created successfully",
        data: { session: newSession },
      });
    } catch (error) {
      console.error("Create screening error:", error);
      res.status(500).json({
        error: "Failed to create screening session",
        message: error.message,
      });
    }
  }

  /**
   * Update screening session
   * PUT /api/screening/:id
   */
  async updateScreening(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const session = await ScreeningSession.findByPk(id);
      if (!session) {
        return res.status(404).json({
          error: "Screening session not found",
          message: "The specified screening session does not exist",
        });
      }

      // Don't allow updates to reviewed sessions
      if (
        session.screening_result !== "pending_review" &&
        updateData.screening_result
      ) {
        return res.status(400).json({
          error: "Cannot update screening",
          message: "Reviewed screening sessions cannot be modified",
        });
      }

      await session.update(updateData);

      // Fetch updated session with includes
      const updatedSession = await ScreeningSession.findByPk(id, {
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
            as: "reviewer",
            attributes: ["user_id", "email", "role"],
          },
          {
            model: Appointment,
            as: "appointment",
          },
        ],
      });

      res.json({
        message: "Screening session updated successfully",
        data: { session: updatedSession },
      });
    } catch (error) {
      console.error("Update screening error:", error);
      res.status(500).json({
        error: "Failed to update screening session",
        message: error.message,
      });
    }
  }

  /**
   * Submit screening result (review)
   * POST /api/screening/:id/review
   */
  async submitScreeningResult(req, res) {
    try {
      const { id } = req.params;
      const { screening_result, next_steps, expiry_date } = req.body;

      const session = await ScreeningSession.findByPk(id, {
        include: [
          {
            model: Donor,
            as: "donor",
          },
        ],
      });

      if (!session) {
        return res.status(404).json({
          error: "Screening session not found",
          message: "The specified screening session does not exist",
        });
      }

      const validResults = ["passed", "failed", "pending_review"];
      if (!validResults.includes(screening_result)) {
        return res.status(400).json({
          error: "Invalid screening result",
          message: `Result must be one of: ${validResults.join(", ")}`,
        });
      }

      // Update screening session
      await session.update({
        screening_result,
        next_steps,
        expiry_date: expiry_date ? new Date(expiry_date) : null,
        reviewer_id: req.user.user_id,
        reviewed_at: new Date(),
      });

      // Update donor screening status based on result
      if (screening_result === "passed") {
        await session.donor.update({
          screening_status: "approved",
        });
      } else if (screening_result === "failed") {
        await session.donor.update({
          screening_status: "rejected",
        });
      }

      res.json({
        message: "Screening result submitted successfully",
        data: {
          session_id: id,
          screening_result,
          reviewed_by: req.user.user_id,
          reviewed_at: new Date(),
        },
      });
    } catch (error) {
      console.error("Submit screening result error:", error);
      res.status(500).json({
        error: "Failed to submit screening result",
        message: error.message,
      });
    }
  }

  /**
   * Get screening form template
   * GET /api/screening/form-template
   */
  async getFormTemplate(req, res) {
    try {
      // This would typically be stored in database or configuration
      const formTemplate = {
        sections: [
          {
            title: "Personal Health Information",
            questions: [
              {
                id: "current_medications",
                type: "textarea",
                question:
                  "Are you currently taking any medications, vitamins, or supplements?",
                required: true,
              },
              {
                id: "medical_conditions",
                type: "textarea",
                question:
                  "Do you have any current medical conditions or chronic illnesses?",
                required: true,
              },
              {
                id: "recent_illnesses",
                type: "textarea",
                question: "Have you had any illnesses in the past 30 days?",
                required: true,
              },
            ],
          },
          {
            title: "Pregnancy and Lactation",
            questions: [
              {
                id: "delivery_date",
                type: "date",
                question: "What was your delivery date?",
                required: true,
              },
              {
                id: "pregnancy_complications",
                type: "textarea",
                question:
                  "Did you experience any complications during pregnancy or delivery?",
                required: true,
              },
              {
                id: "breastfeeding_duration",
                type: "select",
                question: "How long have you been breastfeeding?",
                options: [
                  "Less than 1 month",
                  "1-3 months",
                  "3-6 months",
                  "6+ months",
                ],
                required: true,
              },
            ],
          },
          {
            title: "Lifestyle Factors",
            questions: [
              {
                id: "smoking_alcohol",
                type: "radio",
                question: "Do you smoke or consume alcohol?",
                options: ["No", "Occasionally", "Regularly"],
                required: true,
              },
              {
                id: "diet_restrictions",
                type: "textarea",
                question: "Do you have any dietary restrictions or allergies?",
                required: false,
              },
            ],
          },
        ],
      };

      res.json({
        message: "Screening form template retrieved successfully",
        data: { template: formTemplate },
      });
    } catch (error) {
      console.error("Get form template error:", error);
      res.status(500).json({
        error: "Failed to retrieve form template",
        message: error.message,
      });
    }
  }
}

module.exports = new ScreeningController();
