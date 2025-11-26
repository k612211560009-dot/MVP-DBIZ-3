const jwt = require("jsonwebtoken");

/**
 * Session Management Service
 * Implements BR060-03: Auto logout after 15 minutes
 * Implements BR055-1: Proper session invalidation
 */
class SessionService {
  constructor() {
    // In-memory session store (in production, use Redis)
    this.activeSessions = new Map();
    this.refreshTokens = new Map();

    // Session timeout: 15 minutes
    this.SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

    // Start cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Create a new session
   */
  createSession(userId, token, ipAddress, userAgent, sessionId = null) {
    if (!sessionId) {
      sessionId = this.generateSessionId();
    }
    const expiresAt = new Date(Date.now() + this.SESSION_TIMEOUT);

    const sessionData = {
      sessionId,
      userId,
      token,
      ipAddress,
      userAgent,
      createdAt: new Date(),
      expiresAt,
      lastActivity: new Date(),
    };

    this.activeSessions.set(sessionId, sessionData);

    // Also track by userId for multi-session management
    const userSessions = this.getUserSessions(userId);
    userSessions.push(sessionId);

    return sessionData;
  }

  /**
   * Update session activity (reset timeout)
   */
  updateSessionActivity(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
      session.expiresAt = new Date(Date.now() + this.SESSION_TIMEOUT);
      this.activeSessions.set(sessionId, session);
      return true;
    }
    return false;
  }

  /**
   * Get session by session ID
   */
  getSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (session && session.expiresAt > new Date()) {
      return session;
    }

    // Session expired, remove it
    if (session) {
      this.removeSession(sessionId);
    }

    return null;
  }

  /**
   * Get session by token
   */
  getSessionByToken(token) {
    for (const [sessionId, session] of this.activeSessions) {
      if (session.token === token) {
        if (session.expiresAt > new Date()) {
          return session;
        } else {
          // Expired session, remove it
          this.removeSession(sessionId);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(userId) {
    const sessions = [];
    for (const session of this.activeSessions.values()) {
      if (session.userId === userId && session.expiresAt > new Date()) {
        sessions.push(session);
      }
    }
    return sessions;
  }

  /**
   * Remove a specific session
   */
  removeSession(sessionId) {
    return this.activeSessions.delete(sessionId);
  }

  /**
   * Remove all sessions for a user (BR055-1)
   */
  removeUserSessions(userId) {
    let removedCount = 0;
    for (const [sessionId, session] of this.activeSessions) {
      if (session.userId === userId) {
        this.activeSessions.delete(sessionId);
        removedCount++;
      }
    }
    return removedCount;
  }

  /**
   * Check if session is valid and not expired
   */
  isSessionValid(sessionId) {
    const session = this.getSession(sessionId);
    return session !== null;
  }

  /**
   * Extract session ID from token payload
   */
  getSessionIdFromToken(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded?.sessionId || null;
    } catch {
      return null;
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Store refresh token with session
   */
  storeRefreshToken(sessionId, refreshToken) {
    this.refreshTokens.set(refreshToken, sessionId);
  }

  /**
   * Remove refresh token
   */
  removeRefreshToken(refreshToken) {
    return this.refreshTokens.delete(refreshToken);
  }

  /**
   * Get session by refresh token
   */
  getSessionByRefreshToken(refreshToken) {
    const sessionId = this.refreshTokens.get(refreshToken);
    if (sessionId) {
      return this.getSession(sessionId);
    }
    return null;
  }

  /**
   * Clean expired sessions and tokens
   */
  cleanupExpiredSessions() {
    let cleanedCount = 0;
    const now = new Date();

    // Clean expired sessions
    for (const [sessionId, session] of this.activeSessions) {
      if (session.expiresAt <= now) {
        this.activeSessions.delete(sessionId);
        cleanedCount++;
      }
    }

    // Clean orphaned refresh tokens
    for (const [refreshToken, sessionId] of this.refreshTokens) {
      if (!this.activeSessions.has(sessionId)) {
        this.refreshTokens.delete(refreshToken);
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned ${cleanedCount} expired sessions`);
    }

    return cleanedCount;
  }

  /**
   * Start automatic cleanup of expired sessions
   */
  startCleanupInterval() {
    // Run cleanup every 5 minutes
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000);
  }

  /**
   * Get session statistics
   */
  getSessionStats() {
    const totalSessions = this.activeSessions.size;
    const totalRefreshTokens = this.refreshTokens.size;

    // Count sessions by user
    const userSessionCounts = {};
    for (const session of this.activeSessions.values()) {
      userSessionCounts[session.userId] =
        (userSessionCounts[session.userId] || 0) + 1;
    }

    return {
      totalSessions,
      totalRefreshTokens,
      userSessionCounts,
      sessionTimeout: this.SESSION_TIMEOUT,
    };
  }

  /**
   * Force logout all sessions (emergency)
   */
  clearAllSessions() {
    const count = this.activeSessions.size;
    this.activeSessions.clear();
    this.refreshTokens.clear();
    console.log(`Emergency logout: Cleared ${count} sessions`);
    return count;
  }
}

module.exports = new SessionService();
