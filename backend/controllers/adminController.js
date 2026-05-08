const mongoose = require("mongoose");
const SuspiciousTransaction = require("../models/SuspiciousTransaction");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Helper function to check if database is connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all suspicious transactions
const getSuspiciousTransactions = async (req, res) => {
  try {
    if (!isDbConnected()) {
      // Demo mode: return empty array
      return res.status(200).json({
        success: true,
        suspicious: [],
        total: 0,
        pages: 0,
      });
    }

    const { severity, reviewed, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (severity) {
      query.severity = severity;
    }

    if (reviewed !== undefined) {
      query.reviewed = reviewed === "true";
    }

    const suspicious = await SuspiciousTransaction.find(query)
      .populate("userId", "username email")
      .populate("transactionId")
      .populate("reviewedBy", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SuspiciousTransaction.countDocuments(query);

    return res.status(200).json({
      success: true,
      suspicious,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Suspicious transactions fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suspicious transactions.",
    });
  }
};

// Review a suspicious transaction
const reviewSuspiciousTransaction = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: "Transaction review recorded (demo mode).",
        suspicious: {},
      });
    }

    const { id } = req.params;
    const { reviewNote, approved } = req.body;
    const reviewerId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID.",
      });
    }

    const suspicious = await SuspiciousTransaction.findByIdAndUpdate(
      id,
      {
        reviewed: true,
        reviewedBy: reviewerId,
        reviewNote: reviewNote || "",
      },
      { new: true }
    );

    if (!suspicious) {
      return res.status(404).json({
        success: false,
        message: "Suspicious transaction not found.",
      });
    }

    // Notify user
    await Notification.create({
      userId: suspicious.userId,
      message: `Your transaction has been reviewed. Status: ${approved ? "Approved" : "Flagged"}`,
      type: "suspicious",
    });

    return res.status(200).json({
      success: true,
      message: "Transaction review recorded.",
      suspicious,
    });
  } catch (error) {
    console.error("Review error:", error);
    return res.status(500).json({
      success: false,
      message: "Error reviewing transaction.",
    });
  }
};

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    if (!isDbConnected()) {
      // Demo mode: return empty array
      return res.status(200).json({
        success: true,
        notifications: [],
      });
    }

    const { userId } = req.query;
    const query = {};

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }
      query.userId = userId;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        notification: {},
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating notification.",
    });
  }
};

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    if (!isDbConnected()) {
      // Demo mode: return empty stats
      return res.status(200).json({
        success: true,
        stats: {
          totalUsers: 0,
          totalSuspiciousTransactions: 0,
          unreviewedTransactions: 0,
          highSeverityCount: 0,
        },
      });
    }

    const totalUsers = await User.countDocuments();
    const totalSuspiciousTransactions = await SuspiciousTransaction.countDocuments();
    const unreviewedTransactions = await SuspiciousTransaction.countDocuments({
      reviewed: false,
    });
    const highSeverityCount = await SuspiciousTransaction.countDocuments({
      severity: "high",
      reviewed: false,
    });

    const stats = {
      totalUsers,
      totalSuspiciousTransactions,
      unreviewedTransactions,
      highSeverityCount,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats.",
    });
  }
};

// Get user activity report
const getUserActivityReport = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        user: {
          id: req.params.userId,
          username: "demo_user",
          email: "demo@example.com",
          suspiciousActivityCount: 0,
        },
        suspiciousTransactions: [],
        recentTransactions: [],
        notifications: [],
      });
    }

    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const suspiciousTransactions = await SuspiciousTransaction.find({
      userId,
    }).populate("transactionId");

    const recentTransactions = await Transaction.find({
      $or: [{ sourceWalletId: userId }, { targetWalletId: userId }],
    }).limit(20);

    const notifications = await Notification.find({ userId }).limit(20);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        suspiciousActivityCount: user.suspiciousActivityCount,
      },
      suspiciousTransactions,
      recentTransactions,
      notifications,
    });
  } catch (error) {
    console.error("User activity report error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user activity report.",
    });
  }
};

module.exports = {
  getSuspiciousTransactions,
  reviewSuspiciousTransaction,
  getNotifications,
  markNotificationAsRead,
  getDashboardStats,
  getUserActivityReport,
};

// Review a suspicious transaction
const reviewSuspiciousTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNote, approved } = req.body;
    const reviewerId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID.",
      });
    }

    const suspicious = await SuspiciousTransaction.findByIdAndUpdate(
      id,
      {
        reviewed: true,
        reviewedBy: reviewerId,
        reviewNote: reviewNote || "",
      },
      { new: true }
    );

    if (!suspicious) {
      return res.status(404).json({
        success: false,
        message: "Suspicious transaction not found.",
      });
    }

    // Notify user
    await Notification.create({
      userId: suspicious.userId,
      message: `Your transaction has been reviewed. Status: ${approved ? "Approved" : "Flagged"}`,
      type: "suspicious",
    });

    return res.status(200).json({
      success: true,
      message: "Transaction review recorded.",
      suspicious,
    });
  } catch (error) {
    console.error("Review error:", error);
    return res.status(500).json({
      success: false,
      message: "Error reviewing transaction.",
    });
  }
};

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = {};

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }
      query.userId = userId;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating notification.",
    });
  }
};

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSuspiciousTransactions = await SuspiciousTransaction.countDocuments();
    const unreviewedTransactions = await SuspiciousTransaction.countDocuments({
      reviewed: false,
    });
    const highSeverityCount = await SuspiciousTransaction.countDocuments({
      severity: "high",
      reviewed: false,
    });

    const stats = {
      totalUsers,
      totalSuspiciousTransactions,
      unreviewedTransactions,
      highSeverityCount,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats.",
    });
  }
};

// Get user activity report
const getUserActivityReport = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const suspiciousTransactions = await SuspiciousTransaction.find({
      userId,
    }).populate("transactionId");

    const recentTransactions = await Transaction.find({
      $or: [{ sourceWalletId: userId }, { targetWalletId: userId }],
    }).limit(20);

    const notifications = await Notification.find({ userId }).limit(20);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        suspiciousActivityCount: user.suspiciousActivityCount,
      },
      suspiciousTransactions,
      recentTransactions,
      notifications,
    });
  } catch (error) {
    console.error("User activity report error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user activity report.",
    });
  }
};

module.exports = {
  getSuspiciousTransactions,
  reviewSuspiciousTransaction,
  getNotifications,
  markNotificationAsRead,
  getDashboardStats,
  getUserActivityReport,
};
