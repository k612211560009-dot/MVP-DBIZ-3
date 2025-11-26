/**
 * Utility functions for safely accessing mock data
 * Provides fallback empty arrays to prevent undefined errors
 */

import {
  mockDonors,
  mockAppointments,
  mockDonations,
  mockAlerts,
  mockEHRTests,
  mockPayments,
  screeningQuestions as mockScreeningQuestions,
  type Donor,
  type Appointment,
  type Donation,
  type Alert,
  type EHRTest,
  type Payment,
} from "./mock-data";

/**
 * Safely get donors array with fallback
 */
export const getSafeDonors = (): Donor[] => {
  return mockDonors || [];
};

/**
 * Safely get appointments array with fallback
 */
export const getSafeAppointments = (): Appointment[] => {
  return mockAppointments || [];
};

/**
 * Safely get donations array with fallback
 */
export const getSafeDonations = (): Donation[] => {
  return mockDonations || [];
};

/**
 * Safely get alerts array with fallback
 */
export const getSafeAlerts = (): Alert[] => {
  return mockAlerts || [];
};

/**
 * Safely get EHR tests array with fallback
 */
export const getSafeEHRTests = (): EHRTest[] => {
  return mockEHRTests || [];
};

/**
 * Safely get payments array with fallback
 */
export const getSafePayments = (): Payment[] => {
  return mockPayments || [];
};

/**
 * Safely get screening questions array with fallback
 */
export const screeningQuestions = mockScreeningQuestions || [];

/**
 * Generic safe getter for any array
 * @param data - The data to safely access
 * @param fallback - Optional custom fallback (default: empty array)
 */
export const safeArray = <T>(
  data: T[] | undefined | null,
  fallback: T[] = []
): T[] => {
  return data || fallback;
};

/**
 * Safely filter donors by status
 */
export const getDonorsByStatus = (status: Donor["status"]): Donor[] => {
  return getSafeDonors().filter((donor) => donor.status === status);
};

/**
 * Safely filter appointments by date
 */
export const getAppointmentsByDate = (date: string): Appointment[] => {
  return getSafeAppointments().filter((apt) => apt.date === date);
};

/**
 * Safely filter donations by date range
 */
export const getDonationsByDateRange = (
  startDate: Date,
  endDate?: Date
): Donation[] => {
  return getSafeDonations().filter((donation) => {
    const donationDate = new Date(donation.date);
    if (endDate) {
      return donationDate >= startDate && donationDate <= endDate;
    }
    return donationDate >= startDate;
  });
};

/**
 * Safely get active alerts
 */
export const getActiveAlerts = (): Alert[] => {
  return getSafeAlerts().filter((alert) => alert.status === "active");
};

/**
 * Calculate total donation volume with safe fallback
 */
export const getTotalDonationVolume = (donations: Donation[]): number => {
  return safeArray(donations).reduce((sum, d) => sum + (d.volume || 0), 0);
};
