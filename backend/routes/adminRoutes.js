const express = require("express");
const router = express.Router();

const {
  getSuspiciousTransactions,
  reviewSuspiciousTransaction,
  getNotifications,
  markNotificationAsRead,
  getDashboardStats,
  getUserActivityReport,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

// Suspicious transactions routes
router.get("/suspicious-transactions", protect, getSuspiciousTransactions);
router.put(
  "/suspicious-transactions/:id/review",
  protect,
  reviewSuspiciousTransaction
);

// Notifications routes
router.get("/notifications", protect, getNotifications);
router.put("/notifications/:id/read", protect, markNotificationAsRead);

// Dashboard stats
router.get("/dashboard-stats", protect, getDashboardStats);

// User activity report
router.get("/user-activity/:userId", protect, getUserActivityReport);

module.exports = router;
