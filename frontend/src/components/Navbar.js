import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../controller/authController";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          💳 MediLease
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className={`nav-item ${isActive("/dashboard")}`}>
            Wallet
          </Link>
          <Link to="/profile" className={`nav-item ${isActive("/profile")}`}>
            Profile
          </Link>
          <Link to="/transactions" className={`nav-item ${isActive("/transactions")}`}>
            Transactions
          </Link>
          <Link to="/expenses" className={`nav-item ${isActive("/expenses")}`}>
            Expenses
          </Link>
          <Link to="/admin" className={`nav-item ${isActive("/admin")}`}>
            Admin
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
