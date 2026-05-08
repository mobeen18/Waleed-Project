import React from "react";

function ExpensesPage() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Expenses & Budget</h1>
        <p style={styles.subtitle}>Track spending categories, budgets, and recurring costs.</p>
        <div style={styles.placeholder}>
          <p>This section is reserved for expenses and budget management.</p>
          <p>Once your wallet is active, this page will display expense tracking tools.</p>
        </div>
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

export default ExpensesPage;
