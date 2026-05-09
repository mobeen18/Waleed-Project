const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// Helper function to check if database is connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Helper to calculate spent amount for a budget
const calculateSpentAmount = async (userId, month) => {
  const [year, monthNum] = month.split("-");
  const startDate = new Date(year, parseInt(monthNum) - 1, 1);
  const endDate = new Date(year, parseInt(monthNum), 0);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  return result[0]?.totalSpent || 0;
};

// Helper to determine budget status
const determineBudgetStatus = (spent, total, warningThreshold = 80) => {
  const percentage = (spent / total) * 100;
  if (percentage >= 100) return "exceeded";
  if (percentage >= warningThreshold) return "nearLimit";
  return "safe";
};

// ─── Create a budget ─────────────────────────────────────────────────────────
exports.createBudget = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { month, totalLimit, categoryLimits, warningThreshold } = req.body;

    if (!month || !totalLimit) {
      return res.status(400).json({
        success: false,
        message: "Month and totalLimit are required",
      });
    }

    if (totalLimit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total limit must be greater than zero",
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot create budget.",
      });
    }

    // Check for existing budget for this month
    const existing = await Budget.findOne({ userId, month });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Budget already exists for this month",
      });
    }

    // Calculate current spending
    const spentAmount = await calculateSpentAmount(userId, month);
    const status = determineBudgetStatus(spentAmount, totalLimit, warningThreshold || 80);

    const budget = await Budget.create({
      userId,
      month,
      totalLimit,
      categoryLimits: categoryLimits || [],
      spentAmount,
      status,
      warningThreshold: warningThreshold || 80,
    });

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      data: budget,
    });
  } catch (err) {
    console.error("Create budget error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating budget",
      error: err.message,
    });
  }
};

// ─── Get all budgets for the user ─────────────────────────────────────────────
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve budgets.",
      });
    }

    const budgets = await Budget.find({ userId }).sort({ month: -1 });

    // Refresh spent amounts and statuses
    for (const budget of budgets) {
      const spentAmount = await calculateSpentAmount(userId, budget.month);
      budget.spentAmount = spentAmount;
      budget.status = determineBudgetStatus(spentAmount, budget.totalLimit, budget.warningThreshold);
      await budget.save();
    }

    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (err) {
    console.error("Get budgets error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving budgets",
      error: err.message,
    });
  }
};

// ─── Get current month's budget ───────────────────────────────────────────────
exports.getCurrentBudget = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const today = new Date();
    const month = today.toISOString().slice(0, 7); // YYYY-MM

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve budget.",
      });
    }

    let budget = await Budget.findOne({ userId, month });

    if (!budget) {
      // Auto-create a default budget if none exists
      const spentAmount = await calculateSpentAmount(userId, month);
      budget = await Budget.create({
        userId,
        month,
        totalLimit: 100000, // Default limit
        categoryLimits: [],
        spentAmount,
        status: "safe",
        warningThreshold: 80,
      });
    } else {
      // Refresh spent amount
      const spentAmount = await calculateSpentAmount(userId, month);
      budget.spentAmount = spentAmount;
      budget.status = determineBudgetStatus(spentAmount, budget.totalLimit, budget.warningThreshold);
      await budget.save();
    }

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (err) {
    console.error("Get current budget error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving current budget",
      error: err.message,
    });
  }
};

// ─── Get a single budget ─────────────────────────────────────────────────────
exports.getBudget = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve budget.",
      });
    }

    const budget = await Budget.findOne({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    // Refresh spent amount
    const spentAmount = await calculateSpentAmount(userId, budget.month);
    budget.spentAmount = spentAmount;
    budget.status = determineBudgetStatus(spentAmount, budget.totalLimit, budget.warningThreshold);
    await budget.save();

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (err) {
    console.error("Get budget error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving budget",
      error: err.message,
    });
  }
};

// ─── Update a budget ────────────────────────────────────────────────────────
exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { id } = req.params;
    const { totalLimit, categoryLimits, warningThreshold } = req.body;

    if (totalLimit && totalLimit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total limit must be greater than zero",
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot update budget.",
      });
    }

    let budget = await Budget.findOne({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    if (totalLimit) budget.totalLimit = totalLimit;
    if (categoryLimits) budget.categoryLimits = categoryLimits;
    if (warningThreshold) budget.warningThreshold = warningThreshold;

    // Recalculate status
    const spentAmount = await calculateSpentAmount(userId, budget.month);
    budget.spentAmount = spentAmount;
    budget.status = determineBudgetStatus(spentAmount, budget.totalLimit, budget.warningThreshold);

    await budget.save();

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      data: budget,
    });
  } catch (err) {
    console.error("Update budget error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating budget",
      error: err.message,
    });
  }
};

// ─── Delete a budget ────────────────────────────────────────────────────────
exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.user?.id || "000000000000000000000000";
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot delete budget.",
      });
    }

    const budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (err) {
    console.error("Delete budget error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting budget",
      error: err.message,
    });
  }
};
