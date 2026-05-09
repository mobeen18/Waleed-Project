const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

// Create an expense
router.post("/", expenseController.createExpense);

// Get all expenses with optional filters
router.get("/", expenseController.getExpenses);

// Get monthly summary
router.get("/summary/monthly", expenseController.getMonthlySummary);

// Get category summary
router.get("/summary/category", expenseController.getCategorySummary);

// Get a single expense
router.get("/:id", expenseController.getExpense);

// Update an expense
router.put("/:id", expenseController.updateExpense);

// Delete an expense
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
