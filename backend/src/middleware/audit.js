const AuditService = require("../services/AuditService");

/**
 * Audit Middleware for automatic request logging
 * Implements BR002-6, BR055-3 compliance requirements
 */

/**
 * Extract client IP address from request
 */
const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    "unknown"
  );
};

/**
 * Extract user agent from request
 */
const getUserAgent = (req) => {
  return req.headers["user-agent"] || "unknown";
};

/**
 * Middleware to log authentication events
 */
const auditAuthEvents = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;

    // Capture request metadata
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    const userId = req.user ? req.user.user_id : null;

    // Override response methods to capture result
    res.send = function (data) {
      logAuthEvent(action, userId, res.statusCode, ipAddress, userAgent, data);
      originalSend.call(this, data);
    };

    res.json = function (data) {
      logAuthEvent(action, userId, res.statusCode, ipAddress, userAgent, data);
      originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Log authentication event helper
 */
const logAuthEvent = async (
  action,
  userId,
  statusCode,
  ipAddress,
  userAgent,
  responseData
) => {
  try {
    const status =
      statusCode >= 200 && statusCode < 300 ? "success" : "failure";
    let errorMessage = null;

    // Extract error message for failed attempts
    if (status === "failure" && responseData) {
      if (typeof responseData === "string") {
        try {
          const parsed = JSON.parse(responseData);
          errorMessage = parsed.message || parsed.error;
        } catch {
          errorMessage = responseData;
        }
      } else if (typeof responseData === "object") {
        errorMessage = responseData.message || responseData.error;
      }
    }

    await AuditService.logAuth(
      userId,
      action,
      status,
      ipAddress,
      userAgent,
      errorMessage
    );
  } catch (error) {
    console.error("Failed to log auth event:", error);
  }
};

/**
 * Middleware to log resource operations
 */
const auditResourceOperation = (resourceType, action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;

    // Capture request metadata
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    const userId = req.user ? req.user.user_id : null;
    const resourceId = req.params.id || null;

    // Capture old values for update operations
    let oldValues = null;
    if (action === "update" && req.resourceData) {
      oldValues = req.resourceData;
    }

    // Override response methods to capture result
    res.send = function (data) {
      logResourceOperation(
        resourceType,
        action,
        userId,
        resourceId,
        oldValues,
        res.statusCode,
        ipAddress,
        userAgent,
        data
      );
      originalSend.call(this, data);
    };

    res.json = function (data) {
      logResourceOperation(
        resourceType,
        action,
        userId,
        resourceId,
        oldValues,
        res.statusCode,
        ipAddress,
        userAgent,
        data
      );
      originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Log resource operation helper
 */
const logResourceOperation = async (
  resourceType,
  action,
  userId,
  resourceId,
  oldValues,
  statusCode,
  ipAddress,
  userAgent,
  responseData
) => {
  try {
    const status =
      statusCode >= 200 && statusCode < 300 ? "success" : "failure";

    if (status === "success") {
      let newValues = null;
      if (responseData && typeof responseData === "object") {
        // Extract relevant data from response
        if (responseData.data) {
          newValues = responseData.data;
        } else if (
          responseData.user ||
          responseData.donor ||
          responseData.appointment
        ) {
          newValues =
            responseData.user || responseData.donor || responseData.appointment;
        }
      }

      await AuditService.logResource(
        userId,
        action,
        resourceType,
        resourceId,
        oldValues,
        newValues,
        ipAddress,
        userAgent
      );
    } else {
      let errorMessage = null;
      if (responseData && typeof responseData === "object") {
        errorMessage = responseData.message || responseData.error;
      }

      await AuditService.logFailure(
        userId,
        `${resourceType}_${action}`,
        resourceType,
        resourceId,
        errorMessage,
        ipAddress,
        userAgent
      );
    }
  } catch (error) {
    console.error("Failed to log resource operation:", error);
  }
};

/**
 * General audit middleware for critical actions
 */
const auditCriticalAction = (action, resourceType = null) => {
  return async (req, res, next) => {
    try {
      const ipAddress = getClientIP(req);
      const userAgent = getUserAgent(req);
      const userId = req.user ? req.user.user_id : null;
      const resourceId = req.params.id || req.body.id || null;

      await AuditService.log({
        userId,
        action,
        resourceType,
        resourceId,
        ipAddress,
        userAgent,
        status: "pending",
        newValues: req.body,
      });

      next();
    } catch (error) {
      console.error("Failed to log critical action:", error);
      next(); // Don't block the request
    }
  };
};

/**
 * Middleware to capture resource data before updates (for old values)
 */
const captureResourceData = (model, idField = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[idField];
      if (resourceId && model) {
        const resource = await model.findByPk(resourceId);
        if (resource) {
          req.resourceData = resource.toJSON();
        }
      }
      next();
    } catch (error) {
      console.error("Failed to capture resource data:", error);
      next(); // Don't block the request
    }
  };
};

module.exports = {
  auditAuthEvents,
  auditResourceOperation,
  auditCriticalAction,
  captureResourceData,
  getClientIP,
  getUserAgent,
};
