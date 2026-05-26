# Waleed-Project - Detailed Fixes & Action Plan

This document provides specific code changes to fix the critical and high-priority issues.

---

## CRITICAL ISSUE FIXES

### Fix 1: Add Admin Authorization Middleware

**File to Create:** `backend/middleware/adminMiddleware.js`

```javascript
const protectAdmin = (req, res, next) => {
  // First check if user is authenticated (protect middleware already did this)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please log in."
    });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }

  next();
};

module.exports = { protectAdmin };
```

**Update File:** `backend/routes/adminRoutes.js`

```javascript
const express = require("express");
const router = express.Router();

const {
  getSuspiciousTransactions,
  reviewSuspiciousTransaction,
  getNotifications,
  markNotificationAsRead,
  getDashboardStats,
  getUserActivityReport,
  getAllUsers,
  blockUser,
  unblockUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { protectAdmin } = require("../middleware/adminMiddleware");  // ADD THIS

// User management routes - PROTECTED WITH ADMIN MIDDLEWARE
router.get("/users", protect, protectAdmin, getAllUsers);
router.put("/users/:id/block", protect, protectAdmin, blockUser);
router.put("/users/:id/unblock", protect, protectAdmin, unblockUser);

// Suspicious transactions routes - PROTECTED WITH ADMIN MIDDLEWARE
router.get("/suspicious-transactions", protect, protectAdmin, getSuspiciousTransactions);
router.put(
  "/suspicious-transactions/:id/review",
  protect,
  protectAdmin,
  reviewSuspiciousTransaction
);

// Notifications routes - PROTECTED WITH ADMIN MIDDLEWARE
router.get("/notifications", protect, protectAdmin, getNotifications);
router.put("/notifications/:id/read", protect, protectAdmin, markNotificationAsRead);

// Dashboard stats - PROTECTED WITH ADMIN MIDDLEWARE
router.get("/dashboard-stats", protect, protectAdmin, getDashboardStats);

// User activity report - PROTECTED WITH ADMIN MIDDLEWARE
router.get("/user-activity/:userId", protect, protectAdmin, getUserActivityReport);

module.exports = router;
```

---

### Fix 2: Implement Missing Wallet Controller Functions

**File to Update:** `backend/controllers/walletController.js`

Add these missing functions at the end of the file:

```javascript
const getSummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated."
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found."
      });
    }

    // Get recent transactions (last 10)
    const recentTransactions = await Transaction.find({
      walletId: wallet._id
    }).sort({ createdAt: -1 }).limit(10);

    return res.status(200).json({
      success: true,
      wallet: {
        balance: wallet.balance,
        totalDeposits: wallet.totalDeposits,
        totalWithdrawals: wallet.totalWithdrawals,
      },
      recentTransactions,
    });
  } catch (error) {
    console.error("Get summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving wallet summary.",
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated."
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found."
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type || "";

    const skip = (page - 1) * limit;

    let query = { walletId: wallet._id };
    if (type && ["DEPOSIT", "WITHDRAWAL", "TRANSFER_IN", "TRANSFER_OUT"].includes(type)) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    return res.status(200).json({
      success: true,
      transactions,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving transactions.",
    });
  }
};

// Update exports
module.exports = {
  deposit,
  withdraw,
  getSummary,       // ADD THIS
  getTransactions,  // ADD THIS
  listWallets,
  transfer,
  getOrCreateWallet,
};
```

---

### Fix 3: Add Password Strength Validation

**File to Update:** `backend/controllers/authController.js`

Add this utility function at the top:

```javascript
const validatePasswordStrength = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long"
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter"
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter"
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number"
    };
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (!@#$%^&*)"
    };
  }

  return { isValid: true };
};
```

Update the `register` function:

