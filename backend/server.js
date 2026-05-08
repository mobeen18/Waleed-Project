require("dotenv").config(); // Load environment variables
const express = require("express"); // 1. Import express
const app = express(); // 2. Initialize the app
const PORT = process.env.PORT || 5001; // 3. Define the port

// Middleware
app.use(express.json());
app.use(require("cors")());

// Database connection
require("./config/db")();

// Routes
app.use("/api/wallet", require("./routes/walletRoutes"));

app.listen(PORT, () => {
  // 4. Use 'app' (not 'server') to listen
  console.log(`Server running on port ${PORT}`);
});
