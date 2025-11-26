const express = require("express");
const AuthController = require("../controllers/AuthController");
const { authenticate } = require("../middleware/auth");
const { validationMiddleware } = require("../middleware/validation");
const { auditAuthEvents, auditCriticalAction } = require("../middleware/audit");

const router = express.Router();

/**
 * Authentication Routes
 */

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  "/register",
  validationMiddleware.validateRegister,
  auditAuthEvents("register"),
  AuthController.register
);

// @route   POST /api/auth/login
// @desc    User login
// @access  Public
router.post(
  "/login",
  validationMiddleware.validateLogin,
  auditAuthEvents("login"),
  AuthController.login
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post(
  "/refresh",
  validationMiddleware.validateRefreshToken,
  auditAuthEvents("refresh_token"),
  AuthController.refreshToken
);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", authenticate, AuthController.getProfile);

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post(
  "/change-password",
  authenticate,
  validationMiddleware.validateChangePassword,
  auditCriticalAction("change_password", "user"),
  AuthController.changePassword
);

// @route   POST /api/auth/logout
// @desc    User logout
// @access  Private
router.post(
  "/logout",
  authenticate,
  auditAuthEvents("logout"),
  AuthController.logout
);

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post(
  "/logout-all",
  authenticate,
  auditCriticalAction("logout_all", "session"),
  AuthController.logoutAll
);

// @route   GET /api/auth/validate
// @desc    Validate token and return user info
// @access  Private
router.get("/validate", authenticate, AuthController.validateToken);

module.exports = router;
