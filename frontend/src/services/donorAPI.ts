import api from "./api";

export interface Donor {
  donor_id: string;
  donor_status: string;
  screening_status: string;
  director_status: string;
  created_at: string;
  updated_at: string;

  ehrData?: {
    full_name: string;
    date_of_birth: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    is_clear: boolean;
    hiv_result: string;
    hbv_result: string;
    hcv_result: string;
    syphilis_result: string;
    htlv_result: string;
  };

  user?: {
    user_id: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
  };
}

export interface DonorsResponse {
  message: string;
  data: {
    donors: Donor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface DonorParams {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Get all donors with filtering and pagination
 */
export const getDonors = async (
  params?: DonorParams
): Promise<DonorsResponse> => {
  const response = await api.get<DonorsResponse>("/donors", { params });
  return response.data;
};

/**
 * Get donor by ID
 */
export const getDonorById = async (id: string): Promise<any> => {
  const response = await api.get(`/donors/${id}`);
  return response.data;
};

/**
 * Update donor status
 */
export const updateDonorStatus = async (
  id: string,
  status: string,
  reason?: string
): Promise<any> => {
  const response = await api.put(`/donors/${id}/status`, { status, reason });
  return response.data;
};

/**
 * Approve donor
 */
export const approveDonor = async (id: string, data: any): Promise<any> => {
  const response = await api.post(`/donors/${id}/approve`, data);
  return response.data;
};

/**
 * Reject donor
 */
export const rejectDonor = async (id: string, reason: string): Promise<any> => {
  const response = await api.post(`/donors/${id}/reject`, { reason });
  return response.data;
};
