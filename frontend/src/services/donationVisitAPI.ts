import axios from "axios";

// Use relative path for proxy to work with ngrok
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Donation Visit API Service
 */
export const donationVisitAPI = {
  /**
   * Get all donation visits
   */
  getAllVisits: async (params?: {
    donor_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    bank_id?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/donation-visits", { params });
    return response.data;
  },

  /**
   * Get donation visit by ID
   */
  getVisitById: async (visitId: string) => {
    const response = await api.get(`/donation-visits/${visitId}`);
    return response.data;
  },

  /**
   * Create new donation visit
   */
  createVisit: async (data: {
    donor_id: string;
    bank_id: string;
    scheduled_start: string;
    scheduled_end?: string;
    origin?: "system" | "user" | "staff";
    notes?: string;
  }) => {
    const response = await api.post("/donation-visits", data);
    return response.data;
  },

  /**
   * Update donation visit (e.g., check health status)
   */
  updateVisit: async (
    visitId: string,
    data: {
      status?: string;
      health_status?: "good" | "bad";
      health_notes?: string;
      actual_start?: string;
      actual_end?: string;
      notes?: string;
    }
  ) => {
    const response = await api.patch(`/donation-visits/${visitId}`, data);
    return response.data;
  },

  /**
   * Record milk donation (Step 5 in Process 2)
   */
  recordDonation: async (
    visitId: string,
    data: {
      health_status: "good" | "bad";
      milk_volume_ml?: number;
      container_count?: number;
      health_notes?: string;
      quality_notes?: string;
    }
  ) => {
    const response = await api.post(
      `/donation-visits/${visitId}/record-donation`,
      data
    );
    return response.data;
  },

  /**
   * Get donor's upcoming visits
   */
  getDonorUpcomingVisits: async (donorId: string, limit?: number) => {
    const response = await api.get(
      `/donation-visits/donor/${donorId}/upcoming`,
      {
        params: { limit },
      }
    );
    return response.data;
  },

  /**
   * Get donor's donation history
   */
  getDonorDonationHistory: async (
    donorId: string,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await api.get(
      `/donation-visits/donor/${donorId}/history`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default donationVisitAPI;
