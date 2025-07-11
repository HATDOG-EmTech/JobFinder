"use client"

import { useTheme } from "../App"
import React from "react"

function JobDetailsModal({ job, isOpen, onClose, onApply, isApplying, hasApplied }) {
  const { isDark } = useTheme()

  // Handle escape key to close modal
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  // Add event listener for escape key
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Don't render if modal is not open or no job is selected
  if (!isOpen || !job) return null

  // Dark theme colors - consistent with FindJobsContent
  const colors = {
    background: isDark ? "#0f172a" : "#ffffff",
    cardBackground: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f8fafc" : "#0f172a",
    textSecondary: isDark ? "#cbd5e1" : "#64748b",
    textMuted: isDark ? "#94a3b8" : "#9ca3af",
    border: isDark ? "#334155" : "#e2e8f0",
    hover: isDark ? "#334155" : "#f8fafc",
    accent: "#3b82f6",
    success: "#10b981",
    overlay: isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)",
  }

  const typography = {
    modalTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      lineHeight: "1.3",
      letterSpacing: "-0.025em",
    },
    sectionTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      lineHeight: "1.3",
      letterSpacing: "-0.025em",
    },
    bodyText: {
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.6",
    },
    labelText: {
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.4",
    },
    buttonText: {
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.4",
    },
  }

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: colors.cardBackground,
      borderRadius: "16px",
      width: "100%",
      maxWidth: "800px",
      maxHeight: "90vh",
      overflow: "hidden",
      boxShadow: isDark ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      border: `1px solid ${colors.border}`,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      padding: "24px 32px",
      borderBottom: `1px solid ${colors.border}`,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "20px",
    },
    headerContent: {
      flex: 1,
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      color: colors.textMuted,
      cursor: "pointer",
      padding: "4px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
      flexShrink: 0,
    },
    closeButtonHover: {
      backgroundColor: colors.hover,
      color: colors.text,
    },
    content: {
      padding: "0 32px 32px 32px",
      overflowY: "auto",
      maxHeight: "calc(90vh - 140px)",
    },
    companyHeader: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "24px",
    },
    companyLogo: {
      width: "64px",
      height: "64px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      fontWeight: "700",
      color: "white",
      flexShrink: 0,
    },
    companyInfo: {
      flex: 1,
    },
    jobTitle: {
      ...typography.modalTitle,
      color: colors.text,
      margin: "0 0 8px 0",
    },
    company: {
      ...typography.bodyText,
      color: colors.textSecondary,
      margin: "0",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "32px",
      padding: "24px",
      backgroundColor: isDark ? "#334155" : "#f8fafc",
      borderRadius: "12px",
      border: `1px solid ${colors.border}`,
    },
    detailItem: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    detailLabel: {
      ...typography.labelText,
      color: colors.textMuted,
    },
    detailValue: {
      ...typography.bodyText,
      color: colors.text,
      fontWeight: "500",
    },
    section: {
      marginBottom: "32px",
    },
    sectionTitle: {
      ...typography.sectionTitle,
      color: colors.text,
      marginBottom: "16px",
      margin: "0 0 16px 0",
    },
    description: {
      ...typography.bodyText,
      color: colors.textSecondary,
      lineHeight: "1.7",
      whiteSpace: "pre-wrap",
    },
    actions: {
      display: "flex",
      gap: "12px",
      paddingTop: "24px",
      borderTop: `1px solid ${colors.border}`,
      justifyContent: "flex-end",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      ...typography.buttonText,
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    },
    primaryButton: {
      backgroundColor: colors.accent,
      color: "white",
    },
    primaryButtonHover: {
      backgroundColor: "#2563eb",
      transform: "translateY(-1px)",
    },
    primaryButtonDisabled: {
      backgroundColor: colors.textMuted,
      cursor: "not-allowed",
      transform: "none",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: colors.text,
      border: `1px solid ${colors.border}`,
    },
    secondaryButtonHover: {
      backgroundColor: colors.hover,
      borderColor: colors.accent,
    },
    appliedButton: {
      backgroundColor: colors.success,
      color: "white",
      cursor: "default",
    },
  }

  const companyColors = {
    TechCorp: "#3b82f6",
    DesignStudio: "#8b5cf6",
    "DataTech Inc": "#f59e0b",
    StartupXYZ: "#10b981",
    "Innovation Labs": "#ef4444",
    "Creative Agency": "#06b6d4",
    "Ortigas Land": "#3b82f6",
    "MPAD Corp": "#8b5cf6",
    "Makerlab PH": "#f59e0b",
    "Designify Studio": "#10b981",
    "InsightSphere Analytics": "#ef4444",
    "CloudNet Corp.": "#06b6d4",
    "TestPoint Solutions": "#3b82f6",
    "CodeCraft Labs": "#8b5cf6",
    "BrightIdeas PH": "#f59e0b",
    "Savyys Solutions Inc.": "#10b981",
    Tipas: "#ef4444",
    "Hub Tech": "#06b6d4",
  }

  const getCompanyInitial = (company) => {
    return company.charAt(0).toUpperCase()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatSalary = (min, max) => {
    return `₱${Number.parseFloat(min).toLocaleString()} - ₱${Number.parseFloat(max).toLocaleString()}`
  }

  // Get button text and style based on application status
  const getApplyButtonProps = () => {
    if (hasApplied) {
      return {
        text: "Applied ✓",
        style: modalStyles.appliedButton,
        disabled: true,
        onClick: null,
      }
    }

    if (isApplying) {
      return {
        text: "Applying...",
        style: modalStyles.primaryButtonDisabled,
        disabled: true,
        onClick: null,
      }
    }

    return {
      text: "Apply for this Job",
      style: modalStyles.primaryButton,
      disabled: false,
      onClick: () => onApply(job.id),
    }
  }

  const applyButtonProps = getApplyButtonProps()

  // Handle overlay click to close modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div style={modalStyles.overlay} onClick={handleOverlayClick}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <div style={modalStyles.headerContent}>
            <div style={modalStyles.companyHeader}>
              <div
                style={{
                  ...modalStyles.companyLogo,
                  backgroundColor: companyColors[job.job_company] || "#64748b",
                }}
              >
                {getCompanyInitial(job.job_company)}
              </div>
              <div style={modalStyles.companyInfo}>
                <h2 style={modalStyles.jobTitle}>{job.job_title}</h2>
                <p style={modalStyles.company}>{job.job_company}</p>
              </div>
            </div>
          </div>
          <button
            style={modalStyles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, modalStyles.closeButtonHover)
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, modalStyles.closeButton)
            }}
          >
            ×
          </button>
        </div>

        <div style={modalStyles.content}>
          {/* Job Details Grid */}
          <div style={modalStyles.detailsGrid}>
            <div style={modalStyles.detailItem}>
              <span style={modalStyles.detailLabel}>Location</span>
              <span style={modalStyles.detailValue}>{job.job_location}</span>
            </div>
            <div style={modalStyles.detailItem}>
              <span style={modalStyles.detailLabel}>Job Type</span>
              <span style={modalStyles.detailValue}>{job.job_type}</span>
            </div>
            <div style={modalStyles.detailItem}>
              <span style={modalStyles.detailLabel}>Work Setup</span>
              <span style={modalStyles.detailValue}>{job.job_setup}</span>
            </div>
            <div style={modalStyles.detailItem}>
              <span style={modalStyles.detailLabel}>Salary Range</span>
              <span style={modalStyles.detailValue}>{formatSalary(job.min_salary, job.max_salary)}</span>
            </div>
            <div style={modalStyles.detailItem}>
              <span style={modalStyles.detailLabel}>Posted Date</span>
              <span style={modalStyles.detailValue}>{formatDate(job.created_at)}</span>
            </div>
            <div style={modalStyles.detailItem}>
              <span style={modalStyles.detailLabel}>Status</span>
              <span style={modalStyles.detailValue}>{job.status || "Active"}</span>
            </div>
          </div>

          {/* Job Description */}
          <div style={modalStyles.section}>
            <h3 style={modalStyles.sectionTitle}>Job Description</h3>
            <div style={modalStyles.description}>{job.job_description}</div>
          </div>

          {/* Requirements (if available) */}
          {job.job_requirements && (
            <div style={modalStyles.section}>
              <h3 style={modalStyles.sectionTitle}>Requirements</h3>
              <div style={modalStyles.description}>{job.job_requirements}</div>
            </div>
          )}

          {/* Benefits (if available) */}
          {job.job_benefits && (
            <div style={modalStyles.section}>
              <h3 style={modalStyles.sectionTitle}>Benefits</h3>
              <div style={modalStyles.description}>{job.job_benefits}</div>
            </div>
          )}

          {/* Actions */}
          <div style={modalStyles.actions}>
            <button
              style={{
                ...modalStyles.button,
                ...modalStyles.secondaryButton,
              }}
              onClick={onClose}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, {
                  ...modalStyles.button,
                  ...modalStyles.secondaryButton,
                  ...modalStyles.secondaryButtonHover,
                })
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, {
                  ...modalStyles.button,
                  ...modalStyles.secondaryButton,
                })
              }}
            >
              Close
            </button>
            <button
              style={{
                ...modalStyles.button,
                ...applyButtonProps.style,
              }}
              onClick={applyButtonProps.onClick}
              disabled={applyButtonProps.disabled}
              onMouseEnter={(e) => {
                if (!applyButtonProps.disabled) {
                  Object.assign(e.target.style, {
                    ...modalStyles.button,
                    ...applyButtonProps.style,
                    ...modalStyles.primaryButtonHover,
                  })
                }
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, {
                  ...modalStyles.button,
                  ...applyButtonProps.style,
                })
              }}
            >
              {applyButtonProps.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsModal