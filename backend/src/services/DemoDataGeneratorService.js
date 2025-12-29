const { DonationVisit, VisitSchedule, Donor, MilkBank } = require("../models");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

/**
 * Demo Data Generator Service
 * Auto-generates realistic visit schedules for demo/testing
 *
 * CORRECT FLOW:
 * 1. Donor registers → System auto-creates visit_schedule (status = "scheduled")
 * 2. Staff reviews → Confirms/Rejects visit (status = "confirmed" or "cancelled")
 * 3. Donor donates → Visit completed with volume/points (status = "completed")
 * 4. Donation record created with date = visit's actual date
 *
 * For DEMO purposes, we create:
 * - 1-2 visits already confirmed & completed (simulate staff confirmed + donor donated)
 * - 3-4 future scheduled visits (waiting for staff confirmation)
 */
class DemoDataGeneratorService {
  /**
   * Generate demo data for newly registered donor
   * Creates:
   * - 1-2 confirmed & completed visits (simulate: scheduled → staff confirmed → donor donated)
   * - 3-4 future scheduled visits (waiting for staff confirmation)
   * - Donation records ONLY for completed visits
   *
   * @param {string} donorId - Donor UUID
   * @param {Date} registrationDate - Date when donor registered
   * @returns {Promise<Object>} Generated data summary
   */
  async generateForNewDonor(donorId, registrationDate = new Date()) {
    try {
      console.log(
        `🎭 [DEMO MODE] Generating simulation data for donor ${donorId}...`
      );

      // Get donor and default milk bank
      const donor = await Donor.findByPk(donorId);
      if (!donor) {
        throw new Error(`Donor ${donorId} not found`);
      }

      // Get default bank (first active bank)
      const defaultBank = await MilkBank.findOne({
        where: { is_active: true },
      });

      if (!defaultBank) {
        console.warn(
          "No active milk bank found, skipping demo data generation"
        );
        return { success: false, message: "No active milk bank" };
      }

      const bankId = defaultBank.bank_id;
      const regDate = moment(registrationDate);

      // Generate 1-2 visits that went through full flow:
      // scheduled → staff confirmed → donor donated → completed
      const completedVisits = await this.generateConfirmedAndCompletedVisits(
        donorId,
        bankId,
        regDate
      );

      // Generate 3-4 future scheduled visits (waiting for staff confirmation)
      const scheduledVisits = await this.generateFutureScheduledVisits(
        donorId,
        bankId,
        regDate
      );

      // Update donor points total
      const totalPoints = completedVisits.reduce(
        (sum, v) => sum + (v.points_awarded || 0),
        0
      );
      await donor.update({ points_total: totalPoints });

      console.log(`✅ [DEMO MODE] Generated simulation data:`);
      console.log(
        `   - ${completedVisits.length} confirmed & completed visits`
      );
      console.log(
        `   - ${scheduledVisits.length} future scheduled visits (waiting staff confirmation)`
      );
      console.log(`   - Total points awarded: ${totalPoints}`);

      return {
        success: true,
        data: {
          completedVisits: completedVisits.length,
          scheduledVisits: scheduledVisits.length,
          totalPoints,
        },
      };
    } catch (error) {
      console.error("Error generating demo data:", error);
      throw error;
    }
  }

