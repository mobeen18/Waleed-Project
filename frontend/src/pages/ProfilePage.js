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
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
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
    setSaving(false);
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
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            <span style={styles.avatarText}>
              {user?.email ? user.email.charAt(0).toUpperCase() : "M"}
            </span>
          </div>
          <div style={styles.headerInfo}>
            <h1 style={styles.title}>Profile Settings</h1>
            <p style={styles.subtitle}>
              Manage your account information and preferences
            </p>
          </div>
        </div>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: message.includes("success")
                ? "#10b981"
                : "#ef4444",
            }}
          >
            <span style={styles.messageIcon}>
              {message.includes("success") ? "✓" : "⚠"}
            </span>
            {message}
          </div>
        )}

        {user ? (
          <div style={styles.content}>
            {/* Personal Information Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Personal Information</h2>
              <div style={styles.sectionContent}>
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div style={styles.fieldValue}>
                      {user.name || "Not provided"}
                    </div>
                  )}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Email Address</label>
                  <div style={styles.fieldValue}>{user.email}</div>
                  <span style={styles.fieldNote}>Email cannot be changed</span>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Account Type</label>
                  <div style={styles.fieldValue}>
                    <span style={styles.roleBadge}>
                      {user.role === "doctor" ? "👨‍⚕️ Doctor" : "👤 User"}
                    </span>
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div style={styles.fieldValue}>
                      {user.phone || "Not provided"}
                    </div>
                  )}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>CNIC</label>
                  {editing ? (
                    <input
                      type="text"
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Enter your CNIC"
                      maxLength="13"
                    />
                  ) : (
                    <div style={styles.fieldValue}>
                      {user.cnic || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Doctor-specific Information */}
            {user.role === "doctor" && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Professional Information</h2>
                <div style={styles.sectionContent}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Clinic Name</label>
                    {editing ? (
                      <input
                        type="text"
                        name="clinicName"
                        value={formData.clinicName}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter clinic name"
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {user.clinicName || "Not provided"}
                      </div>
                    )}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>City</label>
                    {editing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter city"
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {user.city || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Account Information</h2>
              <div style={styles.sectionContent}>
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Member Since</label>
                  <div style={styles.fieldValue}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Last Updated</label>
                  <div style={styles.fieldValue}>
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Never"}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actions}>
              {editing ? (
                <div style={styles.buttonGroup}>
                  <button
                    onClick={handleSave}
                    style={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span style={styles.buttonSpinner}></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    style={styles.cancelButton}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  style={styles.editButton}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👤</div>
            <h3 style={styles.emptyTitle}>No Profile Found</h3>
            <p style={styles.emptyText}>
              Unable to load your profile information at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f1623 0%, #1a2436 100%)",
    padding: "2rem 1rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "20px",
    border: "1px solid rgba(201, 168, 76, 0.1)",
    overflow: "hidden",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3)",
  },
  header: {
    background:
      "linear-gradient(135deg, rgba(201, 168, 76, 0.1) 0%, rgba(201, 168, 76, 0.05) 100%)",
    padding: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    borderBottom: "1px solid rgba(201, 168, 76, 0.1)",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c9a84c 0%, #e8c96b 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(201, 168, 76, 0.3)",
  },
  avatarText: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#0f1623",
    fontFamily: "'Playfair Display', serif",
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#f5f0e8",
    margin: "0 0 0.5rem 0",
    fontFamily: "'Playfair Display', serif",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "rgba(245, 240, 232, 0.7)",
    margin: 0,
    fontWeight: "400",
  },
  content: {
    padding: "2rem",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#f5f0e8",
    margin: "0 0 1.5rem 0",
    fontFamily: "'Playfair Display', serif",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  sectionContent: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "12px",
    padding: "1.5rem",
    border: "1px solid rgba(201, 168, 76, 0.08)",
  },
  fieldGroup: {
    marginBottom: "1.5rem",
  },
  fieldLabel: {
    display: "block",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#c9a84c",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontFamily: "'DM Mono', monospace",
  },
  fieldValue: {
    fontSize: "1rem",
    color: "#f5f0e8",
    fontWeight: "400",
    lineHeight: "1.5",
  },
  fieldNote: {
    display: "block",
    fontSize: "0.8rem",
    color: "rgba(245, 240, 232, 0.5)",
    marginTop: "0.25rem",
    fontStyle: "italic",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "rgba(26, 36, 54, 0.8)",
    border: "2px solid rgba(201, 168, 76, 0.2)",
    borderRadius: "8px",
    color: "#f5f0e8",
    fontSize: "1rem",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.3s ease",
    outline: "none",
  },
  roleBadge: {
    background: "linear-gradient(135deg, #c9a84c 0%, #e8c96b 100%)",
    color: "#0f1623",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    fontFamily: "'DM Mono', monospace",
    display: "inline-block",
  },
  actions: {
    padding: "2rem 0 0 0",
    borderTop: "1px solid rgba(201, 168, 76, 0.1)",
    marginTop: "2rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  editButton: {
    background: "linear-gradient(135deg, #c9a84c 0%, #e8c96b 100%)",
    color: "#0f1623",
    border: "none",
    borderRadius: "10px",
    padding: "0.875rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 15px rgba(201, 168, 76, 0.3)",
  },
  saveButton: {
    background: "linear-gradient(135deg, #4caf82 0%, #66bb6a 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "0.875rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 15px rgba(76, 175, 130, 0.3)",
  },
  cancelButton: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#f5f0e8",
    border: "2px solid rgba(201, 168, 76, 0.3)",
    borderRadius: "10px",
    padding: "0.875rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'DM Sans', sans-serif",
  },
  message: {
    padding: "1rem 1.5rem",
    borderRadius: "10px",
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  messageIcon: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  loadingCard: {
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "20px",
    border: "1px solid rgba(201, 168, 76, 0.1)",
    padding: "3rem",
    textAlign: "center",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3)",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(201, 168, 76, 0.2)",
    borderTop: "3px solid #c9a84c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 1rem auto",
  },
  loadingText: {
    color: "#f5f0e8",
    fontSize: "1.1rem",
    fontWeight: "500",
    margin: 0,
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    color: "#f5f0e8",
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: "0 0 0.5rem 0",
    fontFamily: "'Playfair Display', serif",
  },
  emptyText: {
    color: "rgba(245, 240, 232, 0.7)",
    fontSize: "1rem",
    margin: 0,
  },
  buttonSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
if (styleSheet) {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

export default ProfilePage;
