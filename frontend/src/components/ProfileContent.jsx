"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../App"
import { authAPI } from "../api/auth"

function ProfileContent({ user }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    user_id: "",
    f_name: "",
    l_name: "",
    email: "",
    username: "",
    password: "",
    gender: "",
    mobile: "",
    location: "",
    user_title: "",
    bio: "",
    skills: "",
    linkedin: "",
    github: "",
    role: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching user profile...")

        const response = await authAPI.getCurrentUser()
        console.log("User profile response:", response)

        if (response) {
          const userData = response.data || response
          setProfileData({
            user_id: userData.user_id || userData.id || "",
            f_name: userData.f_name || userData.first_name || "",
            l_name: userData.l_name || userData.last_name || "",
            email: userData.email || "",
            username: userData.username || "",
            password: "",
            gender: userData.gender || "",
            mobile: userData.mobile || userData.phone || "",
            location: userData.location || "",
            user_title: userData.user_title || userData.title || "",
            bio: userData.bio || "",
            skills: userData.skills || "",
            linkedin: userData.linkedin || "",
            github: userData.github || "",
            role: userData.role || "Job Seeker",
          })
        }
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setError("Failed to load profile data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const { isDark } = useTheme()

  // Dark theme colors
  const colors = {
    background: isDark ? "#0f172a" : "#ffffff",
    cardBackground: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f8fafc" : "#0f172a",
    textSecondary: isDark ? "#cbd5e1" : "#64748b",
    textMuted: isDark ? "#94a3b8" : "#9ca3af",
    border: isDark ? "#334155" : "#e2e8f0",
    input: isDark ? "#334155" : "#ffffff",
    inputBorder: isDark ? "#475569" : "#d1d5db",
    inputDisabled: isDark ? "#1e293b" : "#f9fafb",
    accent: "#3b82f6",
    socialButtonHover: isDark ? "#475569" : "#e2e8f0",
  }

  const profileStyles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0 24px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "40px",
    },
    headerInfo: {
      flex: 1,
    },
    title: {
      fontSize: "2.25rem",
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
      color: colors.text,
      marginBottom: "12px",
      margin: "0 0 12px 0",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    titleIcon: {
      width: "32px",
      height: "32px",
      color: colors.accent,
    },
    subtitle: {
      fontSize: "1.125rem",
      fontWeight: "400",
      lineHeight: "1.6",
      color: colors.textSecondary,
      margin: "0",
    },
    actions: {
      display: "flex",
      gap: "14px",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.4",
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      outline: "none",
    },
    primaryButton: {
      backgroundColor: colors.accent,
      color: "white",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: colors.text,
      border: `1px solid ${colors.inputBorder}`,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "360px 1fr",
      gap: "32px",
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "32px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
    },
    profileCard: {
      textAlign: "center",
      height: "fit-content",
    },
    avatar: {
      width: "120px",
      height: "120px",
      backgroundColor: colors.accent,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "40px",
      fontWeight: "600",
      margin: "0 auto 24px",
      border: `4px solid ${isDark ? "#334155" : "#f8fafc"}`,
      boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    name: {
      fontSize: "1.375rem",
      fontWeight: "600",
      lineHeight: "1.3",
      color: colors.text,
      marginBottom: "8px",
    },
    jobTitle: {
      fontSize: "1rem",
      fontWeight: "400",
      lineHeight: "1.4",
      color: colors.textSecondary,
      marginBottom: "6px",
    },
    contactInfo: {
      textAlign: "left",
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.5",
      color: colors.textSecondary,
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "12px",
      padding: "8px 0",
    },
    contactIcon: {
      width: "20px",
      height: "20px",
      color: colors.textMuted,
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      lineHeight: "1.3",
      letterSpacing: "-0.025em",
      color: colors.text,
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      marginBottom: "24px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    formGroupFull: {
      display: "flex",
      flexDirection: "column",
      gridColumn: "1 / -1",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.4",
      color: colors.text,
      marginBottom: "10px",
    },
    input: {
      padding: "14px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.4",
      outline: "none",
      fontFamily: "inherit",
      transition: "border-color 0.2s ease",
      backgroundColor: colors.input,
      color: colors.text,
    },
    inputDisabled: {
      backgroundColor: colors.inputDisabled,
      color: colors.textMuted,
      cursor: "default",
    },
    select: {
      padding: "14px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.4",
      outline: "none",
      fontFamily: "inherit",
      transition: "border-color 0.2s ease",
      backgroundColor: colors.input,
      color: colors.text,
      cursor: "pointer",
    },
    selectDisabled: {
      backgroundColor: colors.inputDisabled,
      color: colors.textMuted,
      cursor: "default",
      pointerEvents: "none",
    },
    textarea: {
      padding: "14px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.6", // Keep this lineHeight
      outline: "none",
      resize: "vertical",
      minHeight: "120px",
      fontFamily: "inherit",
      transition: "border-color 0.2s ease",
      backgroundColor: colors.input,
      color: colors.text,
    },
    textareaDisabled: {
      backgroundColor: colors.inputDisabled,
      color: colors.textMuted,
      cursor: "default",
      resize: "none",
    },
    detailsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "28px",
    },
    editingNote: {
      backgroundColor: isDark ? "#1e40af20" : "#f0f9ff",
      border: `1px solid ${isDark ? "#3b82f6" : "#0ea5e9"}`,
      borderRadius: "8px",
      padding: "16px",
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.5",
      color: isDark ? "#93c5fd" : "#0369a1",
      marginBottom: "24px",
    },
    socialLinksContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "16px",
      marginTop: "24px",
    },
    socialButton: {
      backgroundColor: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: "8px",
      padding: "10px 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.4",
      color: colors.text,
      textDecoration: "none",
      transition: "background-color 0.2s ease, border-color 0.2s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    socialIcon: {
      width: "20px",
      height: "20px",
      color: colors.text,
    },
  }

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      console.log("Saving profile data:", profileData)

      const response = await authAPI.updateProfile(profileData)
      console.log("Profile update response:", response)

      setIsEditing(false)
      alert("Profile saved successfully!")
    } catch (err) {
      console.error("Error saving profile:", err)
      alert("Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const getUserInitials = (firstName, lastName) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
  }

  const UserIcon = () => (
    <svg style={profileStyles.titleIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const EmailIcon = () => (
    <svg style={profileStyles.contactIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const PhoneIcon = () => (
    <svg style={profileStyles.contactIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )

  const LocationIcon = () => (
    <svg style={profileStyles.contactIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const UserCircleIcon = () => (
    <svg style={profileStyles.contactIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const GitHubIcon = () => (
    <svg style={profileStyles.socialIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.2c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 0 0-1.33-1.75c-1.09-.75.08-.74.08-.74a2.51 2.51 0 0 1 1.83 1.23 2.54 2.54 0 0 0 3.48 1 2.55 2.55 0 0 1 .76-1.6c-2.67-.3-5.47-1.33-5.47-5.93a4.63 4.63 0 0 1 1.23-3.2 4.3 4.3 0 0 1 .12-3.15s1-.33 3.3 1.23a11.4 11.4 0 0 1 6 0c2.31-1.56 3.3-1.23 3.3-1.23a4.3 4.3 0 0 1 .12 3.15 4.63 4.63 0 0 1 1.23 3.2c0 4.61-2.81 5.62-5.49 5.92a2.85 2.85 0 0 1 .81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5z" />
    </svg>
  )

  const LinkedInIcon = () => (
    <svg style={profileStyles.socialIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6 1.12 6 0 4.88 0 3.5 0 2.12 1.12 1 2.49 1 3.87 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8.5 8h3.7v2.16h.05c.51-.96 1.76-2 3.63-2C20.92 8.16 22 10 22 13.23V24h-4v-9.23c0-2.2-.79-3.7-2.75-3.7-1.5 0-2.4 1-2.8 2-.14.33-.18.78-.18 1.23V24h-4V8z" />
    </svg>
  )

  return (
    <div style={profileStyles.container}>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            fontSize: "1.125rem",
            color: colors.textSecondary,
          }}
        >
          Loading profile...
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: isDark ? "#7f1d1d" : "#fef2f2",
            border: `1px solid ${isDark ? "#dc2626" : "#fca5a5"}`,
            borderRadius: "8px",
            padding: "16px",
            fontSize: "0.875rem",
            color: isDark ? "#fca5a5" : "#dc2626",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={profileStyles.header}>
            <div style={profileStyles.headerInfo}>
              <h1 style={profileStyles.title}>
                <UserIcon />
                Profile
              </h1>
              <p style={profileStyles.subtitle}>Manage your professional profile information.</p>
            </div>
            <div style={profileStyles.actions}>
              {isEditing ? (
                <>
                  <button style={{ ...profileStyles.button, ...profileStyles.secondaryButton }} onClick={handleCancel}>
                    Cancel
                  </button>
                  <button style={{ ...profileStyles.button, ...profileStyles.primaryButton }} onClick={handleSave}>
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  style={{ ...profileStyles.button, ...profileStyles.primaryButton }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {isEditing && (
            <div style={profileStyles.editingNote}>
              <strong>Edit Mode:</strong> Update your profile information below.
            </div>
          )}

          <div style={profileStyles.grid}>
            {/* Profile Overview (Left Column) */}
            <div style={{ ...profileStyles.card, ...profileStyles.profileCard }}>
              <div style={profileStyles.avatar}>{getUserInitials(profileData.f_name, profileData.l_name)}</div>

              <h2 style={profileStyles.name}>
                {profileData.f_name} {profileData.l_name}
              </h2>
              <p style={profileStyles.jobTitle}>{profileData.user_title}</p>

              <div style={profileStyles.contactInfo}>
                <div style={profileStyles.contactItem}>
                  <EmailIcon />
                  <span>{profileData.email}</span>
                </div>
                <div style={profileStyles.contactItem}>
                  <PhoneIcon />
                  <span>{profileData.mobile}</span>
                </div>
                <div style={profileStyles.contactItem}>
                  <LocationIcon />
                  <span>{profileData.location}</span>
                </div>
                <div style={profileStyles.contactItem}>
                  <UserCircleIcon />
                  <span>@{profileData.username}</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div style={profileStyles.socialLinksContainer}>
                {isEditing ? (
                  <>
                    <div style={profileStyles.formGroup}>
                      <label style={profileStyles.label}>GitHub URL</label>
                      <input
                        type="url"
                        value={profileData.github}
                        onChange={(e) => handleInputChange("github", e.target.value)}
                        style={profileStyles.input}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div style={profileStyles.formGroup}>
                      <label style={profileStyles.label}>LinkedIn URL</label>
                      <input
                        type="url"
                        value={profileData.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        style={profileStyles.input}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {profileData.github && (
                      <a
                        href={profileData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={profileStyles.socialButton}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.socialButtonHover
                          e.target.style.borderColor = colors.accent
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = colors.cardBackground
                          e.target.style.borderColor = colors.border
                        }}
                      >
                        <GitHubIcon /> GitHub
                      </a>
                    )}
                    {profileData.linkedin && (
                      <a
                        href={profileData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={profileStyles.socialButton}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.socialButtonHover
                          e.target.style.borderColor = colors.accent
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = colors.cardBackground
                          e.target.style.borderColor = colors.border
                        }}
                      >
                        <LinkedInIcon /> LinkedIn
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Profile Details (Right Column) */}
            <div style={profileStyles.detailsContainer}>
              <div style={profileStyles.card}>
                <h3 style={profileStyles.sectionTitle}>Profile Information</h3>
                <div style={profileStyles.formGrid}>
                  <div style={profileStyles.formGroup}>
                    <label style={profileStyles.label}>First Name</label>
                    <input
                      type="text"
                      value={profileData.f_name}
                      onChange={(e) => handleInputChange("f_name", e.target.value)}
                      style={{
                        ...profileStyles.input,
                        ...(isEditing ? {} : profileStyles.inputDisabled),
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div style={profileStyles.formGroup}>
                    <label style={profileStyles.label}>Last Name</label>
                    <input
                      type="text"
                      value={profileData.l_name}
                      onChange={(e) => handleInputChange("l_name", e.target.value)}
                      style={{
                        ...profileStyles.input,
                        ...(isEditing ? {} : profileStyles.inputDisabled),
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div style={profileStyles.formGroup}>
                    <label style={profileStyles.label}>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      style={{
                        ...profileStyles.input,
                        ...(isEditing ? {} : profileStyles.inputDisabled),
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div style={profileStyles.formGroup}>
                    <label style={profileStyles.label}>Username</label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      style={{
                        ...profileStyles.input,
                        ...(isEditing ? {} : profileStyles.inputDisabled),
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div style={profileStyles.formGroup}>
                    <label style={profileStyles.label}>Mobile</label>
                    <input
                      type="tel"
                      value={profileData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      style={{
                        ...profileStyles.input,
                        ...(isEditing ? {} : profileStyles.inputDisabled),
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div style={profileStyles.formGroup}>
                    <label style={profileStyles.label}>Gender</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      style={{
                        ...profileStyles.select,
                        ...(isEditing ? {} : profileStyles.selectDisabled),
                      }}
                      disabled={!isEditing}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div style={profileStyles.formGroupFull}>
                    <label style={profileStyles.label}>Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      style={{
                        ...profileStyles.input,
                        ...(isEditing ? {} : profileStyles.inputDisabled),
                      }}
                      placeholder="City, State/Country"
                      disabled={!isEditing}
                    />
                  </div>
                  <div style={profileStyles.formGroupFull}>
                    <label style={profileStyles.label}>Job Title</label>
                    <input
                      type="text"
                      value={profileData.user_title}
                      onChange={(e) => handleInputChange("user_title", e.target.value)}
                      style={{
                        ...profileStyles.input,
                        ...(isEditing ? {} : profileStyles.inputDisabled),
                      }}
                      placeholder="e.g. Senior Software Engineer"
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing && (
                    <div style={profileStyles.formGroup}>
                      <label style={profileStyles.label}>New Password</label>
                      <input
                        type="password"
                        value={profileData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        style={profileStyles.input}
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                  )}
                  <div style={profileStyles.formGroupFull}>
                    <label style={profileStyles.label}>Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      style={{
                        ...profileStyles.textarea,
                        ...(isEditing ? {} : profileStyles.textareaDisabled),
                      }}
                      placeholder="Tell us about yourself, your experience, and what you're looking for..."
                      disabled={!isEditing}
                    />
                  </div>
                  <div style={profileStyles.formGroupFull}>
                    <label style={profileStyles.label}>Skills</label>
                    <textarea
                      value={profileData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      style={{
                        ...profileStyles.textarea,
                        ...(isEditing ? {} : profileStyles.textareaDisabled),
                      }}
                      placeholder="List your skills separated by commas (e.g. JavaScript, React, Node.js, Python)"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileContent