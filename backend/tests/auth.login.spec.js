import request from "supertest";
import app from "../src/app";
import { describe, it, expect } from "@jest/globals";

// Using seeded credentials (admin@milkbank.com / password123)

describe("Auth Login", () => {
  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@milkbank.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@milkbank.com", password: "wrongpass" });
    expect(res.status).toBe(401);
  });
});
