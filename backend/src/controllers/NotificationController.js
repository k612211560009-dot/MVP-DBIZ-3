const { Notification, Donor, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

class NotificationController {
  /**
   * GET /api/notifications
   * Get all notifications for staff with filters
   */
  async getNotifications(req, res) {
    try {
      const {
        status = "unread",
        priority,
        type,
        page = 1,
        limit = 20,
      } = req.query;

      const whereClause = {};

      if (status && status !== "all") {
        whereClause.status = status;
      }

      if (priority && priority !== "all") {
        whereClause.priority = priority;
      }

      if (type && type !== "all") {
        whereClause.type = type;
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const notifications = await Notification.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Donor,
            as: "donor",
            required: false,
            include: [
              {
                model: User,
                as: "user",
                attributes: ["user_id", "email", "name", "phone"],
              },
            ],
          },
        ],
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset,
      });

      res.json({
        message: "Notifications retrieved successfully",
        data: {
          notifications: notifications.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: notifications.count,
            pages: Math.ceil(notifications.count / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({
        error: "Failed to retrieve notifications",
        message: error.message,
      });
    }
  }

  /**
   * PATCH /api/notifications/:id/status
   * Update notification status
   */
  async updateNotificationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["unread", "read", "resolved"].includes(status)) {
        return res.status(400).json({
          error: "Invalid status",
          message: "Status must be: unread, read, or resolved",
        });
      }

      const notification = await Notification.findByPk(id);
      if (!notification) {
        return res.status(404).json({
          error: "Notification not found",
        });
      }

      const updateData = { status };
      if (status === "resolved") {
        updateData.resolved_at = new Date();
        updateData.resolved_by = req.user.user_id;
      }

      await notification.update(updateData);

      res.json({
        message: "Notification status updated successfully",
        data: notification,
      });
    } catch (error) {
      console.error("Update notification status error:", error);
      res.status(500).json({
        error: "Failed to update notification status",
        message: error.message,
      });
    }
  }

  /**
   * POST /api/notifications
   * Create a new notification (internal use)
   */
  static async createNotification({
    type,
    title,
    message,
    priority = "medium",
    related_donor_id = null,
    related_entity_type = null,
    related_entity_id = null,
    metadata = null,
  }) {
    try {
      const notification = await Notification.create({
        notification_id: uuidv4(),
        type,
        title,
        message,
        priority,
        status: "unread",
        related_donor_id,
        related_entity_type,
        related_entity_id,
        metadata,
      });

      console.log(`✅ Notification created: ${type} - ${title}`);
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }
}

const notificationController = new NotificationController();
notificationController.createNotification =
  NotificationController.createNotification;

module.exports = notificationController;
