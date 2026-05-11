require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.JWT_SECRET) {
  console.error(
    "❌ Missing JWT_SECRET. Set this environment variable before starting the server.",
  );
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
let dbConnected = false;

const startServer = async () => {
  try {
    dbConnected = await connectDB();

    // Import Models after DB connection attempt
    require("./models/User");
    require("./models/Wallet");
    require("./models/Transaction");
    require("./models/Notification");
    require("./models/SuspiciousTransaction");
    require("./models/Expense");
    require("./models/Budget");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      if (!dbConnected) {
        console.log(`⚠️  Using in-memory storage (no persistent DB)`);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));

startServer();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Server is running",
    databaseConnected: dbConnected,
    mode: dbConnected ? "production" : "demo (no persistent DB)"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

