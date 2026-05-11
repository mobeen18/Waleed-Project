import axios from "axios";
import API_URL from "../config/api";
import { getToken } from "../controller/authController";

const getAuthConfig = () => {
  const token = getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const expenseService = {
  // Create a new expense
  createExpense: async (data) => {
    return axios.post(`${API_URL}/expenses`, data, getAuthConfig());
  },

  // Get all expenses with optional filters
  getExpenses: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    return axios.get(
      `${API_URL}/expenses?${params.toString()}`,
      getAuthConfig(),
    );
  },

  // Get monthly summary
  getMonthlySummary: async () => {
    return axios.get(`${API_URL}/expenses/summary/monthly`, getAuthConfig());
  },

  // Get category summary
  getCategorySummary: async () => {
    return axios.get(`${API_URL}/expenses/summary/category`, getAuthConfig());
  },

  // Get a single expense
  getExpense: async (id) => {
    return axios.get(`${API_URL}/expenses/${id}`, getAuthConfig());
  },

  // Update an expense
  updateExpense: async (id, data) => {
    return axios.put(`${API_URL}/expenses/${id}`, data, getAuthConfig());
  },

  // Delete an expense
  deleteExpense: async (id) => {
    return axios.delete(`${API_URL}/expenses/${id}`, getAuthConfig());
  },
};

// Export individual functions for cleaner imports
export const createExpense = expenseService.createExpense;
export const getExpenses = expenseService.getExpenses;
export const getMonthlySummary = expenseService.getMonthlySummary;
export const getCategorySummary = expenseService.getCategorySummary;
export const getExpense = expenseService.getExpense;
export const updateExpense = expenseService.updateExpense;
export const deleteExpense = expenseService.deleteExpense;

export default expenseService;
