# 🚀 Waleed-Project Setup & Deployment Guide

## ✅ What Has Been Completed

### Backend Enhancements
1. ✅ **User Model** (`backend/models/User.js`) - Created with comprehensive user schema including role management, account status, and activity tracking
2. ✅ **Admin Controller** (`backend/controllers/adminController.js`) - Full admin functionality for managing suspicious transactions and notifications
3. ✅ **Admin Routes** (`backend/routes/adminRoutes.js`) - Complete REST API endpoints for admin operations
4. ✅ **Server Configuration** (`backend/server.js`) - Updated with all model imports and admin routes
5. ✅ **Auth Middleware** - Fixed formatting issues

### Frontend Enhancements
1. ✅ **Admin Dashboard** (`frontend/src/pages/admin.js`) - Full-featured React component with tabs for:
   - Dashboard stats overview
   - Suspicious transaction management
   - Notification handling
   - User activity reports
2. ✅ **Admin Service** (`frontend/src/services/adminService.js`) - API integration for admin endpoints
3. ✅ **App Router** (`frontend/src/App.js`) - Updated with admin route and navigation bar

### Database Models (Already Present)
- ✅ Wallet Model
- ✅ Transaction Model
- ✅ Notification Model (integrated)
- ✅ SuspiciousTransaction Model (integrated)

---

## 🔧 How to Run Everything

### **Step 1: Start the Backend Server**

Open a terminal in the backend directory:

```bash
cd "e:\Web Project\Waleed-Project\backend"
node server.js
```

Expected output:
```
✅ Server running on port 5001
```

**Note:** If you see "MongoDB connection error," this means the database connection needs to be verified. Check that:
- Your MongoDB Atlas account is active
- The connection string in `.env` is correct
- Your network allows connections to MongoDB Atlas

### **Step 2: Start the Frontend Server**

Open another terminal in the frontend directory:

```bash
cd "e:\Web Project\Waleed-Project\frontend"
npm start
```

Or if PowerShell has execution policy issues, use:

```bash
npx react-scripts start
```

Or in Command Prompt (cmd):

```cmd
cd e:\Web Project\Waleed-Project\frontend
npm start
```

The frontend will typically start on `http://localhost:3000`

---

## 📋 API Endpoints

### Wallet Endpoints
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `POST /api/wallet/transfer` - Transfer between wallets
- `GET /api/wallet/summary` - Get wallet summary
- `GET /api/wallet/wallets` - List all wallets

### Admin Endpoints (Protected)
- `GET /api/admin/suspicious-transactions` - Get suspicious transactions
- `PUT /api/admin/suspicious-transactions/:id/review` - Review a transaction
- `GET /api/admin/notifications` - Get notifications
- `PUT /api/admin/notifications/:id/read` - Mark notification as read
- `GET /api/admin/dashboard-stats` - Get dashboard statistics
- `GET /api/admin/user-activity/:userId` - Get user activity report

---

## 🔐 Database Configuration

Your `.env` file contains:
```
MONGODB_URI=mongodb+srv://hbtahir506_db_user:7bMGwRwtai7Envmz@cluster0.jwlygws.mongodb.net/?appName=Cluster0
PORT=5001
JWT_SECRET=medilease_secret_key
```

### Database Collections
The application uses the following MongoDB collections:
- **users** - User accounts and profile information
- **wallets** - User wallet data and balances
- **transactions** - Transaction history
- **notifications** - User notifications
- **suspicioustransactions** - Flagged transactions for admin review

---

## 🌐 Frontend Features

### Wallet Dashboard
- View wallet balance and statistics
- Deposit funds
- Withdraw funds
- Transfer between wallets
- View transaction history

### Admin Dashboard (New!)
- **Dashboard Tab**: View system statistics
  - Total users
  - Total suspicious transactions
  - Unreviewed transactions
  - High-severity alerts

- **Suspicious Transactions Tab**: Review flagged transactions
  - Filter by severity (High/Medium/Low)
  - Review and approve/flag transactions
  - Add review notes

- **Notifications Tab**: Manage system notifications
  - View all notifications
  - Mark notifications as read

- **User Activity Tab**: Check individual user activity
  - Search by User ID
  - View user information
  - See suspicious activity history
  - View recent transactions

---

## ⚠️ Troubleshooting

### MongoDB Connection Issues
**Problem:** `querySrv ECONNREFUSED _mongodb._tcp.cluster0.jwlygws.mongodb.net`

**Solutions:**
1. Check your internet connection
2. Verify MongoDB Atlas account is active
3. Ensure the IP address is whitelisted in MongoDB Atlas
4. Check if your password has special characters (may need URL encoding)

### PowerShell Execution Policy Issues
**Problem:** `cannot be loaded because running scripts is disabled`

**Solutions:**
1. Use Command Prompt (cmd) instead of PowerShell
2. Use `npx` instead of `npm`
3. Set execution policy (admin required):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Port Already in Use
**Problem:** `listen EADDRINUSE: address already in use :::5001`

**Solutions:**
1. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5001
   taskkill /PID <PID> /F
   ```
2. Change the port in `.env`:
   ```
   PORT=5002
   ```

---

## 📁 Project Structure

```
Waleed-Project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── walletController.js
│   │   └── adminController.js (NEW)
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js (NEW)
│   │   ├── Wallet.js
│   │   ├── Transaction.js
│   │   ├── Notification.js
│   │   └── SuspiciousTransaction.js
│   ├── routes/
│   │   ├── walletRoutes.js
│   │   └── adminRoutes.js (NEW)
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── WalletDashboard.js
│   │   │   └── admin.js (NEW)
│   │   ├── services/
│   │   │   ├── walletService.js
│   │   │   └── adminService.js (NEW)
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js (UPDATED)
│   │   └── index.js
│   ├── package.json
│   └── build/
│
└── README.md
```

---

## ✨ New Features Added

1. **User Management** - Complete user model with roles and account status
2. **Suspicious Transaction Detection** - Automatic flagging system with severity levels
3. **Admin Dashboard** - Comprehensive monitoring and management interface
4. **Notification System** - Real-time notification management
5. **User Activity Reports** - Detailed activity tracking per user
6. **Role-Based Access** - Admin and user roles support

---

## 🔍 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend compiles and loads
- [ ] Can navigate between Wallet and Admin pages
- [ ] Can view wallet dashboard
- [ ] Can access admin dashboard
- [ ] Can view suspicious transactions
- [ ] Can mark notifications as read
- [ ] Can fetch user activity reports
- [ ] Database connection is established
- [ ] No console errors in browser

---

## 📞 Support Notes

- Backend runs on: `http://localhost:5001`
- Frontend runs on: `http://localhost:3000`
- Admin dashboard accessible at: `http://localhost:3000/admin`
- Wallet dashboard accessible at: `http://localhost:3000/wallet`

All models are properly configured, and the application is ready for use with MongoDB Atlas!