```javascript
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, cnic, clinicName, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    // VALIDATE PASSWORD STRENGTH
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "user",
      phone,
      cnic,
      clinicName: role === "doctor" ? clinicName : undefined,
      city: role === "doctor" ? city : undefined,
    });

    await Wallet.create({ userId: user._id });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: "Server error during registration." });
  }
};
```

---

### Fix 4: Add CSRF Protection

**Install package:** `npm install csurf cookie-parser`

**File to Update:** `backend/server.js`

```javascript
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const csrf = require("csurf");            // ADD THIS
const cookieParser = require("cookie-parser");  // ADD THIS
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;

// ... JWT_SECRET validation ...

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5001",
      "https://medilease.vercel.app",
      process.env.FRONTEND_URL,
      /\.vercel\.app$/,
    ].filter(Boolean);
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(ao => {
      if (ao instanceof RegExp) return ao.test(origin);
      return ao === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],  // ADD CSRF header
};

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());  // ADD THIS - for CSRF cookies

// CSRF Protection middleware
const csrfProtection = csrf({ cookie: true });  // ADD THIS

// Rate limiting - stricter for auth endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Max 5 attempts per 15 minutes
  message: "Too many login/register attempts, please try again later.",
  skipSuccessfulRequests: true,  // Don't count successful requests
});

app.use(generalLimiter);
app.use(cors(corsOptions));

// ... rest of middleware ...

// CSRF Token endpoint (GET request, doesn't require auth)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes - wrap state-changing routes with CSRF protection
app.use("/api/auth", csrfProtection, require("./routes/authRoutes"));
app.use("/api/wallet", csrfProtection, require("./routes/walletRoutes"));
app.use("/api/admin", csrfProtection, require("./routes/adminRoutes"));
app.use("/api/expenses", csrfProtection, require("./routes/expenseRoutes"));
app.use("/api/budgets", csrfProtection, require("./routes/budgetRoutes"));

// ... rest of server code ...
```

---

### Fix 5: Sanitize User Input & Prevent Regex Injection

**File to Create:** `backend/utils/sanitization.js`

```javascript
/**
 * Escape special regex characters to prevent regex injection
 * @param {string} str - String to escape
 * @returns {string} - Escaped string safe for regex
 */
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Validate and sanitize user input for searches
 * @param {string} input - User input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized input
 */
const sanitizeSearchInput = (input, maxLength = 100) => {
  if (!input) return '';
  
  // Remove dangerous characters
  let sanitized = input.trim();
  
  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

module.exports = {
  escapeRegex,
  sanitizeSearchInput
};
```

**Update File:** `backend/controllers/walletController.js`

```javascript
const { escapeRegex, sanitizeSearchInput } = require("../utils/sanitization");  // ADD THIS

const listWallets = async (req, res) => {
  try {
    const search = sanitizeSearchInput(req.query.search);  // SANITIZE INPUT
    const pipeline = [];

    if (search) {
      pipeline.push({
        $addFields: {
          userIdString: { $toString: "$userId" },
        },
      });
      pipeline.push({
        $match: {
          userIdString: { $regex: escapeRegex(search), $options: "i" },  // ESCAPE REGEX
        },
      });
    }

    pipeline.push({
      $project: {
        userId: { $toString: "$userId" },
        balance: 1,
        totalDeposits: 1,
        totalWithdrawals: 1,
        createdAt: 1,
      },
    });

    pipeline.push({ $sort: { balance: -1 } });

    const wallets = await Wallet.aggregate(pipeline);

    return res.status(200).json({ success: true, wallets });
  } catch (error) {
    console.error("Wallet list error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch the wallet directory.",
    });
  }
};
```

---

### Fix 6: Implement Proper Budget Creation

**File to Update:** `backend/controllers/budgetController.js`

Replace the `getCurrentBudget` function:

