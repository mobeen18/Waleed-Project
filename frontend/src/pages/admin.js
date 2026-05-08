import React, { useState, useEffect, useCallback } from "react";
import {
  getSuspiciousTransactions,
  reviewSuspiciousTransaction,
  getNotifications,
  markNotificationAsRead,
  getDashboardStats,
  getUserActivityReport,
} from "../services/adminService";
import "../styles/global.css";

function AdminDashboard() {
  // Dashboard Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Suspicious Transactions
  const [suspiciousTransactions, setSuspiciousTransactions] = useState([]);
  const [loadingSuspicious, setLoadingSuspicious] = useState(false);
  const [suspiciousFilter, setSuspiciousFilter] = useState("high");
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewNote, setReviewNote] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // User Activity Report
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userActivityReport, setUserActivityReport] = useState(null);
  const [loadingUserReport, setLoadingUserReport] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Error handling
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const data = await getDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard stats");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSuspiciousTransactions = useCallback(async () => {
    try {
      setLoadingSuspicious(true);
      const filters = {};
      if (suspiciousFilter !== "all") {
        filters.severity = suspiciousFilter;
      }
      filters.reviewed = "false";
      const data = await getSuspiciousTransactions(filters);
      if (data.success) {
        setSuspiciousTransactions(data.suspicious);
      }
    } catch (err) {
      console.error("Error fetching suspicious transactions:", err);
      setError("Failed to load suspicious transactions");
    } finally {
      setLoadingSuspicious(false);
    }
  }, [suspiciousFilter]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const data = await getNotifications();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch dashboard stats on mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Fetch suspicious transactions when filter changes
  useEffect(() => {
    if (activeTab === "suspicious") {
      fetchSuspiciousTransactions();
    }
  }, [activeTab, fetchSuspiciousTransactions]);

  // Fetch notifications when active tab changes
  useEffect(() => {
    if (activeTab === "notifications") {
      fetchNotifications();
    }
  }, [activeTab]);

  const handleReviewTransaction = async (transactionId, approved) => {
    try {
      const data = await reviewSuspiciousTransaction(transactionId, {
        reviewNote,
        approved,
      });
      if (data.success) {
        setReviewingId(null);
        setReviewNote("");
        fetchSuspiciousTransactions();
        alert(`Transaction ${approved ? "approved" : "flagged"} successfully`);
      }
    } catch (err) {
      console.error("Error reviewing transaction:", err);
      setError("Failed to review transaction");
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const data = await markNotificationAsRead(notificationId);
      if (data.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to update notification");
    }
  };

  const handleFetchUserReport = async () => {
    if (!selectedUserId) {
      setError("Please enter a user ID");
      return;
    }
    try {
      setLoadingUserReport(true);
      const data = await getUserActivityReport(selectedUserId);
      if (data.success) {
        setUserActivityReport(data);
        setError("");
      }
    } catch (err) {
      console.error("Error fetching user activity report:", err);
      setError("Failed to load user activity report");
    } finally {
      setLoadingUserReport(false);
    }
  };

  const severityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#ff6b6b";
      case "medium":
        return "#ffa500";
      case "low":
        return "#ffd700";
      default:
        return "#999";
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🛡️ Admin Dashboard</h1>
        <p>Monitor suspicious activities and manage notifications</p>
      </header>

      {error && (
        <div
          style={{
            background: "#ff6b6b",
            color: "white",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={styles.tabNavigation}>
        <button
          style={{
            ...styles.tabButton,
            borderBottom: activeTab === "dashboard" ? "2px solid #00bfff" : "none",
          }}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          style={{
            ...styles.tabButton,
            borderBottom: activeTab === "suspicious" ? "2px solid #00bfff" : "none",
          }}
          onClick={() => setActiveTab("suspicious")}
        >
          ⚠️ Suspicious Transactions
        </button>
        <button
          style={{
            ...styles.tabButton,
            borderBottom: activeTab === "notifications" ? "2px solid #00bfff" : "none",
          }}
          onClick={() => setActiveTab("notifications")}
        >
          🔔 Notifications
        </button>
        <button
          style={{
            ...styles.tabButton,
            borderBottom: activeTab === "userActivity" ? "2px solid #00bfff" : "none",
          }}
          onClick={() => setActiveTab("userActivity")}
        >
          👤 User Activity
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div style={styles.content}>
          {loadingStats ? (
            <p>Loading dashboard stats...</p>
          ) : stats ? (
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h3>👥 Total Users</h3>
                <p style={styles.statValue}>{stats.totalUsers}</p>
              </div>
              <div style={styles.statCard}>
                <h3>⚠️ Total Suspicious</h3>
                <p style={styles.statValue}>{stats.totalSuspiciousTransactions}</p>
              </div>
              <div style={styles.statCard}>
                <h3>📋 Unreviewed</h3>
                <p style={styles.statValue}>{stats.unreviewedTransactions}</p>
              </div>
              <div style={{ ...styles.statCard, background: "#ff6b6b" }}>
                <h3>🔴 High Severity</h3>
                <p style={styles.statValue}>{stats.highSeverityCount}</p>
              </div>
            </div>
          ) : (
            <p>Failed to load stats</p>
          )}
        </div>
      )}

      {/* Suspicious Transactions Tab */}
      {activeTab === "suspicious" && (
        <div style={styles.content}>
          <div style={styles.filterSection}>
            <label>
              Filter by Severity:
              <select
                value={suspiciousFilter}
                onChange={(e) => setSuspiciousFilter(e.target.value)}
                style={styles.select}
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>

          {loadingSuspicious ? (
            <p>Loading suspicious transactions...</p>
          ) : suspiciousTransactions.length > 0 ? (
            <div style={styles.transactionsList}>
              {suspiciousTransactions.map((tx) => (
                <div
                  key={tx._id}
                  style={{
                    ...styles.transactionCard,
                    borderLeft: `4px solid ${severityColor(tx.severity)}`,
                  }}
                >
                  <div style={styles.txHeader}>
                    <span style={styles.severity}>{tx.severity.toUpperCase()}</span>
                    <span style={styles.rule}>{tx.ruleTriggered}</span>
                  </div>
                  <p><strong>User:</strong> {tx.userId?.name || tx.userId?.email || "Unknown"}</p>
                  <p><strong>Reason:</strong> {tx.reason}</p>
                  <p><strong>Date:</strong> {new Date(tx.createdAt).toLocaleString()}</p>

                  {reviewingId === tx._id ? (
                    <div style={styles.reviewSection}>
                      <textarea
                        placeholder="Review note..."
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        style={styles.textarea}
                      />
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => handleReviewTransaction(tx._id, true)}
                          style={{ ...styles.button, background: "#00aa00" }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReviewTransaction(tx._id, false)}
                          style={{ ...styles.button, background: "#aa0000" }}
                        >
                          ✗ Flag
                        </button>
                        <button
                          onClick={() => {
                            setReviewingId(null);
                            setReviewNote("");
                          }}
                          style={styles.cancelButton}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReviewingId(tx._id)}
                      style={styles.reviewButton}
                    >
                      Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No suspicious transactions found</p>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div style={styles.content}>
          {loadingNotifications ? (
            <p>Loading notifications...</p>
          ) : notifications.length > 0 ? (
            <div style={styles.notificationsList}>
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  style={{
                    ...styles.notificationCard,
                    opacity: notif.isRead ? 0.7 : 1,
                  }}
                >
                  <div style={styles.notifHeader}>
                    <span style={styles.notifType}>{notif.type}</span>
                    {!notif.isRead && <span style={styles.unreadBadge}>NEW</span>}
                  </div>
                  <p>{notif.message}</p>
                  <p style={styles.notifDate}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      style={styles.markReadButton}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No notifications found</p>
          )}
        </div>
      )}

      {/* User Activity Tab */}
      {activeTab === "userActivity" && (
        <div style={styles.content}>
          <div style={styles.userActivityInput}>
            <input
              type="text"
              placeholder="Enter user ID"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={handleFetchUserReport}
              disabled={loadingUserReport}
              style={styles.fetchButton}
            >
              {loadingUserReport ? "Loading..." : "Fetch Report"}
            </button>
          </div>

          {userActivityReport && (
            <div style={styles.userReportContainer}>
              <h3>User: {userActivityReport.user.name || userActivityReport.user.email}</h3>
              <p>Email: {userActivityReport.user.email}</p>
              <p>
                Suspicious Activity Count:{" "}
                {userActivityReport.user.suspiciousActivityCount}
              </p>

              <h4>Recent Suspicious Transactions:</h4>
              {userActivityReport.suspiciousTransactions.length > 0 ? (
                userActivityReport.suspiciousTransactions.map((tx) => (
                  <div key={tx._id} style={styles.reportItem}>
                    <p><strong>Rule:</strong> {tx.ruleTriggered}</p>
                    <p><strong>Severity:</strong> {tx.severity}</p>
                    <p><strong>Reason:</strong> {tx.reason}</p>
                  </div>
                ))
              ) : (
                <p>No suspicious transactions</p>
              )}

              <h4>Recent Transactions:</h4>
              {userActivityReport.recentTransactions.length > 0 ? (
                userActivityReport.recentTransactions.map((tx) => (
                  <div key={tx._id} style={styles.reportItem}>
                    <p><strong>Type:</strong> {tx.type}</p>
                    <p><strong>Amount:</strong> ${tx.amount.toFixed(2)}</p>
                    <p><strong>Date:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p>No recent transactions</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    background: "#0f1623",
    color: "#f5f0e8",
    minHeight: "100vh",
    fontFamily: "DM Mono, monospace",
  },
  header: {
    marginBottom: "30px",
    borderBottom: "1px solid #333",
    paddingBottom: "20px",
  },
  tabNavigation: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    borderBottom: "1px solid #333",
    paddingBottom: "10px",
  },
  tabButton: {
    background: "transparent",
    color: "#f5f0e8",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
  },
  content: {
    animation: "fadeIn 0.3s ease-in",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "#1a2332",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#00bfff",
    margin: "10px 0 0",
  },
  filterSection: {
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  select: {
    background: "#1a2332",
    color: "#f5f0e8",
    border: "1px solid #333",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  transactionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  transactionCard: {
    background: "#1a2332",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "10px",
  },
  txHeader: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  severity: {
    background: "#ff6b6b",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  rule: {
    background: "#00bfff",
    color: "#0f1623",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  reviewSection: {
    marginTop: "15px",
    padding: "15px",
    background: "#0f1623",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    background: "#1a2332",
    color: "#f5f0e8",
    border: "1px solid #333",
    borderRadius: "4px",
    padding: "10px",
    fontFamily: "DM Mono, monospace",
    resize: "vertical",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontFamily: "DM Mono, monospace",
    fontSize: "12px",
    fontWeight: "bold",
  },
  reviewButton: {
    background: "#00bfff",
    color: "#0f1623",
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontFamily: "DM Mono, monospace",
    fontWeight: "bold",
  },
  cancelButton: {
    background: "#666",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontFamily: "DM Mono, monospace",
    fontSize: "12px",
  },
  notificationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  notificationCard: {
    background: "#1a2332",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "15px",
  },
  notifHeader: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
  },
  notifType: {
    background: "#00bfff",
    color: "#0f1623",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  unreadBadge: {
    background: "#ff6b6b",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "bold",
  },
  notifDate: {
    fontSize: "12px",
    color: "#999",
    marginTop: "5px",
  },
  markReadButton: {
    marginTop: "10px",
    background: "#00bfff",
    color: "#0f1623",
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontFamily: "DM Mono, monospace",
    fontSize: "12px",
    fontWeight: "bold",
  },
  userActivityInput: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    background: "#1a2332",
    color: "#f5f0e8",
    border: "1px solid #333",
    padding: "10px 12px",
    borderRadius: "4px",
    fontFamily: "DM Mono, monospace",
    fontSize: "14px",
  },
  fetchButton: {
    background: "#00bfff",
    color: "#0f1623",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "DM Mono, monospace",
    fontWeight: "bold",
  },
  userReportContainer: {
    background: "#1a2332",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "20px",
  },
  reportItem: {
    background: "#0f1623",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
    borderLeft: "2px solid #00bfff",
    paddingLeft: "15px",
  },
};

export default AdminDashboard;
