"use client"
import { useState } from "react"
import { useTheme } from "../App"

function Header({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const { isDark } = useTheme()

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleLogout = () => {
    setShowDropdown(false)

    // Clear any stored user data
    localStorage.removeItem("rememberedEmail")
    localStorage.removeItem("loginAttempts")
    localStorage.removeItem("lockoutTime")

    // Call the parent logout handler
    if (onLogout) {
      onLogout()
    }
  }

  const getUserInitials = (name) => {
    if (!name) return "JD"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Dark theme colors
  const colors = {
    background: isDark ? "#1e293b" : "white",
    text: isDark ? "#f8fafc" : "#1e293b",
    textSecondary: isDark ? "#cbd5e1" : "#64748b",
    textMuted: isDark ? "#94a3b8" : "#9ca3af",
    border: isDark ? "#334155" : "#e2e8f0",
    input: isDark ? "#334155" : "white",
    inputBorder: isDark ? "#475569" : "#d1d5db",
    hover: isDark ? "#334155" : "#f1f5f9",
    dropdown: isDark ? "#1e293b" : "white",
    dropdownBorder: isDark ? "#334155" : "#e2e8f0",
  }

  const headerStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
    background: colors.background,
    borderBottom: `1px solid ${colors.border}`,
    position: "fixed",
    top: 0,
    left: "260px",
    right: 0,
    zIndex: 10,
    height: "73px",
  }

  const headerContentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 24px",
    height: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  }

  const headerRightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  }

  const notificationBtnStyle = {
    background: "none",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontSize: "18px",
    color: colors.textSecondary,
  }

  const profileBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "none",
    border: "none",
    padding: "6px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }

  const avatarStyle = {
    width: "36px",
    height: "36px",
    backgroundColor: "#3b82f6", // Fixed blue color that won't change on hover
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    flexShrink: 0, // Prevent shrinking
  }

  const userNameStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: colors.text,
  }

  const dropdownArrowStyle = {
    fontSize: "10px",
    color: colors.textSecondary,
    transition: "transform 0.2s ease",
  }

  const dropdownMenuStyle = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    background: colors.dropdown,
    border: `1px solid ${colors.dropdownBorder}`,
    borderRadius: "12px",
    boxShadow: isDark
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    minWidth: "200px",
    zIndex: 50,
  }

  const dropdownItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "14px 18px",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.text,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }

  return (
    <header style={headerStyle}>
      <div style={headerContentStyle}>
        {/* Right Side - Notifications and Profile */}
        <div style={headerRightStyle}>
          {/* Notification Bell */}
          <button
            style={notificationBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = colors.hover)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* User Profile Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={profileBtnStyle}
              onClick={toggleDropdown}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.hover
                // Ensure avatar keeps its blue background
                const avatar = e.currentTarget.querySelector(".user-avatar")
                if (avatar) {
                  avatar.style.backgroundColor = "#3b82f6"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                // Ensure avatar keeps its blue background
                const avatar = e.currentTarget.querySelector(".user-avatar")
                if (avatar) {
                  avatar.style.backgroundColor = "#3b82f6"
                }
              }}
            >
              <div className="user-avatar" style={avatarStyle}>
                {getUserInitials(user?.name || "John Doe")}
              </div>
              <span style={userNameStyle}>{user?.name || "John Doe"}</span>
              <span style={dropdownArrowStyle}>▼</span>
            </button>

            {showDropdown && (
              <div style={dropdownMenuStyle}>
                <button
                  style={dropdownItemStyle}
                  onClick={handleLogout}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = colors.hover)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
