const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
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

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5001",
    "https://medilease.vercel.app",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

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
app.use(cors(corsOptions));

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
      console.log(`✅ Database Connected`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Validate critical environment variables at startup
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET environment variable is not set");
  process.exit(1);
}

if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI && !process.env.MONGO_URI) {
  console.error("❌ FATAL: MONGODB_URI must be set in production");
  process.exit(1);
}

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
