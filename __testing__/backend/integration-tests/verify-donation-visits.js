/**
 * Test script to verify donation visit seeder data
 * Run: node backend/tests/verify-donation-visits.js
 */

const { sequelize } = require("../src/models");

async function verifyDonationVisits() {
  try {
    console.log("🔍 Verifying donation visit seeder data...\n");

    // 1. Check donors with schedule preferences
    console.log("1️⃣ Checking Donor Schedule Preferences:");
    const donors = await sequelize.models.Donor.findAll({
      include: [
        {
          model: sequelize.models.User,
          as: "user",
          attributes: ["name", "email"],
        },
      ],
    });

    for (const donor of donors) {
      console.log(`\n   Donor: ${donor.user.name} (${donor.user.email})`);
      console.log(`   - Status: ${donor.donor_status}`);
      console.log(`   - Weekly Days: ${donor.weekly_days || "Not set"}`);
      console.log(
        `   - Preferred Time: ${donor.preferred_start || "N/A"} - ${
          donor.preferred_end || "N/A"
        }`
      );
      console.log(
        `   - Max Visits/Week: ${donor.max_visits_per_week || "N/A"}`
      );
      console.log(`   - Total Points: ${donor.points_total}`);
    }

    // 2. Check donation visits
    console.log("\n\n2️⃣ Checking Donation Visits:");
    const visits = await sequelize.models.DonationVisit.findAll({
      include: [
        {
          model: sequelize.models.Donor,
          as: "donor",
          include: [
            {
              model: sequelize.models.User,
              as: "user",
              attributes: ["name"],
            },
          ],
        },
        {
          model: sequelize.models.User,
          as: "recorder",
          attributes: ["name"],
        },
      ],
      order: [["scheduled_start", "ASC"]],
    });

    console.log(`   Total visits: ${visits.length}\n`);

    const statusCounts = {
      completed: 0,
      cancelled: 0,
      scheduled: 0,
      proposed: 0,
    };

    for (const visit of visits) {
      const date = new Date(visit.scheduled_start).toISOString().split("T")[0];
      const time = new Date(visit.scheduled_start)
        .toTimeString()
        .split(" ")[0]
        .slice(0, 5);

      console.log(`   📅 ${date} ${time}`);
      console.log(`      Status: ${visit.status}`);
      console.log(`      Origin: ${visit.origin}`);
      console.log(`      Health: ${visit.health_status || "Not checked"}`);
      console.log(
        `      Volume: ${visit.volume_ml || 0}ml (${
          visit.container_count || 0
        } containers)`
      );
      console.log(`      Points: ${visit.points_awarded}`);
      console.log(`      Recorded by: ${visit.recorder?.name || "Not yet"}\n`);

      statusCounts[visit.status]++;
    }

    // 3. Check visit schedules
    console.log("3️⃣ Checking Visit Schedules:");
    const schedules = await sequelize.models.VisitSchedule.findAll();

    console.log(`   Total schedules: ${schedules.length}\n`);

    for (const schedule of schedules) {
      console.log(`   Schedule for visit ${schedule.visit_id.slice(0, 8)}...`);
      console.log(`   - Month: ${schedule.plan_month}`);
      console.log(`   - Type: ${schedule.plan_type}`);
      console.log(
        `   - Week of Month: ${schedule.week_of_month}, Weekday: ${schedule.weekday}`
      );
      console.log(
        `   - Time Window: ${schedule.window_start} - ${schedule.window_end}`
      );
      console.log(`   - Reschedule Count: ${schedule.reschedule_count}\n`);
    }

    // 4. Summary statistics
    console.log("📊 Summary Statistics:");
    console.log(`   ✅ Completed donations: ${statusCounts.completed}`);
    console.log(`   ❌ Cancelled visits: ${statusCounts.cancelled}`);
    console.log(`   📅 Scheduled visits: ${statusCounts.scheduled}`);
    console.log(`   ⏳ Proposed visits: ${statusCounts.proposed}`);

    const completedVisits = visits.filter((v) => v.status === "completed");
    const totalVolume = completedVisits.reduce(
      (sum, v) => sum + (v.volume_ml || 0),
      0
    );
    const totalPoints = completedVisits.reduce(
      (sum, v) => sum + (v.points_awarded || 0),
      0
    );

    console.log(`\n   📊 Total Volume Donated: ${totalVolume}ml`);
    console.log(`   💎 Total Points Awarded: ${totalPoints}`);
    console.log(
      `   📈 Average Volume per Donation: ${Math.round(
        totalVolume / completedVisits.length
      )}ml`
    );

    // 5. Verify data integrity
    console.log("\n\n5️⃣ Data Integrity Checks:");
    let issues = 0;

    // Check if completed visits have volume
    const completedWithoutVolume = completedVisits.filter((v) => !v.volume_ml);
    if (completedWithoutVolume.length > 0) {
      console.log(
        `   ⚠️  Found ${completedWithoutVolume.length} completed visits without volume`
      );
      issues++;
    } else {
      console.log("   ✅ All completed visits have volume recorded");
    }

    // Check if completed visits have points
    const completedWithoutPoints = completedVisits.filter(
      (v) => !v.points_awarded
    );
    if (completedWithoutPoints.length > 0) {
      console.log(
        `   ⚠️  Found ${completedWithoutPoints.length} completed visits without points`
      );
      issues++;
    } else {
      console.log("   ✅ All completed visits have points awarded");
    }

    // Check if cancelled visits have zero volume
    const cancelledVisits = visits.filter((v) => v.status === "cancelled");
    const cancelledWithVolume = cancelledVisits.filter((v) => v.volume_ml > 0);
    if (cancelledWithVolume.length > 0) {
      console.log(
        `   ⚠️  Found ${cancelledWithVolume.length} cancelled visits with volume (should be 0)`
      );
      issues++;
    } else {
      console.log("   ✅ All cancelled visits have zero volume");
    }

    // Check if future visits don't have health status
    const futureVisits = visits.filter((v) =>
      ["scheduled", "proposed"].includes(v.status)
    );
    const futureWithHealth = futureVisits.filter((v) => v.health_status);
    if (futureWithHealth.length > 0) {
      console.log(
        `   ⚠️  Found ${futureWithHealth.length} future visits with health status (should be null)`
      );
      issues++;
    } else {
      console.log("   ✅ All future visits have no health status (correct)");
    }

    // Check if donor points match sum of visit points
    for (const donor of donors) {
      const donorVisits = visits.filter(
        (v) => v.donor_id === donor.donor_id && v.status === "completed"
      );
      const calculatedPoints = donorVisits.reduce(
        (sum, v) => sum + v.points_awarded,
        0
      );

      if (calculatedPoints !== donor.points_total) {
        console.log(
          `   ⚠️  Donor ${donor.user.name}: Points mismatch (DB: ${donor.points_total}, Calculated: ${calculatedPoints})`
        );
        issues++;
      } else {
        console.log(
          `   ✅ Donor ${donor.user.name}: Points correctly calculated (${donor.points_total})`
        );
      }
    }

    // Final result
    console.log("\n\n" + "=".repeat(60));
    if (issues === 0) {
      console.log("✅ All integrity checks passed!");
      console.log("🎉 Donation visit seeder data is valid and consistent!");
    } else {
      console.log(`⚠️  Found ${issues} integrity issues`);
      console.log("Please review the warnings above");
    }
    console.log("=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error verifying donation visits:", error);
    process.exit(1);
  }
}

// Run verification
verifyDonationVisits();
