const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, PasswordHistory } = require("../models");
const SessionService = require("./SessionService");

const _env =
  typeof globalThis !== "undefined" &&
  globalThis.process &&
  globalThis.process.env
    ? globalThis.process.env
    : {};

class AuthService {
  /**
   * Generate JWT access token with session management
   */
  generateAccessToken(user, sessionId = null) {
    // Create session ID if not provided
    if (!sessionId) {
      sessionId = SessionService.generateSessionId();
    }

    const payload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      sessionId,
      type: "access",
    };

    return jwt.sign(payload, _env.JWT_SECRET, {
      expiresIn: _env.JWT_EXPIRES_IN || "24h", // Extended to prevent logout during registration
      issuer: "milk-bank-system",
    });
  }

  /**
   * Generate JWT refresh token with session management
   */
  generateRefreshToken(user, sessionId) {
    const payload = {
      user_id: user.user_id,
      sessionId,
      type: "refresh",
    };

    return jwt.sign(payload, _env.JWT_REFRESH_SECRET, {
      expiresIn: _env.JWT_REFRESH_EXPIRES_IN || "7d",
      issuer: "milk-bank-system",
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token, type = "access") {
    try {
      const secret =
        type === "refresh" ? _env.JWT_REFRESH_SECRET : _env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);

      if (decoded.type !== type) {
        throw new Error("Invalid token type");
      }

      return decoded;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Hash password
   */
  async hashPassword(password) {
    const saltRounds = parseInt(_env.BCRYPT_SALT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Enhanced user login with session management
   */
  async login(email, password, ipAddress = null, userAgent = null) {
    // Find user by email
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      attributes: [
        "user_id",
        "email",
        "password_hash",
        "role",
        "is_active",
        "email_verified",
      ],
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(
      password,
      user.password_hash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate session
    const sessionId = SessionService.generateSessionId();
    const accessToken = this.generateAccessToken(user, sessionId);
    const refreshToken = this.generateRefreshToken(user, sessionId);

    // Create session with the same sessionId
    SessionService.createSession(
      user.user_id,
      accessToken,
      ipAddress,
      userAgent,
      sessionId
    );
    SessionService.storeRefreshToken(sessionId, refreshToken);

    // Update last login
    await user.update({ last_login: new Date() });

    // Determine redirect URL based on role
    let redirectUrl = "/"; // Donors go to landing page
    if (
      user.role === "staff" ||
      user.role === "medical_staff" ||
      user.role === "admin_staff"
    ) {
      redirectUrl = "/staff/dashboard";
    } else if (user.role === "milk_bank_manager") {
      redirectUrl = "/manager/dashboard";
    }

    // Return user data without password
    const userData = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      email_verified: user.email_verified,
    };

    return {
      user: userData,
      accessToken,
      refreshToken,
      sessionId,
      redirectUrl,
    };
  }

  /**
   * Logout user and invalidate session (BR055-1)
   */
  async logout(token) {
    try {
      const decoded = this.verifyToken(token, "access");
      const sessionId = decoded.sessionId;

      if (sessionId) {
        // Remove session
        SessionService.removeSession(sessionId);

        // Remove any associated refresh tokens
        const session = SessionService.getSession(sessionId);
        if (session) {
          // Find and remove refresh token
          SessionService.removeRefreshToken(session.refreshToken);
        }
      }

      return { success: true, message: "Logout successful" };
    } catch (error) {
      // Even if token is invalid, consider logout successful
      console.warn("Logout error:", error);
      return { success: true, message: "Logout successful" };
    }
  }

  /**
   * Logout all user sessions (BR055-1)
   */
  async logoutAll(userId) {
    try {
      const removedCount = SessionService.removeUserSessions(userId);
      return {
        success: true,
        message: `Logged out from ${removedCount} sessions`,
        removedSessions: removedCount,
      };
    } catch (error) {
      throw new Error(`Logout all failed: ${error.message}`);
    }
  }
  async refreshToken(refreshToken) {
    const decoded = this.verifyToken(refreshToken, "refresh");

    // Find user
    const user = await User.findByPk(decoded.user_id, {
      attributes: ["user_id", "email", "role", "is_active"],
    });

    if (!user || !user.is_active) {
      throw new Error("User not found or inactive");
    }

    // Generate new access token
    const newAccessToken = this.generateAccessToken(user);

    return {
      accessToken: newAccessToken,
    };
  }

  /**
   * Get user from token with session validation
   */
  async getUserFromToken(token) {
    const decoded = this.verifyToken(token);

    // Check if session is still valid
    const sessionId = decoded.sessionId;
    if (sessionId) {
      const session = SessionService.getSession(sessionId);
      if (!session) {
        throw new Error("Session expired or invalid");
      }

      // Update session activity (reset timeout)
      SessionService.updateSessionActivity(sessionId);
    }

    const user = await User.findByPk(decoded.user_id, {
      attributes: ["user_id", "email", "role", "is_active", "email_verified"],
    });

    if (!user || !user.is_active) {
      throw new Error("User not found or inactive");
    }

    return user;
  }

  /**
   * Validate password strength based on BR056-01, BR061-01
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    if (password.length < minLength) {
      return {
        valid: false,
        message: "Password must be at least 8 characters long",
      };
    }

    if (!hasUpperCase) {
      return {
        valid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }

    if (!hasLowerCase) {
      return {
        valid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }

    if (!hasNumbers) {
      return {
        valid: false,
        message: "Password must contain at least one number",
      };
    }

    if (!hasNonalphas) {
      return {
        valid: false,
        message: "Password must contain at least one special character",
      };
    }

    return { valid: true, message: "Password is strong" };
  }

  /**
   * Check if password was used in last 3 passwords (BR056-02, BR061-02)
   */
  async checkPasswordHistory(userId, newPassword) {
    try {
      // Get last 3 password hashes
      const passwordHistory = await PasswordHistory.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
        limit: 3,
        attributes: ["password_hash"],
      });

      // Check if new password matches any of the last 3
      for (const historyEntry of passwordHistory) {
        const isMatch = await bcrypt.compare(
          newPassword,
          historyEntry.password_hash
        );
        if (isMatch) {
          return {
            valid: false,
            message: "Cannot reuse any of your last 3 passwords",
          };
        }
      }

      return { valid: true, message: "Password is acceptable" };
    } catch (error) {
      throw new Error(`Password history check failed: ${error.message}`);
    }
  }

  /**
   * Save password to history (BR056-02, BR061-02)
   */
  async savePasswordHistory(userId, passwordHash) {
    try {
      // Save new password to history
      await PasswordHistory.create({
        user_id: userId,
        password_hash: passwordHash,
      });

      // Keep only last 5 entries (for performance)
      const allHistory = await PasswordHistory.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
      });

      // Delete entries beyond the 5th
      if (allHistory.length > 5) {
        const toDelete = allHistory.slice(5);
        for (const entry of toDelete) {
          await entry.destroy();
        }
      }
    } catch (error) {
      throw new Error(`Failed to save password history: ${error.message}`);
    }
  }

  /**
   * Enhanced hash password with history tracking
   */
  async hashPasswordWithHistory(password, userId = null) {
    // Validate password strength
    const validation = this.validatePassword(password);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Check password history if userId provided
    if (userId) {
      const historyCheck = await this.checkPasswordHistory(userId, password);
      if (!historyCheck.valid) {
        throw new Error(historyCheck.message);
      }
    }

    const saltRounds = parseInt(_env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save to history if userId provided
    if (userId) {
      await this.savePasswordHistory(userId, hashedPassword);
    }

    return hashedPassword;
  }
}

module.exports = new AuthService();
