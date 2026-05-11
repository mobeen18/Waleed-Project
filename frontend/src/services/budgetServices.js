import axios from "axios";
import API_URL from "../config/api";
import { getToken } from "../controller/authController";

const getAuthConfig = () => {
  const token = getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const budgetService = {
  // Create a new budget
  createBudget: async (data) => {
    return axios.post(`${API_URL}/budgets`, data, getAuthConfig());
  },

  // Get all budgets
  getBudgets: async () => {
    return axios.get(`${API_URL}/budgets`, getAuthConfig());
  },

  // Get current month's budget
  getCurrentBudget: async () => {
    return axios.get(`${API_URL}/budgets/current/month`, getAuthConfig());
  },

  // Get a single budget
  getBudget: async (id) => {
    return axios.get(`${API_URL}/budgets/${id}`, getAuthConfig());
  },

  // Update a budget
  updateBudget: async (id, data) => {
    return axios.put(`${API_URL}/budgets/${id}`, data, getAuthConfig());
  },

  // Delete a budget
  deleteBudget: async (id) => {
    return axios.delete(`${API_URL}/budgets/${id}`, getAuthConfig());
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
