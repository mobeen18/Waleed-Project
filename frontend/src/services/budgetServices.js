import API from "../config/api";
import { getAuthConfig } from "../utils/authUtils";

const budgetService = {
  // Create a new budget
  createBudget: async (data) => {
    return API.post("/budgets", data, getAuthConfig());
  },

  // Get all budgets
  getBudgets: async () => {
    return API.get("/budgets", getAuthConfig());
  },

  // Get current month's budget
  getCurrentBudget: async () => {
    return API.get("/budgets/current/month", getAuthConfig());
  },

  // Get a single budget
  getBudget: async (id) => {
    return API.get(`/budgets/${id}`, getAuthConfig());
  },

  // Update a budget
  updateBudget: async (id, data) => {
    return API.put(`/budgets/${id}`, data, getAuthConfig());
  },

  // Delete a budget
  deleteBudget: async (id) => {
    return API.delete(`/budgets/${id}`, getAuthConfig());
  },
};

// Export individual functions for cleaner imports
export const createBudget = budgetService.createBudget;
export const getBudgets = budgetService.getBudgets;
export const getCurrentBudget = budgetService.getCurrentBudget;
export const getBudget = budgetService.getBudget;
export const updateBudget = budgetService.updateBudget;
export const deleteBudget = budgetService.deleteBudget;

export default budgetService;
