import React from "react";
import { getCurrentUser } from "../controller/authController";
import { Link } from "react-router-dom";

function ProfilePage() {
  const user = getCurrentUser();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>User Profile</h1>
        <p style={styles.subtitle}>Your account details are stored securely.</p>

        {user ? (
          <div style={styles.profileBox}>
            <div style={styles.row}>
              <span style={styles.label}>Name</span>
              <span>{user.name}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Email</span>
              <span>{user.email}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Role</span>
              <span>{user.role || "User"}</span>
            </div>
          </div>
        ) : (
          <p style={styles.message}>No profile information is available right now.</p>
        )}

        <Link to="/dashboard" style={styles.button}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    padding: "2rem",
    color: "#f8fafc",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#111827",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.4)",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "1.5rem",
  },
  profileBox: {
    display: "grid",
    gap: "1rem",
    marginBottom: "1.5rem",
    background: "#1f2937",
    padding: "1.5rem",
    borderRadius: "18px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
  },
  label: {
    color: "#94a3b8",
  },
  message: {
    marginBottom: "1.5rem",
    color: "#f8fafc",
  },
  button: {
    display: "inline-block",
    padding: "1rem 1.5rem",
    borderRadius: "14px",
    background: "#6366f1",
    color: "white",
    textDecoration: "none",
    fontWeight: "700",
  },
};

export default ProfilePage;
