"use client"

import { useTheme } from "../App"

function Tips() {
  // Unified typography system
  const typography = {
    cardTitle: {
      fontSize: "1.25rem", // 20px
      fontWeight: "700",
      lineHeight: "1.3",
      letterSpacing: "-0.025em",
    },
    tipTitle: {
      fontSize: "0.875rem", // 14px
      fontWeight: "700",
      lineHeight: "1.4",
    },
    tipDescription: {
      fontSize: "0.875rem", // 14px
      fontWeight: "400",
      lineHeight: "1.5",
    },
  }

  const { isDark } = useTheme()

  // Dark theme colors
  const colors = {
    cardBackground: isDark ? "#1e293b" : "white",
    text: isDark ? "#f8fafc" : "#0f172a",
    textSecondary: isDark ? "#cbd5e1" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
  }

  const tipsStyles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "28px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      width: "320px",
      height: "fit-content",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "24px",
    },
    icon: {
      fontSize: "20px",
      color: "#f59e0b",
    },
    title: {
      ...typography.cardTitle,
      color: colors.text,
      margin: "0",
    },
    tipsList: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    tip: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    tipTitle: {
      ...typography.tipTitle,
      color: colors.text,
      margin: "0",
    },
    tipDescription: {
      ...typography.tipDescription,
      color: colors.textSecondary,
      margin: "0",
    },
  }

  const tips = [
    {
      title: "Write a clear job title",
      description: "Use specific, searchable job titles that candidates expect, experience and skills.",
    },
    {
      title: "Be specific about requirements",
      description: "Clearly outline must-have vs. nice-to-have qualifications to attract the right candidates.",
    },
    {
      title: "Highlight your company culture",
      description: "Include information about your work environment, values, and what makes your company unique.",
    },
    {
      title: "Include salary information",
      description: "Jobs with salary ranges get 30% more applications than those without.",
    },
  ]

  return (
    <div style={tipsStyles.container}>
      <div style={tipsStyles.header}>
        <span style={tipsStyles.icon}>💡</span>
        <h3 style={tipsStyles.title}>Tips</h3>
      </div>

      <div style={tipsStyles.tipsList}>
        {tips.map((tip, index) => (
          <div key={index} style={tipsStyles.tip}>
            <h4 style={tipsStyles.tipTitle}>{tip.title}</h4>
            <p style={tipsStyles.tipDescription}>{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tips
