import axios from "axios";
import API_URL from "../config/api";
import { getToken } from "../controller/authController";

const getAuthConfig = () => {
  const token = getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const userService = {
  // Get all users
  getUsers: async () => {
    return axios.get(`${API_URL}/auth/users`, getAuthConfig());
  },

  // Get a single user
  getUser: async (id) => {
    return axios.get(`${API_URL}/auth/users/${id}`, getAuthConfig());
  },

  // Get current user profile
  getCurrentUser: async () => {
    return axios.get(`${API_URL}/auth/profile`, getAuthConfig());
  },

  // Update user profile
  updateProfile: async (data) => {
    return axios.put(`${API_URL}/auth/profile`, data, getAuthConfig());
  },
};

// Export individual functions for cleaner imports
export const getUsers = userService.getUsers;
export const getUser = userService.getUser;
export const getCurrentUser = userService.getCurrentUser;
export const updateProfile = userService.updateProfile;

export default userService;
