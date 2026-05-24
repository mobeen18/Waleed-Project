import axios from "axios";
import API_URL from "../config/api";

const expenseService = {
  // Create a new expense
  createExpense: async (data) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/expenses`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get all expenses with optional filters
  getExpenses: async (filters = {}) => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    
    if (filters.category) params.append("category", filters.category);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    return axios.get(`${API_URL}/expenses?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get monthly summary
  getMonthlySummary: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/expenses/summary/monthly`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get category summary
  getCategorySummary: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/expenses/summary/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get a single expense
  getExpense: async (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update an expense
  updateExpense: async (id, data) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/expenses/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete an expense
  deleteExpense: async (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_URL}/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
