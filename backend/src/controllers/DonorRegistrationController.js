const { Donor, EhrDonor, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

/**
 * Donor Registration Controller
 * Handles donor registration flow for donor portal
 */
class DonorRegistrationController {
  /**
   * POST /api/donor/register
   * Submit donor registration with personal information
   */
  async submitRegistration(req, res) {
    try {
      const userId = req.user.user_id;
      const {
        fullName,
        dob,
        idPassport,
        phone,
        email,
        province,
        district,
        ward,
        address,
      } = req.body;

      // Validate required fields
      if (!fullName || !dob || !idPassport || !phone || !email) {
        return res.status(400).json({
          message: "Missing required fields",
          required: ["fullName", "dob", "idPassport", "phone", "email"],
        });
      }

      // Check if donor already exists
      const existingDonor = await Donor.findByPk(userId);
      if (existingDonor && existingDonor.donor_status !== "in_progress") {
        return res.status(400).json({
          message: "Registration already completed",
        });
      }

      // Update User table with basic info
      await User.update(
        {
          name: fullName,
          phone: phone,
          national_id: idPassport,
        },
        {
          where: { user_id: userId },
        }
      );

      // Create or update Donor record
      const [donor, created] = await Donor.upsert({
        donor_id: userId,
        donor_status: "in_progress",
        screening_status: "pending",
        director_status: "pending",
        consent_signed_at: new Date(),
        consent_method: "online_form",
      });

      // Mock EHR API integration - Always return negative results (pass)
      // In production, this would call government health API
      const mockEhrData = {
        full_name: fullName,
        date_of_birth: dob,
        phone: phone,
        email: email,
        address: address,
        province: province,
        district: district,
        ward: ward,
        national_id: idPassport,
        source_system: "mock_government_ehr",
        last_fetched_at: new Date(),
        // Mock health test results - always negative (pass)
        hiv_result: "negative",
        hiv_sample_date: new Date(),
        hiv_valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        hbv_result: "negative",
        hbv_sample_date: new Date(),
        hbv_valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        hcv_result: "negative",
        hcv_sample_date: new Date(),
        hcv_valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        syphilis_result: "negative",
        syphilis_sample_date: new Date(),
        syphilis_valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        htlv_result: "negative",
        htlv_sample_date: new Date(),
        htlv_valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        is_clear: true,
      };

      // Create or update EHR record with mock government data
      // In production, this data comes from actual government EHR API
      await EhrDonor.upsert({
        donor_id: userId,
        ...mockEhrData,
      });

      console.log(
        `✅ EHR data synced for donor ${userId}: is_clear=${mockEhrData.is_clear}`
      );

      return res.json({
        message: "Registration submitted successfully",
        data: {
          donor_id: userId,
          status: "in_progress",
          ehr_status: "clear",
          next_step: "Schedule interview with medical staff",
        },
      });
    } catch (error) {
      console.error("Error submitting registration:", error);
      return res.status(500).json({
        message: "Failed to submit registration",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/donor/registration/status
   * Get registration status
   */
  async getRegistrationStatus(req, res) {
    try {
      const userId = req.user.user_id;

      const donor = await Donor.findByPk(userId, {
        include: [
          {
            model: EhrDonor,
            as: "ehrData",
            attributes: ["is_clear", "last_fetched_at"],
          },
        ],
      });

      if (!donor) {
        return res.json({
          hasRegistration: false,
          status: "not_started",
        });
      }

      return res.json({
        hasRegistration: true,
        status: donor.donor_status,
        screening_status: donor.screening_status,
        director_status: donor.director_status,
        ehr_clear: donor.ehrData?.is_clear || false,
      });
    } catch (error) {
      console.error("Error fetching registration status:", error);
      return res.status(500).json({
        message: "Failed to fetch registration status",
        error: error.message,
      });
    }
  }
}

module.exports = new DonorRegistrationController();
