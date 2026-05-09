import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const budgetService = {
  // Create a new budget
  createBudget: async (data) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/budgets`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get all budgets
  getBudgets: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/budgets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get current month's budget
  getCurrentBudget: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/budgets/current/month`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get a single budget
  getBudget: async (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/budgets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update a budget
  updateBudget: async (id, data) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/budgets/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete a budget
  deleteBudget: async (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_URL}/budgets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
