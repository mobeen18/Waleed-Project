import API from "../config/api";
import { getAuthConfig } from "../utils/authUtils";

// Get all suspicious transactions
export const getSuspiciousTransactions = async (filters = {}) => {
  try {
    const response = await API.get("/admin/suspicious-transactions", {
      params: filters,
      ...getAuthConfig(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suspicious transactions:", error);
    throw error;
  }
};

// Review a suspicious transaction
export const reviewSuspiciousTransaction = async (id, reviewData) => {
  try {
    const response = await API.put(
      `/admin/suspicious-transactions/${id}/review`,
      reviewData,
      getAuthConfig(),
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing transaction:", error);
    throw error;
  }
};

// Get notifications
export const getNotifications = async (userId = null) => {
  try {
    const params = userId ? { userId } : {};
    const response = await API.get("/admin/notifications", {
      params,
      ...getAuthConfig(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id) => {
  try {
    const response = await API.put(
      `/admin/notifications/${id}/read`,
      {},
      getAuthConfig(),
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await API.get("/admin/dashboard-stats", getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Get user activity report
export const getUserActivityReport = async (userId) => {
  try {
    const response = await API.get(
      `/admin/user-activity/${userId}`,
      getAuthConfig(),
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user activity report:", error);
    throw error;
  }
};
