/**
 * Staff Controller
 * Handles staff dashboard and staff-specific operations
 */
class StaffController {
  /**
   * Get staff dashboard statistics
   * GET /api/staff/dashboard
   */
  async getDashboard(req, res) {
    try {
      // Return mock data for MVP
      // TODO: Replace with real database queries when tables are ready

      res.json({
        message: "Staff dashboard data retrieved successfully",
        data: {
          totalDonors: 15,
          todayAppointments: 3,
          pendingScreenings: 2,
          monthlyDonations: 45,
          recentActivities: [
            {
              id: 1,
              donorName: "Nguyen Van A",
              donorEmail: "donor@example.com",
              volume: 250,
              date: new Date().toISOString(),
              status: "completed",
            },
          ],
          alerts: [
            {
              type: "info",
              message: "3 appointments scheduled for today",
            },
          ],
        },
      });
    } catch (error) {
      console.error("Get staff dashboard error:", error);
      res.status(500).json({
        error: "Failed to retrieve staff dashboard data",
        message: error.message,
      });
    }
  }

  /**
   * Get staff profile
   * GET /api/staff/profile
   */
  async getProfile(req, res) {
    try {
      const { User } = require("../models");
      const staffId = req.user.user_id;

      const user = await User.findByPk(staffId, {
        attributes: [
          "user_id",
          "email",
          "name",
          "phone",
          "role",
          "is_active",
          "created_at",
        ],
      });

      if (!user) {
        return res.status(404).json({
          error: "Staff not found",
          message: "The specified staff member does not exist",
        });
      }

      res.json({
        message: "Staff profile retrieved successfully",
        data: user,
      });
    } catch (error) {
      console.error("Get staff profile error:", error);
      res.status(500).json({
        error: "Failed to retrieve staff profile",
        message: error.message,
      });
    }
  }
}

module.exports = new StaffController();
