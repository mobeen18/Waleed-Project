import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { getToken } from "./controller/authController";
import WalletDashboard from "./pages/WalletDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import TransactionsPage from "./pages/TransactionsPage";
import ExpensesPage from "./pages/ExpensesPage";
import AdminDashboard from "./pages/admin";

const RequireAuth = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<RequireAuth><WalletDashboard /></RequireAuth>} />
        <Route path="/wallet" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/transactions" element={<RequireAuth><TransactionsPage /></RequireAuth>} />
        <Route path="/expenses" element={<RequireAuth><ExpensesPage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="*"
          element={
            <div style={styles.notFound}>
              <h1>404 — Page not found</h1>
              <Link to="/" style={styles.homeLink}>
                Return to Home
              </Link>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

const styles = {
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "DM Mono, monospace",
    textAlign: "center",
    color: "#f5f0e8",
    background: "#0f1623",
    padding: "2rem",
  },
  homeLink: {
    marginTop: "20px",
    color: "#00bfff",
    textDecoration: "none",
    fontSize: "16px",
    padding: "10px 20px",
    border: "1px solid #00bfff",
    borderRadius: "4px",
  },
};

export default App;