  /**
   * Generate 1-2 visits that completed the full flow:
   * Step 1: System created visit_schedule (scheduled_start date)
   * Step 2: Staff confirmed the visit
   * Step 3: Donor came and donated (actual_start/end, volume, points recorded)
   * Step 4: Visit marked as completed
   *
   * These visits will have donation records created
   * Dates are realistic: 2-4 weeks before registration
   */
  async generateConfirmedAndCompletedVisits(donorId, bankId, registrationDate) {
    const visits = [];
    const count = 1 + Math.floor(Math.random() * 2); // 1-2 visits

    for (let i = 0; i < count; i++) {
      // Original scheduled date: 2-4 weeks ago
      const weeksAgo = count - i + 1;
      const scheduledDate = registrationDate
        .clone()
        .subtract(weeksAgo, "weeks")
        .startOf("day")
        .hour(9 + Math.floor(Math.random() * 6)) // Random hour 9-14
        .minute(0)
        .second(0);

      const scheduledStart = scheduledDate.toDate();
      const scheduledEnd = scheduledDate.clone().add(1, "hour").toDate();

      // Actual donation happened (donor came on scheduled date)
      const actualStart = moment(scheduledStart).add(5, "minutes").toDate(); // 5 min late
      const actualEnd = moment(actualStart).add(45, "minutes").toDate(); // 45 min duration

      // Random volume: 200-600ml (recorded when donor actually donated)
      const volume = 200 + Math.floor(Math.random() * 401);
      const containerCount = Math.ceil(volume / 100);

      // Calculate points based on volume
      let points = 0;
      if (volume >= 500) points = 15;
      else if (volume >= 300) points = 10;
      else if (volume >= 100) points = 5;

      const visitId = uuidv4();

      // Create completed visit (went through: scheduled → confirmed → completed)
      const visit = await DonationVisit.create({
        visit_id: visitId,
        donor_id: donorId,
        bank_id: bankId,
        scheduled_start: scheduledStart, // Original scheduled time
        scheduled_end: scheduledEnd,
        actual_start: actualStart, // When donor actually came
        actual_end: actualEnd, // When donation finished
        status: "completed", // Final status after donation
        health_status: "good",
        health_notes: "Donor in good health condition",
        milk_volume_ml: volume, // Recorded during donation
        container_count: containerCount,
        points_awarded: points, // Calculated based on volume
        origin: "system", // Auto-generated by system
        recorded_by: null, // Staff would normally record this
        quality_notes: "Quality check passed - suitable for storage",
      });

      // Create visit schedule entry (represents the original scheduling)
      await VisitSchedule.create({
        visit_id: visitId,
        plan_month: scheduledDate.format("YYYY-MM"),
        plan_type: "ad_hoc",
        day_of_month: null,
        week_of_month: null,
        weekday: scheduledDate.isoWeekday(),
        window_start: "09:00:00",
        window_end: "15:00:00",
        proposed_on: moment(scheduledStart).subtract(1, "week").toDate(), // Proposed 1 week before
        proposed_by: null, // System-generated
        reschedule_count: 0,
        rule_snapshot: JSON.stringify({
          type: "demo_confirmed_completed",
          note: "Demo data - went through: scheduled → staff confirmed → donor donated → completed",
        }),
      });

      visits.push(visit);
    }

    return visits;
  }

  /**
   * Generate 3-4 future scheduled visits (waiting for staff confirmation)
   * Status = "scheduled" means:
   * - System created the visit schedule
   * - Waiting for staff to confirm/reject
   * - No volume, points, or actual times yet
   *
   * Dates: 1-4 weeks in the future
   */
  async generateFutureScheduledVisits(donorId, bankId, registrationDate) {
    const visits = [];
    const count = 3 + Math.floor(Math.random() * 2); // 3-4 visits

    for (let i = 0; i < count; i++) {
      // Schedule visits 1-4 weeks in the future
      const weeksAhead = i + 1;
      const visitDate = registrationDate
        .clone()
        .add(weeksAhead, "weeks")
        .startOf("isoWeek") // Monday
        .add(Math.floor(Math.random() * 5), "days") // Mon-Fri
        .hour(9 + Math.floor(Math.random() * 6)) // 9-14
        .minute(0)
        .second(0);

      const scheduledStart = visitDate.toDate();
      const scheduledEnd = visitDate.clone().add(1, "hour").toDate();

      const visitId = uuidv4();

      // Create scheduled visit (waiting for staff confirmation)
      const visit = await DonationVisit.create({
        visit_id: visitId,
        donor_id: donorId,
        bank_id: bankId,
        scheduled_start: scheduledStart, // Proposed date/time
        scheduled_end: scheduledEnd,
        actual_start: null, // Not donated yet
        actual_end: null, // Not donated yet
        status: "scheduled", // Waiting for staff confirmation
        health_status: null, // Will be checked when donor arrives
        health_notes: null,
        milk_volume_ml: null, // Will be recorded after donation
        container_count: null,
        points_awarded: 0, // Will be calculated after donation
        origin: "system", // Auto-generated
        recorded_by: null,
        quality_notes: null,
      });

      // Create visit schedule entry
      await VisitSchedule.create({
        visit_id: visitId,
        plan_month: visitDate.format("YYYY-MM"),
        plan_type: "monthly_nth_weekday",
        day_of_month: null,
        week_of_month: Math.ceil(visitDate.date() / 7),
        weekday: visitDate.isoWeekday(),
        window_start: visitDate.format("HH:mm:ss"),
        window_end: visitDate.clone().add(1, "hour").format("HH:mm:ss"),
        proposed_on: registrationDate.toDate(), // When it was created
        proposed_by: null, // System-generated
        reschedule_count: 0,
        rule_snapshot: JSON.stringify({
          type: "demo_scheduled",
          note: "Demo data - waiting for staff confirmation",
        }),
      });

      visits.push(visit);
    }

    return visits;
  }

  /**
   * Generate donation records from completed visits ONLY
   * Donation record is created AFTER visit is completed
   * Uses the actual donation date (actual_end) from the visit
   *
  /**
   * Check if demo mode is enabled
   * Can be controlled via environment variable
   */
  isDemoModeEnabled() {
    return (
      process.env.DEMO_MODE === "true" || process.env.NODE_ENV === "development"
    );
  }
}

module.exports = new DemoDataGeneratorService();
