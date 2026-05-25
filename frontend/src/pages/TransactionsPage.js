import React, { useState, useEffect } from "react";
import { getWalletSummary } from "../services/walletService";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await getWalletSummary();
      if (response.success) {
        setTransactions(response.recentTransactions || []);
      } else {
        setError("Failed to load transactions.");
      }
    } catch (err) {
      setError("Error loading transactions.");
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Transactions</h1>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Transactions</h1>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Transaction History</h1>
        <p style={styles.subtitle}>
          View recent wallet movements and transaction history.
        </p>

        {transactions.length === 0 ? (
          <p style={styles.placeholder}>No transactions found.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Details</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.typeBadge,
                          background:
                            tx.type === "DEPOSIT"
                              ? "#10b981"
                              : tx.type === "WITHDRAWAL"
                                ? "#ef4444"
                                : "#3b82f6",
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td style={styles.td}>${tx.amount.toFixed(2)}</td>
                    <td style={styles.td}>{tx.equipment || "N/A"}</td>
                    <td style={styles.td}>{formatDate(tx.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  typeBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
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

export default TransactionsPage;
