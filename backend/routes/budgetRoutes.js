const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// Create a budget
router.post("/", budgetController.createBudget);

// Get all budgets
router.get("/", budgetController.getBudgets);

// Get current month's budget
router.get("/current/month", budgetController.getCurrentBudget);

// Get a single budget
router.get("/:id", budgetController.getBudget);

// Update a budget
router.put("/:id", budgetController.updateBudget);

// Delete a budget
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
