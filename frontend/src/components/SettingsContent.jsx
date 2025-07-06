"use client"

import { useState } from "react"
import { useTheme } from "../App"
import { authAPI } from "../api/auth"

function SettingsContent() {
  const { theme, setTheme, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState("Preferences")

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem("rememberedEmail")
    localStorage.removeItem("loginAttempts")
    localStorage.removeItem("lockoutTime")

    // Redirect to login page by reloading the app
    window.location.reload()
  }

  // Unified typography system
  const typography = {
    pageTitle: {
      fontSize: "2.25rem", // 36px
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
    },
    pageSubtitle: {
      fontSize: "1.125rem", // 18px
      fontWeight: "400",
      lineHeight: "1.6",
    },
    sectionTitle: {
      fontSize: "1.25rem", // 20px
      fontWeight: "600",
      lineHeight: "1.3",
      letterSpacing: "-0.025em",
    },
    subsectionTitle: {
      fontSize: "1rem", // 16px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    settingTitle: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.4",
    },
    settingDescription: {
      fontSize: "0.875rem", // 14px
      fontWeight: "400",
      lineHeight: "1.5",
    },
    bodyText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "400",
      lineHeight: "1.5",
    },
    smallText: {
      fontSize: "0.75rem", // 12px
      fontWeight: "400",
      lineHeight: "1.4",
    },
    buttonText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.4",
    },
    tabText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.4",
    },
    inputText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "400",
      lineHeight: "1.4",
    },
    labelText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.4",
    },
  }

  // Dark theme colors
  const colors = {
    background: isDark ? "#0f172a" : "#ffffff",
    cardBackground: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f8fafc" : "#0f172a",
    textSecondary: isDark ? "#cbd5e1" : "#64748b",
    textMuted: isDark ? "#94a3b8" : "#9ca3af",
    border: isDark ? "#334155" : "#e2e8f0",
    borderLight: isDark ? "#475569" : "#f1f5f9",
    input: isDark ? "#334155" : "#ffffff",
    inputBorder: isDark ? "#475569" : "#d1d5db",
    inputDisabled: isDark ? "#1e293b" : "#f9fafb",
    hover: isDark ? "#334155" : "#f8fafc",
    accent: "#3b82f6",
    danger: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  }

  // Using standard layout measurements with unified typography and dark theme
  const layoutStyles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0 24px",
    },
    pageHeader: {
      marginBottom: "40px",
    },
    titleIcon: {
      width: "32px",
      height: "32px",
      color: colors.accent,
    },
    pageTitle: {
      ...typography.pageTitle,
      color: colors.text,
      marginBottom: "12px",
      margin: "0 0 12px 0",
    },
    pageSubtitle: {
      ...typography.pageSubtitle,
      color: colors.textSecondary,
      margin: "0",
    },
    tabsContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "8px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      marginBottom: "32px",
    },
    tabs: {
      display: "flex",
      gap: "4px",
    },
    tab: {
      flex: 1,
      padding: "14px 20px",
      borderRadius: "8px",
      ...typography.tabText,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
      border: "none",
      backgroundColor: "transparent",
      color: colors.textSecondary,
      fontFamily: "inherit",
      outline: "none",
      boxShadow: "none",
    },
    activeTab: {
      backgroundColor: colors.accent,
      color: "white",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    contentCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "32px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
    },
    section: {
      marginBottom: "40px",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    sectionHeaderLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    sectionIcon: {
      fontSize: "20px",
      color: colors.textSecondary,
    },
    sectionTitle: {
      ...typography.sectionTitle,
      color: colors.text,
      margin: "0",
    },
    subsectionTitle: {
      ...typography.subsectionTitle,
      color: colors.text,
      marginBottom: "16px",
    },
    themeGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      marginBottom: "32px",
    },
    themeOption: {
      padding: "20px",
      borderRadius: "8px",
      border: `2px solid ${colors.border}`,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
      backgroundColor: colors.cardBackground,
      fontFamily: "inherit",
      outline: "none !important",
      boxShadow: "none !important",
      WebkitTapHighlightColor: "transparent",
    },
    selectedTheme: {
      borderColor: colors.accent,
      backgroundColor: isDark ? "#1e40af20" : "#f8fafc",
    },
    themeIcon: {
      fontSize: "24px",
      marginBottom: "8px",
      display: "block",
      color: colors.text,
    },
    themeLabel: {
      ...typography.settingTitle,
      color: colors.text,
      margin: "0",
    },
    settingItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "20px 0",
      borderBottom: `1px solid ${colors.borderLight}`,
    },
    lastSettingItem: {
      borderBottom: "none",
    },
    settingInfo: {
      flex: 1,
      marginRight: "20px",
    },
    settingTitle: {
      ...typography.settingTitle,
      color: colors.text,
      marginBottom: "4px",
      margin: "0 0 4px 0",
    },
    settingDescription: {
      ...typography.settingDescription,
      color: colors.textSecondary,
      margin: "0",
    },
    toggle: {
      width: "48px",
      height: "24px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
      position: "relative",
      flexShrink: 0,
      outline: "none",
      boxShadow: "none",
    },
    toggleActive: {
      backgroundColor: colors.accent,
    },
    toggleInactive: {
      backgroundColor: colors.textMuted,
    },
    toggleKnob: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "white",
      position: "absolute",
      top: "2px",
      transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    select: {
      padding: "12px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.inputText,
      outline: "none",
      backgroundColor: colors.input,
      color: colors.text,
      cursor: "pointer",
      fontFamily: "inherit",
      width: "100%",
      maxWidth: "300px",
      transition: "border-color 0.2s ease",
    },
    input: {
      padding: "12px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.inputText,
      outline: "none",
      fontFamily: "inherit",
      backgroundColor: colors.input,
      color: colors.text,
      width: "100%",
      maxWidth: "300px",
      transition: "border-color 0.2s ease",
    },
    inputReadOnly: {
      backgroundColor: colors.inputDisabled,
      color: colors.textMuted,
      cursor: "default",
      border: `1px solid ${colors.borderLight}`,
    },
    selectReadOnly: {
      backgroundColor: colors.inputDisabled,
      color: colors.textMuted,
      cursor: "default",
      border: `1px solid ${colors.borderLight}`,
      pointerEvents: "none",
    },
    label: {
      ...typography.labelText,
      color: colors.text,
      marginBottom: "8px",
      display: "block",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      ...typography.buttonText,
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      outline: "none",
      boxShadow: "none",
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
    dangerButton: {
      backgroundColor: colors.danger,
      color: "white",
    },
    editButton: {
      backgroundColor: "transparent",
      color: colors.accent,
      border: `1px solid ${colors.accent}`,
      padding: "8px 16px",
      fontSize: "0.875rem",
      fontWeight: "500",
      outline: "none",
      boxShadow: "none",
    },
    dangerZone: {
      backgroundColor: isDark ? "#7f1d1d20" : "#fef2f2",
      border: `1px solid ${isDark ? "#dc2626" : "#fecaca"}`,
      borderRadius: "8px",
      padding: "24px",
      marginTop: "40px",
    },
    dangerTitle: {
      ...typography.subsectionTitle,
      color: colors.danger,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    dangerDescription: {
      ...typography.bodyText,
      color: isDark ? "#fca5a5" : "#7f1d1d",
      marginBottom: "16px",
    },
    editModeActions: {
      display: "flex",
      gap: "16px",
      justifyContent: "flex-end",
      marginTop: "24px",
      paddingTop: "24px",
      borderTop: `1px solid ${colors.borderLight}`,
    },
  }

  const tabs = ["Preferences", "Security"]

  const themeOptions = [
    {
      name: "Light",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
          <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      name: "Dark",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      name: "System",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
  ]

  const Toggle = ({ isActive, onClick }) => (
    <button
      style={{
        ...layoutStyles.toggle,
        ...(isActive ? layoutStyles.toggleActive : layoutStyles.toggleInactive),
      }}
      onClick={onClick}
    >
      <div
        style={{
          ...layoutStyles.toggleKnob,
          left: isActive ? "26px" : "2px",
        }}
      />
    </button>
  )

  const SettingsIcon = () => (
    <svg style={layoutStyles.titleIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.02A1.65 1.65 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.02a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.02a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const renderPreferencesContent = () => (
    <div>
      <div style={layoutStyles.section}>
        <div style={layoutStyles.sectionHeader}>
          <div style={layoutStyles.sectionHeaderLeft}>
            <h3 style={layoutStyles.sectionTitle}>Appearance</h3>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h4 style={layoutStyles.label}>Theme</h4>
          <div style={layoutStyles.themeGrid}>
            {themeOptions.map((themeOption) => (
              <button
                key={themeOption.name}
                style={{
                  ...layoutStyles.themeOption,
                  ...(theme === themeOption.name ? layoutStyles.selectedTheme : {}),
                }}
                onClick={() => setTheme(themeOption.name)}
                onFocus={(e) => {
                  e.target.style.outline = "none"
                  e.target.style.boxShadow = "none"
                }}
                onBlur={(e) => {
                  e.target.style.outline = "none"
                  e.target.style.boxShadow = "none"
                }}
              >
                <span style={layoutStyles.themeIcon}>{themeOption.icon}</span>
                <p style={layoutStyles.themeLabel}>{themeOption.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div style={layoutStyles.section}>
          <div style={layoutStyles.sectionHeader}>
            <div style={layoutStyles.sectionHeaderLeft}>
              <h3 style={layoutStyles.sectionTitle}>Notifications</h3>
            </div>
          </div>

          <div style={layoutStyles.settingItem}>
            <div style={layoutStyles.settingInfo}>
              <h4 style={layoutStyles.settingTitle}>Email Notifications</h4>
              <p style={layoutStyles.settingDescription}>Receive email updates about job applications and messages</p>
            </div>
            <Toggle isActive={true} onClick={() => {}} />
          </div>

          <div style={layoutStyles.settingItem}>
            <div style={layoutStyles.settingInfo}>
              <h4 style={layoutStyles.settingTitle}>Push Notifications</h4>
              <p style={layoutStyles.settingDescription}>Get instant notifications on your device</p>
            </div>
            <Toggle isActive={false} onClick={() => {}} />
          </div>

          <div style={{ ...layoutStyles.settingItem, ...layoutStyles.lastSettingItem }}>
            <div style={layoutStyles.settingInfo}>
              <h4 style={layoutStyles.settingTitle}>Marketing Emails</h4>
              <p style={layoutStyles.settingDescription}>Receive updates about new features and job market insights</p>
            </div>
            <Toggle isActive={true} onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    // Reset message
    setPasswordMessage("")

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage("All password fields are required")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters long")
      return
    }

    try {
      setPasswordLoading(true)

      // Call API to change password
      await authAPI.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      })

      setPasswordMessage("Password updated successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Password change error:", error)
      setPasswordMessage(error.message || "Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const renderSecurityContent = () => (
    <div>
      <div style={layoutStyles.sectionHeader}>
        <div style={layoutStyles.sectionHeaderLeft}>
          <h3 style={layoutStyles.sectionTitle}>Password & Security</h3>
        </div>
      </div>

      <form onSubmit={handlePasswordChange} style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={layoutStyles.label}>Current Password</label>
          <input
            type="password"
            placeholder="Enter current password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
            style={layoutStyles.input}
            disabled={passwordLoading}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={layoutStyles.label}>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
            style={layoutStyles.input}
            disabled={passwordLoading}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={layoutStyles.label}>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            style={layoutStyles.input}
            disabled={passwordLoading}
          />
        </div>

        {passwordMessage && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              backgroundColor: passwordMessage.includes("successfully") ? colors.success + "20" : colors.danger + "20",
              color: passwordMessage.includes("successfully") ? colors.success : colors.danger,
              border: `1px solid ${passwordMessage.includes("successfully") ? colors.success : colors.danger}`,
              fontSize: "0.875rem",
            }}
          >
            {passwordMessage}
          </div>
        )}

        <button
          type="submit"
          style={{
            ...layoutStyles.button,
            ...layoutStyles.primaryButton,
            opacity: passwordLoading ? 0.6 : 1,
            cursor: passwordLoading ? "not-allowed" : "pointer",
          }}
          disabled={passwordLoading}
        >
          {passwordLoading ? "Updating..." : "Update Password"}
        </button>
      </form>

      <button
        style={{
          ...layoutStyles.button,
          backgroundColor: colors.input,
          color: colors.text,
          border: `1px solid ${colors.inputBorder}`,
        }}
        onClick={handleLogout}
      >
        Sign Out
      </button>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "Preferences":
        return renderPreferencesContent()
      case "Security":
        return renderSecurityContent()
      default:
        return renderPreferencesContent()
    }
  }

  return (
    <div style={layoutStyles.container}>
      <div style={layoutStyles.pageHeader}>
        <h1 style={layoutStyles.pageTitle}>
          <SettingsIcon /> Settings
        </h1>
        <p style={layoutStyles.pageSubtitle}>Manage your account preferences and privacy settings</p>
      </div>

      <div style={layoutStyles.tabsContainer}>
        <div style={layoutStyles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              style={{
                ...layoutStyles.tab,
                ...(activeTab === tab ? layoutStyles.activeTab : {}),
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={layoutStyles.contentCard}>{renderTabContent()}</div>
    </div>
  )
}

export default SettingsContent