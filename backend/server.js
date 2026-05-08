require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies/auth headers
  }),
);

app.use(express.json());

const walletRoutes = require("./routes/walletRoutes");
app.use("/api/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "💰 Wallet Module API is running!",
    endpoints: {
      deposit: "POST /api/wallet/deposit",
      withdraw: "POST /api/wallet/withdraw",
      summary: "GET /api/wallet/summary",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found.`,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Wallet Module Server running on http://localhost:${PORT}`);
});
