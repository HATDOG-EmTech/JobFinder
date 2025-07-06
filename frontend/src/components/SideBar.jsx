"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../App"

const navigation = [
  { name: "Dashboard", icon: "/Icons/home-icon-black.svg", path: "/dashboard" },
  { name: "Find Jobs", icon: "/Icons/search-icon-black.svg", path: "/dashboard/find-jobs" },
  { name: "Post Job", icon: "/Icons/add-icon-black.svg", path: "/dashboard/post-job" },
  { name: "My Applications", icon: "/Icons/description-icon-black.svg", path: "/dashboard/applications" },
  { name: "Profile", icon: "/Icons/profile-icon-black.svg", path: "/dashboard/profile" },
  { name: "Settings", icon: "/Icons/settings-icon-black.svg", path: "/dashboard/settings" },
]

function Sidebar({ activePage }) {
  const [hoveredItem, setHoveredItem] = React.useState(null)
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const handleItemClick = (path) => {
    navigate(path)
  }

  // Dark theme colors
  const colors = {
    background: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f8fafc" : "#1e293b",
    textSecondary: isDark ? "#cbd5e1" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
    hover: isDark ? "#334155" : "#f8fafc",
    active: "#3b82f6",
    activeHover: isDark ? "#2563eb" : "#1d4ed8",
  }

  const sidebarStyles = {
    sidebar: {
      width: "260px",
      height: "100vh",
      backgroundColor: colors.background,
      borderRight: `1px solid ${colors.border}`,
      position: "fixed",
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      zIndex: 20,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      padding: "28px 24px",
      borderBottom: `1px solid ${colors.border}`,
      display: "flex",
      alignItems: "center",
      gap: "14px",
      cursor: "pointer",
    },
    logo: {
      width: "48px",
      height: "40px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
    },
    logoText: {
      fontSize: "1.375rem",
      fontWeight: "700",
      color: colors.text,
      letterSpacing: "-0.025em",
    },
    nav: {
      padding: "28px 20px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    navItem: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "14px 18px",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "15px",
      fontWeight: "600",
      color: colors.textSecondary,
      backgroundColor: "transparent",
      border: "none",
      width: "100%",
      textAlign: "left",
    },
    navItemActive: {
      backgroundColor: colors.active,
      color: "white",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    navItemHover: {
      backgroundColor: colors.hover,
      color: colors.text,
    },
    navIcon: {
      width: "24px",
      height: "24px",
      flexShrink: 0,
      filter: "none",
    },
    navIconActive: {
      filter: "brightness(0) invert(1)",
    },
    navIconDark: {
      filter: isDark ? "brightness(0) invert(1)" : "none",
    },
  }

  const getItemStyle = (itemName) => {
    const isActive = activePage === itemName
    const isHovered = hoveredItem === itemName && !isActive

    return {
      ...sidebarStyles.navItem,
      ...(isActive ? sidebarStyles.navItemActive : {}),
      ...(isHovered ? sidebarStyles.navItemHover : {}),
    }
  }

  const getIconStyle = (itemName) => {
    const isActive = activePage === itemName

    return {
      ...sidebarStyles.navIcon,
      ...(isActive ? sidebarStyles.navIconActive : sidebarStyles.navIconDark),
    }
  }

  return (
    <div style={sidebarStyles.sidebar}>
      {/* Header */}
      <div style={sidebarStyles.header} onClick={() => navigate("/dashboard")}>
        <div>
          <img
            src={isDark ? "/Logo/JOB FINDER-dark[1].PNG" : "/Logo/JOB FINDER [1]-10.png"}
            alt="sidebar logo"
            style={sidebarStyles.logo}
          />
        </div>
        <span style={sidebarStyles.logoText}>JobFinder</span>
      </div>

      {/* Navigation */}
      <nav style={sidebarStyles.nav}>
        {navigation.map((item) => (
          <button
            key={item.name}
            style={getItemStyle(item.name)}
            onClick={() => handleItemClick(item.path)}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img src={item.icon || "/placeholder.svg"} alt={item.name} style={getIconStyle(item.name)} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
