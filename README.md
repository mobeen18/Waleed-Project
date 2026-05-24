# Medilease - Wallet & Expense Management System

## 🚀 Live Deployment

- **Backend**: https://waleed-project-production.up.railway.app
- **Frontend**: https://medilease.vercel.app

## 📋 Project Structure

```
├── backend/               # Express.js + MongoDB backend
│   ├── config/           # Database and configuration
│   ├── controllers/       # Business logic
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication and utilities
│   └── server.js         # Main server file
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── config/       # API configuration
│   │   ├── utils/        # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   └── controller/   # Auth controller
│   ├── .env              # Development environment variables
│   ├── .env.production   # Production environment variables
│   └── vercel.json       # Vercel deployment config
│
└── DEPLOYMENT_CHECKLIST.md  # Complete troubleshooting guide
```

## 🛠️ Backend Setup (Railway)

### Prerequisites
- Node.js >= 14
- MongoDB Atlas account
- Railway account

### Environment Variables
Set these in Railway dashboard:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
PORT=8080
FRONTEND_URL=https://medilease.vercel.app
```

### Deploy
```bash
cd backend
npm install
npm start
```

## 💻 Frontend Setup (Vercel)

### Prerequisites
- Node.js >= 14
- Vercel account
- GitHub account

### Environment Variables
Development (`.env`):
```
REACT_APP_API_URL=https://waleed-project-production.up.railway.app/api
```

Production (`.env.production`):
```
REACT_APP_API_URL=https://waleed-project-production.up.railway.app/api
```

### Local Development
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Build
```bash
npm run build
# Creates optimized production build
```

### Deploy to Vercel
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Vercel will automatically deploy on push

## 🔗 API Configuration

The frontend uses a centralized API instance (`src/config/api.js`) that:
- Uses environment variables for dynamic URL configuration
- Includes request/response logging
- Handles CORS automatically
- Supports authentication headers
- Has built-in error handling

### API Services

| Service | Purpose |
|---------|---------|
| `authService` | User authentication (login/register) |
| `walletService` | Wallet operations (deposit, withdraw, transfer) |
| `expenseServices` | Expense tracking |
| `budgetServices` | Budget management |
| `adminService` | Admin dashboard and suspicious transaction monitoring |
| `userService` | User profile management |

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Authorization header: `Bearer {token}`
- CORS credentials enabled for secure requests

## 🚨 Troubleshooting

### "Unable to connect to the server" Error

1. **Check Backend URL**
   ```bash
   curl https://waleed-project-production.up.railway.app/api/health
   ```
   Should return: `{"success":true,"message":"Server is running"...}`

2. **Check Environment Variables**
   - Verify `.env` and `.env.production` have correct API URL
   - For Vercel: Check environment variables in project settings

3. **Check Browser Console**
   - Open DevTools (F12)
   - Check Network tab for API requests
   - Look for CORS errors

4. **Clear Cache**
   ```javascript
   // Run in browser console
   localStorage.clear()
   location.reload()
   ```

### CORS Errors

If you see "blocked by CORS":
- Backend CORS is configured for `https://medilease.vercel.app`
- Check that FRONTEND_URL is set in Railway
- Verify request origin matches CORS whitelist

### Build Failures

- Delete `node_modules` and reinstall: `npm install`
- Clear npm cache: `npm cache clean --force`
- Check for syntax errors in modified files

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Wallet
- `GET /api/wallet/summary` - Get wallet summary
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `POST /api/wallet/transfer` - Transfer to another user
- `GET /api/wallet/transactions` - Get transaction history

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - List expenses
- `GET /api/expenses/summary/monthly` - Monthly summary
- `GET /api/expenses/summary/category` - Category summary

### Budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets` - List budgets
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget

### Admin
- `GET /api/admin/suspicious-transactions` - List suspicious transactions
- `PUT /api/admin/suspicious-transactions/{id}/review` - Review transaction
- `GET /api/admin/dashboard-stats` - Dashboard statistics

## 🎯 Features

✅ User Authentication (JWT)
✅ Wallet Management (Deposit, Withdraw, Transfer)
✅ Expense Tracking
✅ Budget Management
✅ Admin Dashboard
✅ Suspicious Transaction Monitoring
✅ Transaction History
✅ User Profiles

## 📝 License

MIT
