const AuthService = require("../services/AuthService");

/**
 * JWT Authentication Middleware
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "No valid authentication token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Token not found",
      });
    }

    // Get user from token
    const user = await AuthService.getUserFromToken(token);

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Authentication failed",
      message: error.message,
    });
  }
};

/**
 * Role-based authorization middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        message: "User not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access forbidden",
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const user = await AuthService.getUserFromToken(token);
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

/**
 * Check if email is verified
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User not authenticated",
    });
  }

  if (!req.user.email_verified) {
    return res.status(403).json({
      error: "Email verification required",
      message: "Please verify your email address to access this resource",
    });
  }

  next();
};

/**
 * Rate limiting by user
 */
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requestCounts = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.user_id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    const userRequests = requestCounts.get(userId) || [];
    const recentRequests = userRequests.filter((time) => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: `Too many requests. Maximum ${maxRequests} requests per ${
          windowMs / 1000
        } seconds.`,
      });
    }

    // Add current request
    recentRequests.push(now);
    requestCounts.set(userId, recentRequests);

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  requireEmailVerified,
  userRateLimit,
};
