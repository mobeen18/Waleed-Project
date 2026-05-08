import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import WalletDashboard from "./pages/WalletDashboard";
import AdminDashboard from "./pages/admin";

function App() {
  return (
    <Router>
      <div style={styles.appContainer}>
        <nav style={styles.navbar}>
          <div style={styles.navContent}>
            <Link to="/" style={styles.navBrand}>
              💼 MediLease Wallet
            </Link>
            <div style={styles.navLinks}>
              <Link to="/wallet" style={styles.navLink}>
                Wallet
              </Link>
              <Link to="/admin" style={styles.navLink}>
                Admin
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          {/* Main wallet page */}
          <Route path="/wallet" element={<WalletDashboard />} />

          {/* Admin page */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Redirect root to /wallet */}
          <Route path="/" element={<Navigate to="/wallet" replace />} />

          {/* Catch-all for unknown routes */}
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
      </div>
    </Router>
  );
}

const styles = {
  appContainer: {
    minHeight: "100vh",
    background: "#0f1623",
    color: "#f5f0e8",
  },
  navbar: {
    background: "#1a2332",
    borderBottom: "2px solid #00bfff",
    padding: "15px 20px",
    marginBottom: "20px",
  },
  navContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBrand: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#00bfff",
    textDecoration: "none",
    fontFamily: "DM Mono, monospace",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navLink: {
    color: "#f5f0e8",
    textDecoration: "none",
    fontSize: "14px",
    fontFamily: "DM Mono, monospace",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "all 0.3s",
  },
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "DM Mono, monospace",
    textAlign: "center",
  },
  homeLink: {
    marginTop: "20px",
    color: "#00bfff",
    textDecoration: "none",
    fontSize: "16px",
    padding: "10px 20px",
    border: "1px solid #00bfff",
    borderRadius: "4px",
    transition: "all 0.3s",
  },
};

export default App;