import API from "../config/api";
import { getAuthConfig } from "../utils/authUtils";

const userService = {
  // Get all users
  getUsers: async () => {
    return API.get("/auth/users", getAuthConfig());
  },

  // Get a single user
  getUser: async (id) => {
    return API.get(`/auth/users/${id}`, getAuthConfig());
  },

  // Get current user profile
  getCurrentUser: async () => {
    return API.get("/auth/profile", getAuthConfig());
  },

  // Update user profile
  updateProfile: async (data) => {
    return API.put("/auth/profile", data, getAuthConfig());
  },
};

// Export individual functions for cleaner imports
export const getUsers = userService.getUsers;
export const getUser = userService.getUser;
export const getCurrentUser = userService.getCurrentUser;
export const updateProfile = userService.updateProfile;

export default userService;
