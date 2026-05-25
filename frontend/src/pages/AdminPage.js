import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getSuspiciousTransactions,
  reviewSuspiciousTransaction,
} from "../services/adminService";
import { getUsers, blockUser, unblockUser } from "../services/userService";

function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [suspicious, setSuspicious] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "suspicious") {
      loadSuspicious();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setMessage("Failed to load users.");
      }
    } catch (error) {
      setMessage("Error loading users.");
    }
    setLoading(false);
  };

  const loadSuspicious = async () => {
    setLoading(true);
    try {
      const response = await getSuspiciousTransactions();
      if (response.success) {
        setSuspicious(response.suspicious);
      } else {
        setMessage("Failed to load suspicious transactions.");
      }
    } catch (error) {
      setMessage("Error loading suspicious transactions.");
    }
    setLoading(false);
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const response = isBlocked
        ? await unblockUser(userId)
        : await blockUser(userId);
      if (response.success) {
        setUsers(users.map((u) => (u._id === userId ? response.user : u)));
        setMessage(`User ${isBlocked ? "unblocked" : "blocked"} successfully.`);
      } else {
        setMessage("Failed to update user.");
      }
    } catch (error) {
      setMessage("Error updating user.");
    }
  };

  const handleReviewTransaction = async (id, approved) => {
    try {
      const response = await reviewSuspiciousTransaction(id, {
        approved,
        reviewNote: approved ? "Approved" : "Rejected",
      });
      if (response.success) {
        setSuspicious(suspicious.filter((tx) => tx._id !== id));
        setMessage("Transaction reviewed successfully.");
      } else {
        setMessage("Failed to review transaction.");
      }
    } catch (error) {
      setMessage("Error reviewing transaction.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Panel</h1>
        <p style={styles.subtitle}>
          Admin tools, notifications, and system oversight.
        </p>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes("success") ? "#10b981" : "#ef4444",
            }}
          >
            {message}
          </p>
        )}

        <div style={styles.tabs}>
          <button
            style={
              activeTab === "users"
                ? { ...styles.tab, ...styles.activeTab }
                : styles.tab
            }
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
          <button
            style={
              activeTab === "suspicious"
                ? { ...styles.tab, ...styles.activeTab }
                : styles.tab
            }
            onClick={() => setActiveTab("suspicious")}
          >
            Suspicious Transactions
          </button>
        </div>

        {activeTab === "users" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Users</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} style={styles.tr}>
                        <td style={styles.td}>{user.name}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>{user.role}</td>
                        <td style={styles.td}>
                          <span
                            style={
                              user.blocked
                                ? styles.blockedBadge
                                : styles.activeBadge
                            }
                          >
                            {user.blocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() =>
                              handleBlockUser(user._id, user.blocked)
                            }
                            style={
                              user.blocked
                                ? styles.unblockButton
                                : styles.blockButton
                            }
                          >
                            {user.blocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "suspicious" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Suspicious Transactions</h2>
            {loading ? (
              <p>Loading...</p>
            ) : suspicious.length === 0 ? (
              <p>No suspicious transactions.</p>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Reason</th>
                      <th style={styles.th}>Severity</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suspicious.map((tx) => (
                      <tr key={tx._id} style={styles.tr}>
                        <td style={styles.td}>
                          {tx.userId?.name || "Unknown"}
                        </td>
                        <td style={styles.td}>{tx.reason}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.severityBadge,
                              background:
                                tx.severity === "high"
                                  ? "#ef4444"
                                  : tx.severity === "medium"
                                    ? "#f59e0b"
                                    : "#10b981",
                            }}
                          >
                            {tx.severity}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() =>
                              handleReviewTransaction(tx._id, true)
                            }
                            style={styles.approveButton}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleReviewTransaction(tx._id, false)
                            }
                            style={styles.rejectButton}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
  placeholder: {
    background: "#1f2937",
    padding: "1.5rem",
    borderRadius: "18px",
    marginBottom: "1.5rem",
  },
  tabs: {
    display: "flex",
    marginBottom: "1.5rem",
  },
  tab: {
    background: "#374151",
    color: "#f8fafc",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "6px 6px 0 0",
  },
  activeTab: {
    background: "#3b82f6",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    color: "#f8fafc",
    marginBottom: "1rem",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#1f2937",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    background: "#374151",
    color: "#f8fafc",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
  },
  tr: {
    borderBottom: "1px solid #374151",
  },
  td: {
    padding: "12px",
    color: "#f8fafc",
  },
  blockedBadge: {
    background: "#ef4444",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  activeBadge: {
    background: "#10b981",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  blockButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "5px",
  },
  unblockButton: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "5px",
  },
  approveButton: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "5px",
  },
  rejectButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  severityBadge: {
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  message: {
    marginBottom: "1rem",
    padding: "10px",
    borderRadius: "6px",
    background: "#1f2937",
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

export default AdminPage;
