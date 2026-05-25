import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../controller/authController";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await register({ name, email, password });
      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Register error:", err);

      if (err.code === "ECONNREFUSED") {
        setError("Backend server is not running. Please try again later.");
      } else if (err.response?.status === 404) {
        setError(
          "Backend API endpoint not found. Please check server configuration.",
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === "Network Error") {
        setError(
          "Network error. Check your internet connection and backend server.",
        );
      } else {
        setError(
          "Unable to connect to the server. Please check your connection.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register and start managing your MediLease wallet.</p>

        {error && <div style={styles.error}>{error}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
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
    padding: "2rem",
    background: "#0f172a",
    color: "#f8fafc",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#111827",
    borderRadius: "24px",
    padding: "2.5rem",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.4)",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    marginBottom: "1.5rem",
    color: "#94a3b8",
  },
  form: {
    display: "grid",
    gap: "1rem",
  },
  input: {
    width: "100%",
    padding: "1rem",
    borderRadius: "14px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "1rem",
  },
  button: {
    padding: "1rem",
    borderRadius: "14px",
    border: "none",
    background: "#6366f1",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },
  footerText: {
    marginTop: "1.25rem",
    textAlign: "center",
    color: "#94a3b8",
  },
  link: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "700",
  },
  error: {
    marginBottom: "1rem",
    padding: "1rem",
    borderRadius: "14px",
    background: "#7f1d1d",
    color: "#f8d7da",
  },
};

export default RegisterPage;
