import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.logo}>
          MEDIL<span style={{ color: "#6366f1" }}>EASE</span>
        </div>
        <div style={styles.navLinks}>
          <button onClick={() => navigate("/")} style={styles.navBtn}>
            Home
          </button>
          <button onClick={() => navigate("/login")} style={styles.navBtn}>
            Login
          </button>
          <button onClick={() => navigate("/register")} style={styles.ctaBtn}>
            Get Started
          </button>
        </div>
      </nav>

      <main style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>
            Finance management <br />
            made <span style={styles.gradientText}>effortless.</span>
          </h1>
          <p style={styles.subtitle}>
            Secure, fast, and transparent leasing solutions for the modern
            professional.
          </p>
          <div style={styles.buttonGroup}>
            <button
              onClick={() => navigate("/register")}
              style={styles.primaryBtn}
            >
              Start for free
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
        <div style={styles.featureGrid}>
          <div style={styles.card}>
            <h3>Secure</h3>
            <p>End-to-end encryption for every transaction.</p>
          </div>
          <div style={styles.card}>
            <h3>Fast</h3>
            <p>Instant approval on lease applications.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    color: "#f8fafc",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1.5rem 5rem",
    alignItems: "center",
    borderBottom: "1px solid #1e293b",
  },
  logo: { fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-1px" },
  navLinks: { display: "flex", gap: "2rem", alignItems: "center" },
  navBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "1rem",
  },
  ctaBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#6366f1",
    color: "white",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
  hero: {
    padding: "5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  title: { fontSize: "4.5rem", lineHeight: "1.1", marginBottom: "1.5rem" },
  gradientText: { color: "#818cf8" },
  subtitle: {
    fontSize: "1.25rem",
    color: "#94a3b8",
    maxWidth: "600px",
    marginBottom: "2.5rem",
  },
  buttonGroup: { display: "flex", gap: "1rem", justifyContent: "center" },
  primaryBtn: {
    padding: "1rem 2rem",
    backgroundColor: "#6366f1",
    color: "white",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "1rem 2rem",
    backgroundColor: "#1e293b",
    color: "white",
    borderRadius: "12px",
    border: "1px solid #334155",
    fontWeight: "600",
    cursor: "pointer",
  },
  featureGrid: { display: "flex", gap: "2rem", marginTop: "5rem", flexWrap: "wrap", justifyContent: "center" },
  card: {
    padding: "2rem",
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    width: "250px",
    textAlign: "left",
    border: "1px solid #334155",
  },
};

export default LandingPage;
