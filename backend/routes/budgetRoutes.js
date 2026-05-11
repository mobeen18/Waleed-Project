const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const budgetController = require("../controllers/budgetController");

// Create a budget
router.post("/", protect, budgetController.createBudget);

// Get all budgets
router.get("/", protect, budgetController.getBudgets);

// Get current month's budget
router.get("/current/month", protect, budgetController.getCurrentBudget);

// Get a single budget
router.get("/:id", protect, budgetController.getBudget);

// Update a budget
router.put("/:id", protect, budgetController.updateBudget);

// Delete a budget
router.delete("/:id", protect, budgetController.deleteBudget);

module.exports = router;
