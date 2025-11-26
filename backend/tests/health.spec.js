import request from "supertest";
import app from "../src/app";
import { describe, it, expect } from "@jest/globals";

describe("Health Endpoint", () => {
  it("GET /api/health returns OK status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("message");
  });
});
