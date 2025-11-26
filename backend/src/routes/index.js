const express = require("express");
const authRoutes = require("./auth");
const donorRoutes = require("./donors");
const appointmentRoutes = require("./appointments");
const screeningRoutes = require("./screening");
const donationVisitRoutes = require("./donationVisits");
const staffRoutes = require("./staff");

const router = express.Router();

/**
 * API Routes Index
 */

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Milk Bank System API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Authentication routes
router.use("/auth", authRoutes);

// Core feature routes
router.use("/donors", donorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/screening", screeningRoutes);
router.use("/donation-visits", donationVisitRoutes);
router.use("/staff", staffRoutes);

// TODO: Add remaining route modules here
// router.use('/medical-tests', medicalTestRoutes);
// router.use('/rewards', rewardRoutes);

module.exports = router;
