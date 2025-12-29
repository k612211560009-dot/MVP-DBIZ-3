import request from "supertest";
import app from "../src/app";
import AuthService from "../src/services/AuthService";
import { describe, it, test, expect } from "@jest/globals";

/**
 * Additional auth route behaviors focusing on AuthService session/token logic.
 * Uses seeded admin user: admin@milkbank.com / password123
 */

describe("Auth Additional Behaviors", () => {
  describe("Password strength validation (hashPasswordWithHistory)", () => {
    const weakPasswords = [
      "short7!", // too short
      "alllowercase1!", // no uppercase
      "ALLUPPERCASE1!", // no lowercase
      "NoNumbers!", // no numbers
      "NoSpecial123", // no special
    ];

    test.each(weakPasswords)("should reject weak password: %s", async (pwd) => {
      await expect(AuthService.hashPasswordWithHistory(pwd)).rejects.toThrow();
    });

    it("should accept a strong password", async () => {
      const strong = "Str0ng!Passw0rd";
      const hash = await AuthService.hashPasswordWithHistory(strong);
      expect(typeof hash).toBe("string");
      expect(hash.length).toBeGreaterThan(20);
    });
  });

  describe("Login flow and token types", () => {
    it("should include correct token type claims", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@milkbank.com", password: "password123" });

      expect(res.status).toBe(200);
      const { accessToken, refreshToken } = res.body;
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();

      // verify types using service
      const accessDecoded = AuthService.verifyToken(accessToken, "access");
      const refreshDecoded = AuthService.verifyToken(refreshToken, "refresh");
      expect(accessDecoded.type).toBe("access");
      expect(refreshDecoded.type).toBe("refresh");
      expect(accessDecoded).toHaveProperty("sessionId");
      expect(refreshDecoded).toHaveProperty("sessionId");
    });

    it("should reject verifyToken with wrong expected type", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@milkbank.com", password: "password123" });

      expect(res.status).toBe(200);
      const { accessToken } = res.body;
      expect(() => AuthService.verifyToken(accessToken, "refresh")).toThrow(
        /Invalid token type|Token verification failed/
      );
    });
  });

  describe("Refresh token endpoint", () => {
    it("should issue a new access token from refresh token", async () => {
      const login = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@milkbank.com", password: "password123" });

      const { refreshToken } = login.body;
      const res = await request(app)
        .post("/api/auth/refresh-token")
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      const decoded = AuthService.verifyToken(res.body.accessToken, "access");
      expect(decoded).toHaveProperty("user_id");
    });
  });

  describe("Logout semantics", () => {
    it("should return success even if access token is invalid on logout", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "Bearer invalid.token.value");

      // Service returns success for invalid tokens by design
      expect([200, 204]).toContain(res.status);
    });
  });

  describe("Profile requires valid session", () => {
    it("should deny profile access with expired/invalid session", async () => {
      // Login to obtain a valid token
      const login = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@milkbank.com", password: "password123" });
      expect(login.status).toBe(200);
      const { accessToken } = login.body;

      // Decode to capture sessionId, then simulate removal by logging out (which removes session)
      const decoded = AuthService.verifyToken(accessToken, "access");
      expect(decoded.sessionId).toBeTruthy();

      // logout to remove the server-side session mapping
      await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      // Attempt to access profile with the now session-less token
      const profile = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`);

      expect([401, 403]).toContain(profile.status);
    });
  });
});