```javascript
exports.getCurrentBudget = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve budget.",
      });
    }

    const today = new Date();
    const month = today.toISOString().slice(0, 7);

    let budget = await Budget.findOne({ userId, month });

    if (!budget) {
      // Return 404 instead of auto-creating with default
      return res.status(404).json({
        success: false,
        message: `No budget found for ${month}. Please create one first.`,
        requiresCreation: true,  // Signal to frontend to prompt user
      });
    }

    // Refresh spent amount
    const spentAmount = await calculateSpentAmount(userId, month);
    budget.spentAmount = spentAmount;
    budget.status = determineBudgetStatus(
      spentAmount,
      budget.totalLimit,
      budget.warningThreshold
    );
    await budget.save();

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (err) {
    console.error("Get current budget error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving current budget",
    });
  }
};
```

---

## HIGH SEVERITY ISSUE FIXES

### Fix 7: Add Email Validation

**File to Create:** `backend/utils/validation.js`

```javascript
/**
 * Validate email format using RFC 5322 (simplified)
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate name (non-empty, no numbers only)
 * @param {string} name - Name to validate
 * @returns {boolean}
 */
const isValidName = (name) => {
  return name && name.trim().length > 0 && name.length <= 100;
};

/**
 * Validate amount is a valid currency value
 * @param {number} amount - Amount to validate
 * @returns {boolean}
 */
const isValidAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return false;
  if (amount <= 0) return false;
  if (amount > 999999999.99) return false;
  // Check decimal places (max 2 for currency)
  if ((amount * 100) % 1 !== 0) return false;
  return true;
};

module.exports = {
  isValidEmail,
  isValidName,
  isValidAmount
};
```

**Update File:** `backend/controllers/authController.js`

```javascript
const { isValidEmail, isValidName } = require("../utils/validation");  // ADD THIS

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, cnic, clinicName, city } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required."
      });
    }

    if (!isValidEmail(email)) {  // ADD THIS
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    if (!isValidName(name)) {  // ADD THIS
      return res.status(400).json({
        success: false,
        message: "Name must be 1-100 characters."
      });
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // ... rest of function ...
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration."
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    if (!isValidEmail(email)) {  // ADD THIS
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    // ... rest of function ...
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login."
    });
  }
};
```

---

### Fix 8: XSS Prevention with DOMPurify

**Install:** `npm install dompurify`

**File to Update:** `frontend/src/components/TransferModal.js`

```javascript
import React, { useState } from "react";
import DOMPurify from "dompurify";  // ADD THIS
import { transferFunds } from "../services/walletService";

function TransferModal({ currentBalance, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [equipment, setEquipment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransfer = async () => {
    setError("");
    setSuccess("");

    const parsedAmount = parseFloat(amount);

    // Sanitize inputs
    const sanitizedUserId = DOMPurify.sanitize(toUserId.trim());  // ADD THIS
    const sanitizedEquipment = DOMPurify.sanitize(equipment.trim());  // ADD THIS

    if (!sanitizedUserId) {
      setError("Enter the recipient wallet ID.");
      return;
    }

    if (!sanitizedEquipment) {
      setError("Please specify the equipment for this payment.");
      return;
    }

    if (!amount || isNaN(parsedAmount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (parsedAmount <= 0) {
      setError("Transfer amount must be greater than 0.");
      return;
    }

    if (parsedAmount > currentBalance) {
      setError(`Cannot transfer more than $${currentBalance.toFixed(2)}.`);
      return;
    }

    setLoading(true);

    try {
      // Use sanitized values
      const data = await transferFunds(sanitizedUserId, parsedAmount, sanitizedEquipment);
      if (data.success) {
        setSuccess(`✓ Sent $${parsedAmount.toFixed(2)} for ${sanitizedEquipment}!`);
        setTimeout(() => {
          onSuccess(data.wallet);
          onClose();
        }, 1200);
      } else {
        setError(data.message || "Transfer failed. Please try again.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Network error. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component ...
};
```

---

### Fix 9: Add Role-Based Route Protection

**File to Update:** `frontend/src/components/ProtectedRoute.js`

