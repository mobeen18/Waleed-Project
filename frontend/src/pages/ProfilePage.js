import React, { useState, useEffect } from "react";
import { getCurrentUser, updateProfile } from "../services/userService";
import { getToken } from "../controller/authController";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cnic: "",
    clinicName: "",
    city: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = getToken();
      if (!token) {
        setMessage("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.user);
        setFormData({
          name: response.user.name || "",
          phone: response.user.phone || "",
          cnic: response.user.cnic || "",
          clinicName: response.user.clinicName || "",
          city: response.user.city || "",
        });
      } else {
        setMessage("Failed to load profile.");
      }
    } catch (error) {
      setMessage("Error loading profile.");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setUser(response.user);
        setEditing(false);
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("Error updating profile.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      cnic: user.cnic || "",
      clinicName: user.clinicName || "",
      city: user.city || "",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>User Profile</h1>
        <p style={styles.subtitle}>Manage your account details securely.</p>

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

        {user ? (
          <div style={styles.profileBox}>
            <div style={styles.row}>
              <span style={styles.label}>Name</span>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              ) : (
                <span>{user.name}</span>
              )}
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Email</span>
              <span>{user.email}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Role</span>
              <span>{user.role || "User"}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Phone</span>
              {editing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              ) : (
                <span>{user.phone || "Not provided"}</span>
              )}
            </div>
            <div style={styles.row}>
              <span style={styles.label}>CNIC</span>
              {editing ? (
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              ) : (
                <span>{user.cnic || "Not provided"}</span>
              )}
            </div>
            {user.role === "doctor" && (
              <>
                <div style={styles.row}>
                  <span style={styles.label}>Clinic Name</span>
                  {editing ? (
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  ) : (
                    <span>{user.clinicName || "Not provided"}</span>
                  )}
                </div>
                <div style={styles.row}>
                  <span style={styles.label}>City</span>
                  {editing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  ) : (
                    <span>{user.city || "Not provided"}</span>
                  )}
                </div>
              </>
            )}
            <div style={styles.buttonRow}>
              {editing ? (
                <>
                  <button onClick={handleSave} style={styles.saveButton}>
                    Save
                  </button>
                  <button onClick={handleCancel} style={styles.cancelButton}>
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  style={styles.editButton}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        ) : (
          <p style={styles.message}>
            No profile information is available right now.
          </p>
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
  input: {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "6px",
    color: "#f8fafc",
    padding: "8px 12px",
    fontSize: "14px",
    width: "200px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  editButton: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  saveButton: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  cancelButton: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default ProfilePage;
