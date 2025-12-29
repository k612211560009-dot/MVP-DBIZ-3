const { DonationVisit, VisitSchedule, Donor, MilkBank } = require("../models");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

/**
 * Schedule Generator Service
 * Auto-generates donation visit schedules for approved donors
 * Based on donor preferences (weekly_days, preferred_start/end, max_visits_per_week)
 */
class ScheduleGeneratorService {
  /**
   * Generate donation visits for next month based on donor preferences
   * @param {string} donorId - Donor UUID
   * @param {Object} options - Optional overrides
   * @returns {Promise<Array>} Created visits
   */
  async generateMonthlySchedule(donorId, options = {}) {
    try {
      // Get donor with preferences
      const donor = await Donor.findByPk(donorId);

      if (!donor) {
        throw new Error(`Donor ${donorId} not found`);
      }

      if (
        !donor.weekly_days ||
        !donor.preferred_start ||
        !donor.preferred_end
      ) {
        throw new Error(`Donor ${donorId} has not set schedule preferences`);
      }

      // Parse preferences
      const preferredDays = this.parseBitmask(donor.weekly_days); // e.g., [2, 4, 6] for Tue, Thu, Sat
      const maxPerWeek = donor.max_visits_per_week || 2;
      const bankId = donor.home_bank_id;

      // Generate for next month
      const nextMonth =
        options.month || moment().add(1, "month").format("YYYY-MM");
      const startOfMonth = moment(nextMonth, "YYYY-MM").startOf("month");
      const endOfMonth = moment(nextMonth, "YYYY-MM").endOf("month");

      console.log(
        `📅 Generating schedule for donor ${donorId} for ${nextMonth}`
      );
      console.log(`   Preferred days: ${preferredDays.join(", ")} (weekdays)`);
      console.log(`   Max visits/week: ${maxPerWeek}`);

      // Generate visits
      const visits = [];
      let currentDate = startOfMonth.clone();
      let visitsThisWeek = 0;
      let currentWeek = currentDate.week();

      while (currentDate.isSameOrBefore(endOfMonth)) {
        const weekday = currentDate.isoWeekday(); // 1=Mon, 7=Sun

        // Check if new week
        if (currentDate.week() !== currentWeek) {
          currentWeek = currentDate.week();
          visitsThisWeek = 0;
        }

        // Check if this day matches donor preferences
        if (preferredDays.includes(weekday) && visitsThisWeek < maxPerWeek) {
          const visit = await this.createProposedVisit(donor, currentDate);
          visits.push(visit);
          visitsThisWeek++;
        }

        currentDate.add(1, "day");
      }

      console.log(`   ✅ Generated ${visits.length} visits for ${nextMonth}`);
      return visits;
    } catch (error) {
      console.error("Error generating monthly schedule:", error);
      throw error;
    }
  }

  /**
   * Create a single proposed visit
   * @param {Object} donor - Donor model instance
   * @param {moment} date - Visit date
   * @returns {Promise<Object>} Created visit
   */
  async createProposedVisit(donor, date) {
    const visitId = uuidv4();

    // Random time within preferred window
    const startHour = this.parseTime(donor.preferred_start).hour;
    const endHour = this.parseTime(donor.preferred_end).hour;
    const randomHour =
      Math.floor(Math.random() * (endHour - startHour)) + startHour;

    const scheduledStart = date.clone().hour(randomHour).minute(0).second(0);
    const scheduledEnd = scheduledStart.clone().add(1, "hour");

    // Create donation visit
    const visit = await DonationVisit.create({
      visit_id: visitId,
      donor_id: donor.donor_id,
      bank_id: donor.home_bank_id,
      scheduled_start: scheduledStart.toDate(),
      scheduled_end: scheduledEnd.toDate(),
      origin: "system", // Auto-generated
      status: "proposed", // Needs staff confirmation
      health_status: null,
      volume_ml: null,
      container_count: null,
      points_awarded: 0,
      recorded_by: null,
    });

    // Create visit schedule (recurring schedule info)
    const weekOfMonth = Math.ceil(date.date() / 7);
    const weekday = date.isoWeekday();

    await VisitSchedule.create({
      visit_id: visitId,
      plan_month: date.format("YYYY-MM"),
      plan_type: "monthly_nth_weekday", // e.g., "2nd Tuesday"
      day_of_month: null,
      week_of_month: weekOfMonth,
      weekday: weekday,
      window_start: donor.preferred_start,
      window_end: donor.preferred_end,
      proposed_on: new Date(),
      proposed_by: null, // System-generated
      reschedule_count: 0,
      rule_snapshot: JSON.stringify({
        weekly_days: donor.weekly_days,
        preferred_start: donor.preferred_start,
        preferred_end: donor.preferred_end,
        max_visits_per_week: donor.max_visits_per_week,
      }),
    });

    return visit;
  }

  /**
   * Auto-generate schedule when donor is approved
   * Called after screening_status and director_status both become 'approved'
   * @param {string} donorId - Donor UUID
   */
  async onDonorApproved(donorId) {
    try {
      console.log(
        `🎉 Donor ${donorId} approved! Generating initial schedule...`
      );

      const donor = await Donor.findByPk(donorId);

      // Check if donor has set preferences
      if (
        !donor.weekly_days ||
        !donor.preferred_start ||
        !donor.preferred_end
      ) {
        console.log(
          `⚠️  Donor ${donorId} has not set schedule preferences yet`
        );
        return {
          success: false,
          message: "Please set your schedule preferences first",
        };
      }

      // Update donor status to active
      await donor.update({ donor_status: "active" });

      // Generate schedule for next month
      const visits = await this.generateMonthlySchedule(donorId);

      return {
        success: true,
        message: `Generated ${visits.length} visits for next month`,
        visits,
      };
    } catch (error) {
      console.error("Error in onDonorApproved:", error);
      throw error;
    }
  }

  /**
   * Parse bitmask to array of weekdays
   * @param {number} bitmask - e.g., 42 = 101010 binary
   * @returns {Array<number>} e.g., [2, 4, 6] for Tue, Thu, Sat
   */
  parseBitmask(bitmask) {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      if (bitmask & Math.pow(2, i - 1)) {
        days.push(i);
      }
    }
    return days;
  }

  /**
   * Parse time string to object
   * @param {string} timeStr - e.g., "09:00:00"
   * @returns {Object} { hour, minute }
   */
  parseTime(timeStr) {
    const parts = timeStr.split(":");
    return {
      hour: parseInt(parts[0]),
      minute: parseInt(parts[1]),
    };
  }

  /**
   * Check if visits need to be generated (e.g., monthly cron job)
   * @param {string} donorId - Donor UUID
   * @returns {Promise<boolean>} True if needs generation
   */
  async needsScheduleGeneration(donorId) {
    const nextMonth = moment().add(1, "month").format("YYYY-MM");

    const existingVisits = await DonationVisit.count({
      where: {
        donor_id: donorId,
        scheduled_start: {
          [require("sequelize").Op.gte]: moment(nextMonth, "YYYY-MM")
            .startOf("month")
            .toDate(),
          [require("sequelize").Op.lte]: moment(nextMonth, "YYYY-MM")
            .endOf("month")
            .toDate(),
        },
      },
    });

    return existingVisits === 0;
  }
}

module.exports = new ScheduleGeneratorService();
