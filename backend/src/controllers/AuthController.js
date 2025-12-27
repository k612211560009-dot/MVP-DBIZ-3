const AuthService = require("../services/AuthService");
const { User, Donor } = require("../models");

/**
 * Auth Controller
 */
class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const { email, password, role, fullName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return res.status(400).json({
          error: "Registration failed",
          message: "Email address is already registered",
        });
      }

      // Validate and hash password with enhanced policy
      const hashedPassword = await AuthService.hashPasswordWithHistory(
        password
      );

      // Create user
      const user = await User.create({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        name: fullName,
        role,
      });

      // If role is donor, create donor record
      if (role === "donor") {
        await Donor.create({
          donor_id: user.user_id,
        });
      }

      // Generate tokens
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      // Return response without password
      res.status(201).json({
        message: "User registered successfully",
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          email_verified: user.email_verified,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed",
        message: "Internal server error during registration",
      });
    }
  }

  /**
   * User login with session management
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Extract client info for session management
      const ipAddress =
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        "unknown";
      const userAgent = req.headers["user-agent"] || "unknown";

      const result = await AuthService.login(
        email,
        password,
        ipAddress,
        userAgent
      );

      res.json({
        success: true,
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({
        success: false,
        error: "Login failed",
        message: error.message,
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      const result = await AuthService.refreshToken(refreshToken);

      res.json({
        message: "Token refreshed successfully",
        ...result,
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(401).json({
        error: "Token refresh failed",
        message: error.message,
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile(req, res) {
    try {
      const user = req.user;

      // Get additional user data including donor info if applicable
      const userData = await User.findByPk(user.user_id, {
        attributes: [
          "user_id",
          "email",
          "name",
          "phone",
          "role",
          "email_verified",
          "is_active",
          "last_login",
          "created_at",
        ],
        include:
          user.role === "donor"
            ? [
                {
                  model: Donor,
                  as: "donorProfile",
                  attributes: [
                    "donor_id",
                    "donor_status",
                    "screening_status",
                    "director_status",
                    "points_total",
                    "consent_signed_at",
                  ],
                },
              ]
            : [],
      });

      if (!userData) {
        return res.status(404).json({
          error: "User not found",
          message: "User profile not found",
        });
      }

      res.json({
        message: "Profile retrieved successfully",
        user: userData,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        error: "Profile retrieval failed",
        message: "Failed to retrieve user profile",
      });
    }
  }

  /**
   * Change user password
   * POST /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.user_id;

      // Get user with password
      const user = await User.findByPk(userId, {
        attributes: ["user_id", "password_hash"],
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User account not found",
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await AuthService.comparePassword(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: "Password change failed",
          message: "Current password is incorrect",
        });
      }

      // Validate and hash new password with enhanced policy
      const hashedNewPassword = await AuthService.hashPasswordWithHistory(
        newPassword,
        user.user_id
      );

      // Update password
      await user.update({
        password_hash: hashedNewPassword,
        password_changed_at: new Date(),
      });

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        error: "Password change failed",
        message: "Failed to change password",
      });
    }
  }

  /**
   * User logout with session invalidation (BR055-1)
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        await AuthService.logout(token);
      }

      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        error: "Logout failed",
        message: "Failed to logout",
      });
    }
  }

  /**
   * Logout from all devices
   * POST /api/auth/logout-all
   */
  async logoutAll(req, res) {
    try {
      const userId = req.user.user_id;
      const result = await AuthService.logoutAll(userId);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Logout all error:", error);
      res.status(500).json({
        success: false,
        error: "Logout all failed",
        message: error.message,
      });
    }
  }

  /**
   * Validate token and return user info
   * GET /api/auth/validate
   */
  async validateToken(req, res) {
    try {
      // If we reach here, the token is valid (checked by auth middleware)
      res.json({
        valid: true,
        user: {
          user_id: req.user.user_id,
          email: req.user.email,
          role: req.user.role,
          email_verified: req.user.email_verified,
        },
      });
    } catch (error) {
      console.error("Token validation error:", error);
      res.status(500).json({
        error: "Token validation failed",
        message: "Failed to validate token",
      });
    }
  }
}

module.exports = new AuthController();
