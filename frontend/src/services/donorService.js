import axios from "axios";
import { authService } from "./authService";

// Use relative path for proxy to work with ngrok
const API_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Donor Service - Handle donor profile and registration
 */
class DonorService {
  /**
   * Get current donor profile
   */
  async getProfile() {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/donors/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  /**
   * Check if user has completed donor registration
   */
  async hasProfile() {
    try {
      const profile = await this.getProfile();
      return !!profile && !!profile.donor_id;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get donor status
   */
  async getStatus() {
    try {
      const profile = await this.getProfile();
      return {
        hasProfile: !!profile,
        donor_status: profile?.donor_status,
        screening_status: profile?.screening_status,
        director_status: profile?.director_status,
        isApproved: profile?.donor_status === "approved",
        isPending: profile?.donor_status === "pending",
        isRejected: profile?.donor_status === "rejected",
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          hasProfile: false,
          donor_status: null,
          screening_status: null,
          director_status: null,
          isApproved: false,
          isPending: false,
          isRejected: false,
        };
      }
      throw error;
    }
  }

  /**
   * Submit donor registration
   */
  async register(formData) {
    try {
      const token = authService.getToken();
      const response = await axios.post(
        `${API_URL}/donors/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Update donor preferences (schedule preferences)
   */
  async updatePreferences(preferences) {
    try {
      const token = authService.getToken();
      const response = await axios.put(
        `${API_URL}/donors/preferences`,
        preferences,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update preferences error:", error);
      throw error;
    }
  }

  /**
   * Get donation visits for current donor
   */
  async getVisits(params = {}) {
    try {
      const token = authService.getToken();
      const profile = await this.getProfile();
      const donorId = profile?.donor_id;

      if (!donorId) {
        return {
          visits: [],
          statistics: { totalVolume: 0, totalVisits: 0 },
          pagination: {},
        };
      }

      const response = await axios.get(
        `${API_URL}/donation-visits/donor/${donorId}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      // Return the full data object which includes visits, statistics, and pagination
      return response.data.data;
    } catch (error) {
      console.error("Get visits error:", error);
      return {
        visits: [],
        statistics: { totalVolume: 0, totalVisits: 0 },
        pagination: {},
      };
    }
  }

  /**
   * Get upcoming visits
   */
  async getUpcomingVisits() {
    try {
      const token = authService.getToken();
      const profile = await this.getProfile();
      const donorId = profile?.donor_id;

      if (!donorId) {
        return [];
      }

      const response = await axios.get(
        `${API_URL}/donation-visits/donor/${donorId}/upcoming`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data.visits || [];
    } catch (error) {
      console.error("Get upcoming visits error:", error);
      return [];
    }
  }

  /**
   * Check if auto-schedule is enabled for donor
   */
  async checkAutoSchedule() {
    try {
      const profile = await this.getProfile();
      return {
        enabled: !!(profile?.weekly_days && profile?.max_visits_per_week),
        weekly_days: profile?.weekly_days,
        preferred_start: profile?.preferred_start,
        preferred_end: profile?.preferred_end,
        max_visits_per_week: profile?.max_visits_per_week,
      };
    } catch (error) {
      console.error("Check auto-schedule error:", error);
      return { enabled: false };
    }
  }
}

export const donorService = new DonorService();
export default donorService;
