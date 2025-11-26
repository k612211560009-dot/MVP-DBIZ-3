const { AuditLog, sequelize, Sequelize } = require("../models");

/**
 * Audit Logging Service
 * Implements BR002-6, BR055-3 for compliance logging
 */
class AuditService {
  /**
   * Log user action for audit trail
   * @param {Object} logData - The audit log data
   * @param {string} logData.userId - User ID performing the action (null for system actions)
   * @param {string} logData.action - Action being performed
   * @param {string} logData.resourceType - Type of resource affected
   * @param {string} logData.resourceId - ID of affected resource
   * @param {Object} logData.oldValues - Previous values (for updates)
   * @param {Object} logData.newValues - New values (for creates/updates)
   * @param {string} logData.ipAddress - Client IP address
   * @param {string} logData.userAgent - Client user agent
   * @param {string} logData.status - success/failure/pending
   * @param {string} logData.errorMessage - Error message if status is failure
   * @param {Object} logData.metadata - Additional metadata
   */
  async log({
    userId = null,
    action,
    resourceType = null,
    resourceId = null,
    oldValues = null,
    newValues = null,
    ipAddress = null,
    userAgent = null,
    status = "success",
    errorMessage = null,
    metadata = null,
  }) {
    try {
      const logEntry = await AuditLog.create({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        old_values: oldValues ? JSON.stringify(oldValues) : null,
        new_values: newValues ? JSON.stringify(newValues) : null,
        ip_address: ipAddress,
        user_agent: userAgent,
        status,
        error_message: errorMessage,
        metadata: metadata ? JSON.stringify(metadata) : null,
        timestamp: new Date(),
      });

      return logEntry;
    } catch (error) {
      // Don't throw - logging should not break application flow
      console.error("Audit logging failed:", error);
      return null;
    }
  }

  /**
   * Log authentication events (login, logout, password changes)
   */
  async logAuth(
    userId,
    action,
    status,
    ipAddress,
    userAgent,
    errorMessage = null
  ) {
    return this.log({
      userId,
      action: `auth_${action}`,
      resourceType: "authentication",
      resourceId: userId,
      ipAddress,
      userAgent,
      status,
      errorMessage,
    });
  }

  /**
   * Log resource CRUD operations
   */
  async logResource(
    userId,
    action,
    resourceType,
    resourceId,
    oldValues,
    newValues,
    ipAddress,
    userAgent
  ) {
    return this.log({
      userId,
      action: `${resourceType}_${action}`,
      resourceType,
      resourceId,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
      status: "success",
    });
  }

  /**
   * Log permission changes (BR049-5)
   */
  async logPermission(
    userId,
    action,
    targetUserId,
    permissions,
    ipAddress,
    userAgent
  ) {
    return this.log({
      userId,
      action: `permission_${action}`,
      resourceType: "user_permission",
      resourceId: targetUserId,
      newValues: permissions,
      ipAddress,
      userAgent,
      status: "success",
      metadata: {
        target_user_id: targetUserId,
        permissions: permissions,
      },
    });
  }

  /**
   * Log appointment changes (BR002-6)
   */
  async logAppointment(
    userId,
    action,
    appointmentId,
    oldData,
    newData,
    ipAddress,
    userAgent,
    reason = null
  ) {
    return this.log({
      userId,
      action: `appointment_${action}`,
      resourceType: "appointment",
      resourceId: appointmentId,
      oldValues: oldData,
      newValues: newData,
      ipAddress,
      userAgent,
      status: "success",
      metadata: reason ? { reason } : null,
    });
  }

  /**
   * Log donor registration changes
   */
  async logDonorRegistration(
    userId,
    action,
    donorId,
    oldData,
    newData,
    ipAddress,
    userAgent
  ) {
    return this.log({
      userId,
      action: `donor_${action}`,
      resourceType: "donor_registration",
      resourceId: donorId,
      oldValues: oldData,
      newValues: newData,
      ipAddress,
      userAgent,
      status: "success",
    });
  }

  /**
   * Log failed operations
   */
  async logFailure(
    userId,
    action,
    resourceType,
    resourceId,
    errorMessage,
    ipAddress,
    userAgent
  ) {
    return this.log({
      userId,
      action,
      resourceType,
      resourceId,
      ipAddress,
      userAgent,
      status: "failure",
      errorMessage,
    });
  }

  /**
   * Get audit logs for a specific user (admin only)
   */
  async getUserAuditLogs(userId, limit = 100, offset = 0) {
    try {
      const logs = await AuditLog.findAndCountAll({
        where: { user_id: userId },
        order: [["timestamp", "DESC"]],
        limit,
        offset,
        include: [
          {
            model: sequelize.models.User,
            as: "user",
            attributes: ["user_id", "email", "name", "role"],
          },
        ],
      });

      return logs;
    } catch (error) {
      throw new Error(`Failed to retrieve audit logs: ${error.message}`);
    }
  }

  /**
   * Get audit logs by action type
   */
  async getActionAuditLogs(action, limit = 100, offset = 0) {
    try {
      const logs = await AuditLog.findAndCountAll({
        where: { action },
        order: [["timestamp", "DESC"]],
        limit,
        offset,
      });

      return logs;
    } catch (error) {
      throw new Error(`Failed to retrieve audit logs: ${error.message}`);
    }
  }

  /**
   * Clean old audit logs (retention policy)
   */
  async cleanOldLogs(retentionDays = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const deletedCount = await AuditLog.destroy({
        where: {
          timestamp: {
            [Sequelize.Op.lt]: cutoffDate,
          },
        },
      });

      console.log(
        `Cleaned ${deletedCount} audit log entries older than ${retentionDays} days`
      );
      return deletedCount;
    } catch (error) {
      console.error("Failed to clean old audit logs:", error);
      throw error;
    }
  }
}

module.exports = new AuditService();
