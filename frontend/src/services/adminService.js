import axios from "axios";
import { getToken } from "../controller/authController";

const BASE_URL = "http://localhost:5000/api/admin";

const getAuthConfig = () => {
  const token = getToken();
  return {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  };
};

// Get all suspicious transactions
export const getSuspiciousTransactions = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/suspicious-transactions`, {
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
    const response = await axios.put(
      `${BASE_URL}/suspicious-transactions/${id}/review`,
      reviewData,
      getAuthConfig()
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
    const response = await axios.get(`${BASE_URL}/notifications`, {
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
    const response = await axios.put(
      `${BASE_URL}/notifications/${id}/read`,
      null,
      getAuthConfig()
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
    const response = await axios.get(`${BASE_URL}/dashboard-stats`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Get user activity report
export const getUserActivityReport = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user-activity/${userId}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching user activity report:", error);
    throw error;
  }
};
