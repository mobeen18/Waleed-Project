const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");

// Create an expense
router.post("/", protect, expenseController.createExpense);

// Get all expenses with optional filters
router.get("/", protect, expenseController.getExpenses);

// Get monthly summary
router.get("/summary/monthly", protect, expenseController.getMonthlySummary);

// Get category summary
router.get("/summary/category", protect, expenseController.getCategorySummary);

// Get a single expense
router.get("/:id", protect, expenseController.getExpense);

// Update an expense
router.put("/:id", protect, expenseController.updateExpense);

// Delete an expense
router.delete("/:id", protect, expenseController.deleteExpense);

module.exports = router;
