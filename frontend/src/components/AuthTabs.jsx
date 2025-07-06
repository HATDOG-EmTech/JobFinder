"use client"

const AuthTabs = ({ activeTab, onSwitchToLogin, onSwitchToRegister }) => {
  // Unified typography system
  const typography = {
    tabText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
    },
  }

  return (
    <div className="auth-tabs">
      <button
        type="button"
        onClick={onSwitchToLogin}
        className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
        style={{
          ...typography.tabText,
          flex: 1,
          textAlign: "center",
          padding: "1.125rem",
          color: activeTab === "login" ? "#1e293b" : "#64748b",
          backgroundColor: activeTab === "login" ? "white" : "#f8fafc",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        Login
      </button>
      <button
        type="button"
        onClick={onSwitchToRegister}
        className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
        style={{
          ...typography.tabText,
          flex: 1,
          textAlign: "center",
          padding: "1.125rem",
          color: activeTab === "register" ? "#1e293b" : "#64748b",
          backgroundColor: activeTab === "register" ? "white" : "#f8fafc",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        Register
      </button>
    </div>
  )
}

export default AuthTabs
