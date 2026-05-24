import axios from "axios";
import API_URL from "../config/api";

const userService = {
  // Get all users
  getUsers: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get a single user
  getUser: async (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/auth/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get current user profile
  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update user profile
  updateProfile: async (data) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/auth/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Export individual functions for cleaner imports
export const getUsers = userService.getUsers;
export const getUser = userService.getUser;
export const getCurrentUser = userService.getCurrentUser;
export const updateProfile = userService.updateProfile;

export default userService;