```javascript
import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getCurrentUser } from "../controller/authController";

/**
 * ProtectedRoute - Protects routes that require authentication
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string} requiredRole - Optional role requirement (e.g., 'admin')
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = getToken();
  const user = getCurrentUser();

  // Not logged in - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but doesn't have required role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

**Update File:** `frontend/src/App.js`

```javascript
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import WalletDashboard from "./pages/WalletDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import TransactionsPage from "./pages/TransactionsPage";
import ExpensesPage from "./pages/ExpensesPage";
import BudgetPage from "./pages/BudgetPage";
import AdminDashboard from "./pages/admin";
import LandingPage from "./components/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function AppContent() {
  const location = useLocation();
  const hiddenPaths = ["/", "/login", "/register"];
  const showNavbar = !hiddenPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <WalletDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/wallet" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">  {/* ADD ROLE CHECK */}
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div style={styles.notFound}>
              <h1>CAMERA MEIN DEKH KY HATH HILA DAIN PLEASE - :)</h1>
              <Link to="/" style={styles.homeLink}>
                WAPIS AAIN
              </Link>
            </div>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// ... rest of file ...
```

---

### Fix 10: Add React Error Boundary

**File to Create:** `frontend/src/components/ErrorBoundary.js`

```javascript
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // In production, you could log this to an error reporting service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#0f172a",
            color: "#f8fafc",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            ⚠️ Something Went Wrong
          </h1>
          <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre
              style={{
                background: "#1f2937",
                padding: "1rem",
                borderRadius: "8px",
                maxWidth: "600px",
                textAlign: "left",
                overflow: "auto",
                marginBottom: "1rem",
              }}
            >
              {this.state.error?.toString()}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#4b5563",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Update File:** `frontend/src/App.js`

```javascript
import ErrorBoundary from "./components/ErrorBoundary";  // ADD THIS

function App() {
  return (
    <ErrorBoundary>  {/* WRAP ROUTER */}
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}
```

---

## MEDIUM SEVERITY ISSUE FIXES

### Fix 11: Remove Hardcoded User IDs and Add Proper Authentication Check

**File to Update:** `backend/controllers/expenseController.js`

```javascript
exports.createExpense = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // CHANGE: Don't use fallback, return 401 if no user
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please log in."
      });
    }

    const { title, amount, category, paymentMethod, ownerId, date, notes } = req.body;

    // Validation
    if (!title || !amount || !category || !ownerId || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, amount, category, owner, and date are required",
      });
    }

    // ... rest of function ...
  } catch (err) {
    console.error("Create expense error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating expense",
    });
  }
};
```

Apply the same fix to all controllers that use `req.user?.id || "000000000000000000000000"`.

---

### Fix 12: Add Pagination to All List Endpoints

**File to Update:** `backend/controllers/expenseController.js`

```javascript
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Cannot retrieve expenses.",
      });
    }

    // ADD PAGINATION
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);  // Max 100 per page
    const skip = (page - 1) * limit;

    const { category, startDate, endDate } = req.query;

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
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Get expenses error:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving expenses",
    });
  }
};
```

---

## TESTING CHECKLIST

- [ ] Admin routes return 403 for non-admin users
- [ ] Wallet summary endpoint returns correct data
- [ ] Wallet transactions endpoint supports pagination
- [ ] Password with < 8 chars is rejected
- [ ] Password without uppercase is rejected
- [ ] Password without number is rejected
- [ ] CSRF tokens are generated and validated
- [ ] Regex injection attempt in search field is escaped
- [ ] Email validation rejects invalid formats
- [ ] Non-admin user cannot access /admin page
- [ ] Error boundary catches component errors
- [ ] Rate limiter allows max 5 auth attempts per 15 min
- [ ] Hardcoded user ID fallback returns 401
- [ ] Pagination works on all list endpoints
- [ ] Future-dated expenses are rejected

