import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../controller/authController";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand" onClick={closeMenu}>
          💳 MediLease
        </Link>

        <div className="navbar-menu">
          <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={toggleMenu}>
              Menu {isMenuOpen ? "▲" : "▼"}
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <Link
                  to="/dashboard"
                  className={`dropdown-item ${isActive("/dashboard")}`}
                  onClick={closeMenu}
                >
                  Wallet
                </Link>
                <Link
                  to="/profile"
                  className={`dropdown-item ${isActive("/profile")}`}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/transactions"
                  className={`dropdown-item ${isActive("/transactions")}`}
                  onClick={closeMenu}
                >
                  Transactions
                </Link>
                <Link
                  to="/expenses"
                  className={`dropdown-item ${isActive("/expenses")}`}
                  onClick={closeMenu}
                >
                  Expenses
                </Link>
                <Link
                  to="/budget"
                  className={`dropdown-item ${isActive("/budget")}`}
                  onClick={closeMenu}
                >
                  Budget
                </Link>
                <Link
                  to="/admin"
                  className={`dropdown-item ${isActive("/admin")}`}
                  onClick={closeMenu}
                >
                  Admin
                </Link>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item logout-btn"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
