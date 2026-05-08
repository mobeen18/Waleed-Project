import axios from "axios";

const BASE_URL = "http://localhost:5001/api/admin";

// Demo admin token for testing (in production, this would be retrieved from secure storage)
const DEMO_ADMIN_TOKEN = "Bearer demo_admin_token_12345";

// Helper function to get auth headers
const getAuthHeaders = (token = null) => {
  const authToken = token || localStorage.getItem("adminToken") || DEMO_ADMIN_TOKEN;
  return {
    Authorization: authToken,
  };
};

// Get all suspicious transactions
export const getSuspiciousTransactions = async (filters = {}, token = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/suspicious-transactions`, {
      params: filters,
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suspicious transactions:", error);
    throw error;
  }
};

// Review a suspicious transaction
export const reviewSuspiciousTransaction = async (id, reviewData, token = null) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/suspicious-transactions/${id}/review`,
      reviewData,
      { headers: getAuthHeaders(token) }
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing transaction:", error);
    throw error;
  }
};

// Get notifications
export const getNotifications = async (userId = null, token = null) => {
  try {
    const params = userId ? { userId } : {};
    const response = await axios.get(`${BASE_URL}/notifications`, {
      params,
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id, token = null) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/notifications/${id}/read`,
      {},
      { headers: getAuthHeaders(token) }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Get dashboard stats
export const getDashboardStats = async (token = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboard-stats`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Get user activity report
export const getUserActivityReport = async (userId, token = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/user-activity/${userId}`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user activity report:", error);
    throw error;
  }
};
