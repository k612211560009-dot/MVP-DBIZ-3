const crypto = require("crypto");

/**
 * Service for generating video meeting links for appointments
 * This service generates Google Meet-style links for screening interviews
 */
class MeetingLinkService {
  /**
   * Generate a unique meeting link for a screening appointment
   * @param {Object} params - Parameters for meeting link generation
   * @param {string} params.appointmentId - Appointment UUID
   * @param {string} params.donorEmail - Donor email
   * @param {Date} params.appointmentDate - Scheduled appointment date
   * @returns {string} Generated meeting link
   */
  static generateMeetLink({ appointmentId, donorEmail, appointmentDate }) {
    // Generate a unique code based on appointment details
    const uniqueString = `${appointmentId}-${donorEmail}-${appointmentDate.getTime()}`;
    const hash = crypto.createHash("sha256").update(uniqueString).digest("hex");

    // Take first 12 characters and format as xxx-xxxx-xxx (Google Meet style)
    const code = hash.substring(0, 12);
    const formattedCode = `${code.substring(0, 3)}-${code.substring(
      3,
      7
    )}-${code.substring(7, 10)}`;

    // Return Google Meet-style URL
    // In production, this would integrate with Google Calendar API
    // For now, we generate a valid-looking link structure
    return `https://meet.google.com/${formattedCode}`;
  }

  /**
   * Validate if a meeting link is in correct format
   * @param {string} link - Meeting link to validate
   * @returns {boolean} True if valid format
   */
  static isValidMeetLink(link) {
    if (!link) return false;

    // Check if it matches Google Meet URL pattern
    const meetPattern =
      /^https:\/\/meet\.google\.com\/[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{3}$/;
    return meetPattern.test(link);
  }

  /**
   * Extract meeting code from full URL
   * @param {string} link - Full meeting link
   * @returns {string|null} Meeting code or null if invalid
   */
  static extractMeetingCode(link) {
    if (!this.isValidMeetLink(link)) return null;

    const parts = link.split("/");
    return parts[parts.length - 1];
  }
}

module.exports = MeetingLinkService;
