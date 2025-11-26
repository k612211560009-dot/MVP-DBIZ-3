import { api } from "../services/api";

// Set auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Clear auth token
export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

// Get token from storage
export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// Get user role from token
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    return null;
  }
};
