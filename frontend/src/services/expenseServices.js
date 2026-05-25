import API from "../config/api";
import { getAuthConfig } from "../utils/authUtils";


const expenseService = {
  // Create a new expense
  createExpense: async (data) => {
    return API.post("/expenses", data, getAuthConfig());
  },

  // Get all expenses with optional filters
  getExpenses: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    return API.get(`/expenses?${params.toString()}`, getAuthConfig());
  },

  // Get monthly summary
  getMonthlySummary: async () => {
    return API.get("/expenses/summary/monthly", getAuthConfig());
  },

  // Get category summary
  getCategorySummary: async () => {
    return API.get("/expenses/summary/category", getAuthConfig());
  },

  // Get a single expense
  getExpense: async (id) => {
    return API.get(`/expenses/${id}`, getAuthConfig());
  },

  // Update an expense
  updateExpense: async (id, data) => {
    return API.put(`/expenses/${id}`, data, getAuthConfig());
  },

  // Delete an expense
  deleteExpense: async (id) => {
    return API.delete(`/expenses/${id}`, getAuthConfig());
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
