require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(helmet()); // Add security headers
app.use(express.json({ limit: "10kb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Database connection (non-blocking - continues even if DB fails)
let dbConnected = false;
connectDB().then((result) => {
  dbConnected = result;
});

// Import Models (ensures they are registered with MongoDB)
require("./models/User");
require("./models/Wallet");
require("./models/Transaction");
require("./models/Notification");
require("./models/SuspiciousTransaction");
require("./models/Expense");
require("./models/Budget");

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));

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

// Validate critical environment variables at startup
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET environment variable is not set");
  process.exit(1);
}

if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
  console.error("❌ FATAL: MONGODB_URI must be set in production");
  process.exit(1);
}

app.listen(PORT, () => {
  const env = process.env.NODE_ENV || "development";
  console.log(`✅ Server running on port ${PORT} [${env.toUpperCase()}]`);
  if (env === "development") {
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  }
});
