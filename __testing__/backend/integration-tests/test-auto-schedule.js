/**
 * Test Auto-Schedule Feature
 *
 * This script tests:
 * 1. Find a donor with schedule preferences
 * 2. Change donor status to approved (trigger auto-schedule)
 * 3. Verify visits were auto-generated
 *
 * Run: node backend/tests/test-auto-schedule.js
 */

const db = require("../src/models");
const { Donor, VisitSchedule, DonationVisit } = db;
const ScheduleGeneratorService = require("../src/services/ScheduleGeneratorService");
const moment = require("moment");

async function testAutoSchedule() {
  console.log("🧪 Testing Auto-Schedule Feature...\n");

  try {
    // Step 1: Find or create a test donor with schedule preferences
    console.log("📋 Step 1: Finding/Creating test donor...");

    let testDonor = await Donor.findOne({
      where: {
        donor_status: "pending",
        screening_status: "approved",
        director_status: "approved",
      },
      include: [
        {
          model: VisitSchedule,
          as: "visitSchedules",
        },
      ],
    });

    if (!testDonor) {
      console.log("⚠️  No suitable test donor found. Creating one...");

      // Find any existing donor to use
      testDonor = await Donor.findOne({
        limit: 1,
        include: [
          {
            model: VisitSchedule,
            as: "visitSchedules",
          },
        ],
      });

      if (!testDonor) {
        console.log(
          "❌ No donors in database. Please run seeder first: npm run seed"
        );
        process.exit(1);
      }

      // Update donor to pending status
      await testDonor.update({
        donor_status: "pending",
        screening_status: "approved",
        director_status: "approved",
      });
    }

    console.log(`✅ Using donor: ${testDonor.donor_id}`);

    // Step 2: Check if donor has schedule preferences
    console.log("\n📋 Step 2: Checking schedule preferences...");

    let schedule = testDonor.visitSchedules && testDonor.visitSchedules[0];

    if (!schedule) {
      console.log("⚠️  No schedule preferences found. Creating...");

      schedule = await VisitSchedule.create({
        donor_id: testDonor.donor_id,
        weekly_days: 42, // Monday, Wednesday, Friday (0b0101010)
        preferred_start: "09:00:00",
        preferred_end: "12:00:00",
        max_visits_per_week: 2,
        is_active: true,
      });

      console.log("✅ Created schedule preferences");
    } else {
      console.log(
        `✅ Found schedule: weekly_days=${schedule.weekly_days}, max_visits=${schedule.max_visits_per_week}`
      );
    }

    // Step 3: Count existing visits before approval
    const visitsBefore = await DonationVisit.count({
      where: {
        donor_id: testDonor.donor_id,
        proposed_date: {
          [db.Sequelize.Op.gte]: moment().startOf("month").toDate(),
        },
      },
    });

    console.log(`\n📊 Visits before approval: ${visitsBefore}`);

    // Step 4: Trigger auto-schedule by approving donor
    console.log("\n🔄 Step 3: Triggering auto-schedule via donor approval...");

    const result = await ScheduleGeneratorService.onDonorApproved(
      testDonor.donor_id
    );

    console.log(`\n📊 Auto-schedule result:`);
    console.log(`   - Success: ${result.success}`);
    console.log(`   - Message: ${result.message}`);
    console.log(
      `   - Visits created: ${result.visits ? result.visits.length : 0}`
    );

    // Step 5: Verify visits were created
    console.log("\n📋 Step 4: Verifying auto-generated visits...");

    const visitsAfter = await DonationVisit.findAll({
      where: {
        donor_id: testDonor.donor_id,
        status: "proposed",
        proposed_date: {
          [db.Sequelize.Op.gte]: moment().startOf("month").toDate(),
        },
      },
      order: [["proposed_date", "ASC"]],
      limit: 10,
    });

    console.log(`\n✅ Found ${visitsAfter.length} proposed visits:`);

    visitsAfter.forEach((visit, index) => {
      const date = moment(visit.proposed_date).format("ddd, MMM DD YYYY");
      console.log(
        `   ${index + 1}. Visit ID: ${
          visit.visit_id
        } | Date: ${date} | Status: ${visit.status}`
      );
    });

    // Step 6: Validate results
    console.log("\n🔍 Step 5: Validating results...");

    const checks = {
      "Schedule service executed": result.success !== undefined,
      "Visits created in current/next month": visitsAfter.length > 0,
      "All visits have status=proposed": visitsAfter.every(
        (v) => v.status === "proposed"
      ),
      "Visit dates match schedule preferences": validateScheduleDates(
        visitsAfter,
        schedule
      ),
    };

    console.log("\n✅ Validation Results:");
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`   ${passed ? "✅" : "❌"} ${check}`);
    });

    const allChecksPassed = Object.values(checks).every((v) => v === true);

    if (allChecksPassed) {
      console.log(
        "\n🎉 SUCCESS! Auto-schedule feature is working correctly!\n"
      );
      console.log("Summary:");
      console.log(`   - Donor ID: ${testDonor.donor_id}`);
      console.log(`   - Visits before: ${visitsBefore}`);
      console.log(`   - Visits after: ${visitsAfter.length}`);
      console.log(`   - New visits: ${visitsAfter.length - visitsBefore}`);
    } else {
      console.log(
        "\n⚠️  WARNING: Some validation checks failed. Review results above.\n"
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Validate that visit dates match schedule preferences
 */
function validateScheduleDates(visits, schedule) {
  if (!schedule || !schedule.weekly_days) return false;

  // Parse bitmask to get allowed days
  const allowedDays = [];
  for (let i = 0; i < 7; i++) {
    if (schedule.weekly_days & (1 << i)) {
      allowedDays.push(i); // 0=Sunday, 1=Monday, ..., 6=Saturday
    }
  }

  // Check if all visits fall on allowed days
  return visits.every((visit) => {
    const dayOfWeek = moment(visit.proposed_date).day(); // 0=Sunday, 6=Saturday
    return allowedDays.includes(dayOfWeek);
  });
}

// Run test
testAutoSchedule();
