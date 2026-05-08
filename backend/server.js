require("dotenv").config(); // Load environment variables
const express = require("express"); // 1. Import express
const cors = require("cors");
const app = express(); // 2. Initialize the app
const PORT = process.env.PORT || 5001; // 3. Define the port

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
require("./config/db")();

// Import Models (ensures they are registered with MongoDB)
require("./models/User");
require("./models/Wallet");
require("./models/Transaction");
require("./models/Notification");
require("./models/SuspiciousTransaction");

// Routes
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
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

app.listen(PORT, () => {
  // 4. Use 'app' (not 'server') to listen
  console.log(`✅ Server running on port ${PORT}`);
});
