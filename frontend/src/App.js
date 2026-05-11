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
            <ProtectedRoute>
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
