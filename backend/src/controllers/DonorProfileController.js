const {
  Donor,
  EhrDonor,
  User,
  DonationVisit,
  Appointment,
} = require("../models");

/**
 * Donor Profile Controller
 * Handles donor profile operations for donor portal
 */
class DonorProfileController {
  /**
   * GET /api/donor/profile
   * Get current donor's complete profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.user_id;

      // Get donor with all associations
      const donor = await Donor.findOne({
        where: { donor_id: userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "email", "name", "phone", "national_id"],
          },
          {
            model: EhrDonor,
            as: "ehrData",
            attributes: [
              "full_name",
              "date_of_birth",
              "phone",
              "email",
              "address",
              "province",
              "district",
              "ward",
              "hiv_result",
              "hiv_sample_date",
              "hiv_valid_until",
              "hbv_result",
              "hbv_sample_date",
              "hbv_valid_until",
              "hcv_result",
              "hcv_sample_date",
              "hcv_valid_until",
              "syphilis_result",
              "syphilis_sample_date",
              "syphilis_valid_until",
              "is_clear",
            ],
          },
        ],
      });

      if (!donor) {
        return res.status(404).json({
          message: "Donor profile not found",
          hasProfile: false,
        });
      }

      // Calculate statistics
      const [totalDonations, totalVolume, upcomingAppointments] =
        await Promise.all([
          DonationVisit.count({
            where: {
              donor_id: userId,
              status: "completed",
            },
          }),
          DonationVisit.sum("volume_ml", {
            where: {
              donor_id: userId,
              status: "completed",
            },
          }),
          Appointment.count({
            where: {
              donor_id: userId,
              status: "scheduled",
            },
          }),
        ]);

      return res.json({
        message: "Profile retrieved successfully",
        hasProfile: true,
        data: {
          // Donor status
          donorId: donor.donor_id,
          donor_status: donor.donor_status,
          screening_status: donor.screening_status,
          director_status: donor.director_status,
          consent_signed_at: donor.consent_signed_at,
          points_total: donor.points_total || 0,

          // Personal information from EHR or User
          fullName: donor.ehrData?.full_name || donor.user?.name,
          dob: donor.ehrData?.date_of_birth,
          phone: donor.ehrData?.phone || donor.user?.phone,
          email: donor.ehrData?.email || donor.user?.email,
          nationalId: donor.user?.national_id,
          address: donor.ehrData?.address,
          province: donor.ehrData?.province,
          district: donor.ehrData?.district,
          ward: donor.ehrData?.ward,

          // Health screening results (EHR)
          healthScreening: {
            hiv: {
              result: donor.ehrData?.hiv_result,
              sample_date: donor.ehrData?.hiv_sample_date,
              valid_until: donor.ehrData?.hiv_valid_until,
            },
            hepatitisB: {
              result: donor.ehrData?.hbv_result,
              sample_date: donor.ehrData?.hbv_sample_date,
              valid_until: donor.ehrData?.hbv_valid_until,
            },
            hepatitisC: {
              result: donor.ehrData?.hcv_result,
              sample_date: donor.ehrData?.hcv_sample_date,
              valid_until: donor.ehrData?.hcv_valid_until,
            },
            syphilis: {
              result: donor.ehrData?.syphilis_result,
              sample_date: donor.ehrData?.syphilis_sample_date,
              valid_until: donor.ehrData?.syphilis_valid_until,
            },
            is_clear: donor.ehrData?.is_clear || false,
          },

          // Statistics
          statistics: {
            totalDonations: totalDonations || 0,
            totalVolume: totalVolume || 0,
            upcomingAppointments: upcomingAppointments || 0,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching donor profile:", error);
      return res.status(500).json({
        message: "Failed to fetch profile",
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/donor/profile
   * Update donor profile information
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.user_id;
      const { fullName, phone, email, address, province, district, ward } =
        req.body;

      const donor = await Donor.findOne({
        where: { donor_id: userId },
        include: [
          {
            model: EhrDonor,
            as: "ehrData",
          },
        ],
      });

      if (!donor) {
        return res.status(404).json({
          message: "Donor profile not found",
        });
      }

      // Update EHR data if exists
      if (donor.ehrData) {
        const ehrUpdates = {};
        if (fullName) ehrUpdates.full_name = fullName;
        if (phone) ehrUpdates.phone = phone;
        if (email) ehrUpdates.email = email;
        if (address) ehrUpdates.address = address;
        if (province) ehrUpdates.province = province;
        if (district) ehrUpdates.district = district;
        if (ward) ehrUpdates.ward = ward;

        await donor.ehrData.update(ehrUpdates);
      }

      // Also update User table
      if (phone || fullName) {
        const userUpdates = {};
        if (phone) userUpdates.phone = phone;
        if (fullName) userUpdates.name = fullName;

        await User.update(userUpdates, {
          where: { user_id: userId },
        });
      }

      return res.json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        message: "Failed to update profile",
        error: error.message,
      });
    }
  }
}

module.exports = new DonorProfileController();
