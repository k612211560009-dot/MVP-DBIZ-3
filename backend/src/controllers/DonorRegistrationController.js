const { Donor, EhrDonor, User } = require("../models");
const { v4: uuidv4 } = require("uuid");
const DemoDataGeneratorService = require("../services/DemoDataGeneratorService");
const NotificationController = require("./NotificationController");

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

      // Debug log
      console.log("Registration request body:", req.body);
      console.log("User ID:", userId);

      // Validate required fields
      if (!fullName || !dob || !idPassport || !phone || !email) {
        console.log("Missing fields:", {
          fullName: !!fullName,
          dob: !!dob,
          idPassport: !!idPassport,
          phone: !!phone,
          email: !!email,
        });
        return res.status(400).json({
          message: "Missing required fields",
          required: ["fullName", "dob", "idPassport", "phone", "email"],
        });
      }

      // Check if donor already exists
      const existingDonor = await Donor.findByPk(userId);
      console.log("Existing donor:", existingDonor?.toJSON());

      if (existingDonor && existingDonor.donor_status !== "in_progress") {
        console.log(
          "Donor already registered with status:",
          existingDonor.donor_status
        );
        return res.status(400).json({
          message: "Registration already completed",
        });
      }

      // Update User table with basic info
      try {
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
      } catch (updateError) {
        if (updateError.name === "SequelizeUniqueConstraintError") {
          return res.status(400).json({
            message: "National ID already registered",
            field: "idPassport",
            error: "DUPLICATE_NATIONAL_ID",
          });
        }
        throw updateError;
      }

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
        donor_id: userId,
        national_id: idPassport,
        full_name: fullName,
        date_of_birth: dob,
        phone: phone,
        email: email,
        address: address,
        province: province,
        district: district,
        ward: ward,
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
      await EhrDonor.upsert(mockEhrData);

      console.log(
        `✅ EHR data synced for donor ${userId}: is_clear=${mockEhrData.is_clear}`
      );

      // Auto-generate demo data (visit schedules and donation records)
      // This simulates a donor with existing history for demo/testing purposes
      if (DemoDataGeneratorService.isDemoModeEnabled()) {
        try {
          await DemoDataGeneratorService.generateForNewDonor(
            userId,
            new Date()
          );
          console.log(
            `🎭 [DEMO MODE] Generated simulation data for donor ${userId}`
          );
        } catch (demoError) {
          console.error("Error generating demo data:", demoError);
          // Don't fail registration if demo data generation fails
        }
      }

      // Create notification for staff about new donor registration
      try {
        await NotificationController.createNotification({
          type: "new_donor_registration",
          title: "New Donor Registration",
          message: `New donor ${fullName} has completed registration. EHR status: ${
            mockEhrData.is_clear ? "Clear" : "Pending Review"
          }`,
          priority: "high",
          related_donor_id: userId,
          related_entity_type: "donor",
          related_entity_id: userId,
          metadata: {
            donor_name: fullName,
            donor_email: email,
            donor_phone: phone,
            registration_date: new Date().toISOString(),
            ehr_clear: mockEhrData.is_clear,
            all_tests_negative: true,
          },
        });
        console.log(`🔔 Notification created for new donor: ${fullName}`);
      } catch (notifError) {
        console.error("Error creating notification:", notifError);
        // Don't fail registration if notification creation fails
      }

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
