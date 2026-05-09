const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

// Helper function to check if database is connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// ─── Create an expense ────────────────────────────────────────────────────────
exports.createExpense = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { title, amount, category, paymentMethod, ownerId, date, notes } = req.body;

    // Validation
    if (!title || !amount || !category || !ownerId || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, amount, category, owner, and date are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot create expense.",
      });
    }

    const expense = await Expense.create({
      userId,
      title: title.trim(),
      amount,
      category: category.trim(),
      paymentMethod: paymentMethod || "Cash",
      ownerId,
      date: new Date(date),
      notes: notes?.trim() || "",
    });

    // Populate owner info
    await expense.populate("ownerId", "name email");

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (err) {
    console.error("Create expense error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating expense",
      error: err.message,
    });
  }
};

// ─── Get all expenses with optional filters ───────────────────────────────────
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { category, startDate, endDate } = req.query;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve expenses.",
      });
    }

    const filter = { userId };

    if (category && category !== "") {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const expenses = await Expense.find(filter)
      .populate("ownerId", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (err) {
    console.error("Get expenses error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving expenses",
      error: err.message,
    });
  }
};

// ─── Get monthly summary ──────────────────────────────────────────────────────
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve summary.",
      });
    }

    const expenses = await Expense.find({ userId });

    // Group by year-month
    const summary = {};
    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      const month = date.toISOString().slice(0, 7); // YYYY-MM
      if (!summary[month]) {
        summary[month] = 0;
      }
      summary[month] += exp.amount;
    });

    const result = Object.entries(summary)
      .map(([month, total]) => ({ month, totalSpent: total }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .reverse();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Get monthly summary error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving monthly summary",
      error: err.message,
    });
  }
};

// ─── Get category summary ─────────────────────────────────────────────────────
exports.getCategorySummary = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve summary.",
      });
    }

    const expenses = await Expense.find({ userId });

    // Group by category
    const summary = {};
    expenses.forEach((exp) => {
      if (!summary[exp.category]) {
        summary[exp.category] = 0;
      }
      summary[exp.category] += exp.amount;
    });

    const result = Object.entries(summary)
      .map(([category, totalSpent]) => ({ category, totalSpent }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Get category summary error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving category summary",
      error: err.message,
    });
  }
};

// ─── Get a single expense ─────────────────────────────────────────────────────
exports.getExpense = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve expense.",
      });
    }

    const expense = await Expense.findOne({ _id: id, userId }).populate("ownerId", "name email");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    console.error("Get expense error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving expense",
      error: err.message,
    });
  }
};

// ─── Update an expense ────────────────────────────────────────────────────────
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { id } = req.params;
    const { title, amount, category, paymentMethod, ownerId, date, notes } = req.body;

    if (amount && amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot update expense.",
      });
    }

    const expense = await Expense.findOne({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Update fields if provided
    if (title) expense.title = title.trim();
    if (amount) expense.amount = amount;
    if (category) expense.category = category.trim();
    if (paymentMethod) expense.paymentMethod = paymentMethod;
    if (ownerId) expense.ownerId = ownerId;
    if (date) expense.date = new Date(date);
    if (notes !== undefined) expense.notes = notes.trim();

    await expense.save();
    await expense.populate("ownerId", "name email");

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (err) {
    console.error("Update expense error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating expense",
      error: err.message,
    });
  }
};

// ─── Delete an expense ────────────────────────────────────────────────────────
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot delete expense.",
      });
    }

    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    console.error("Delete expense error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting expense",
      error: err.message,
    });
  }
};
