"use client"

import { useState } from "react"
import Tips from "./Tips"
import { useTheme } from "../App"
import { jobAPI } from "../api/auth"

function PostJobContent() {
  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobCompany: "",
    jobLocation: "",
    jobSetup: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    jobDescription: "",
    jobRequirements: "",
    jobBenefits: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
    labelText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    inputText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.4",
    },
    buttonText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    bodyText: {
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.5",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      lineHeight: "1.3",
    },
  }

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
    accent: "#3b82f6",
    success: "#10b981",
    error: "#ef4444",
  }

  const postJobStyles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0 24px",
    },
    header: {
      marginBottom: "40px",
    },
    title: {
      ...typography.pageTitle,
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
      ...typography.pageSubtitle,
      color: colors.textSecondary,
      margin: "0",
    },
    mainContent: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: "32px",
    },
    sidebar: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "32px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      height: "fit-content",
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
      ...typography.labelText,
      color: colors.text,
      marginBottom: "10px",
    },
    input: {
      padding: "14px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.inputText,
      outline: "none",
      boxShadow: "none",
      transition: "border-color 0.2s ease",
      fontFamily: "inherit",
      backgroundColor: colors.input,
      color: colors.text,
    },
    textarea: {
      padding: "14px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.inputText,
      outline: "none",
      boxShadow: "none",
      resize: "vertical",
      minHeight: "120px",
      fontFamily: "inherit",
      lineHeight: "1.6",
      backgroundColor: colors.input,
      color: colors.text,
    },
    select: {
      padding: "14px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.inputText,
      outline: "none",
      boxShadow: "none",
      backgroundColor: colors.input,
      color: colors.text,
      cursor: "pointer",
      fontFamily: "inherit",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      ...typography.buttonText,
      cursor: "pointer",
      border: "none",
      outline: "none",
      boxShadow: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    alert: {
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "24px",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    alertSuccess: {
      backgroundColor: isDark ? "#064e3b" : "#d1fae5",
      color: isDark ? "#10b981" : "#065f46",
      border: `1px solid ${isDark ? "#10b981" : "#a7f3d0"}`,
    },
    alertError: {
      backgroundColor: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#ef4444" : "#991b1b",
      border: `1px solid ${isDark ? "#ef4444" : "#fca5a5"}`,
    },
  }

  const handleInputChange = (field, value) => {
    setJobData((prev) => ({ ...prev, [field]: value }))
    // Clear messages when user starts typing
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handlePublishJob = async () => {
    // Validate required fields
    const requiredFields = [
      "jobTitle",
      "jobCompany",
      "jobLocation",
      "jobSetup",
      "jobType",
      "minSalary",
      "maxSalary",
      "jobDescription",
      "jobRequirements",
    ]

    const missingFields = requiredFields.filter((field) => !jobData[field].trim())

    if (missingFields.length > 0) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Format data exactly as Django JobSerializer expects
      const apiJobData = {
        job_title: jobData.jobTitle.trim(),
        job_company: jobData.jobCompany.trim(),
        job_location: jobData.jobLocation.trim(),
        job_setup: jobData.jobSetup,
        job_type: jobData.jobType,
        min_salary: jobData.minSalary.trim(), // Keep as string for Django serializer
        max_salary: jobData.maxSalary.trim(), // Keep as string for Django serializer
        job_description: jobData.jobDescription.trim(),
        job_requirements: jobData.jobRequirements.trim(),
        job_benefits: jobData.jobBenefits.trim() || "",
      }

      console.log("Sending job data to API:", apiJobData)

      const response = await jobAPI.createJob(apiJobData)

      setSuccess("Job posted successfully! Your job listing is now live.")

      // Clear all fields after successful posting
      setJobData({
        jobTitle: "",
        jobCompany: "",
        jobLocation: "",
        jobSetup: "",
        jobType: "",
        minSalary: "",
        maxSalary: "",
        jobDescription: "",
        jobRequirements: "",
        jobBenefits: "",
      })

      console.log("Job created successfully:", response)
    } catch (error) {
      console.error("Error creating job:", error)

      // Handle specific Django validation errors
      if (error.message.includes("Authentication required")) {
        setError("Please log in to post a job.")
      } else if (error.message.includes("Job title must be at least")) {
        setError("Job title must be at least 3 characters long.")
      } else if (error.message.includes("Company name must be at least")) {
        setError("Company name must be at least 2 characters long.")
      } else if (error.message.includes("salary")) {
        setError("Please enter valid salary amounts.")
      } else {
        setError(error.message || "Failed to post job. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const EditIcon = () => (
    <svg style={postJobStyles.titleIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <div style={postJobStyles.container}>
      <div style={postJobStyles.header}>
        <h1 style={postJobStyles.title}>
          <EditIcon />
          Post a New Job
        </h1>
        <p style={postJobStyles.subtitle}>Create and publish your job listing to attract top talent.</p>
      </div>

      <div style={postJobStyles.mainContent}>
        <div style={postJobStyles.card}>
          {/* Success/Error Messages */}
          {success && <div style={{ ...postJobStyles.alert, ...postJobStyles.alertSuccess }}>{success}</div>}

          {error && <div style={{ ...postJobStyles.alert, ...postJobStyles.alertError }}>{error}</div>}

          <div style={postJobStyles.formGrid}>
            <div style={postJobStyles.formGroup}>
              <label style={postJobStyles.label}>Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={jobData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                style={postJobStyles.input}
                maxLength="100"
                disabled={isLoading}
              />
            </div>

            <div style={postJobStyles.formGroup}>
              <label style={postJobStyles.label}>Company *</label>
              <input
                type="text"
                placeholder="e.g. TechCorp Inc."
                value={jobData.jobCompany}
                onChange={(e) => handleInputChange("jobCompany", e.target.value)}
                style={postJobStyles.input}
                maxLength="100"
                disabled={isLoading}
              />
            </div>

            <div style={postJobStyles.formGroup}>
              <label style={postJobStyles.label}>Location *</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={jobData.jobLocation}
                onChange={(e) => handleInputChange("jobLocation", e.target.value)}
                style={postJobStyles.input}
                maxLength="100"
                disabled={isLoading}
              />
            </div>

            <div style={postJobStyles.formGroup}>
              <label style={postJobStyles.label}>Work Setup *</label>
              <select
                value={jobData.jobSetup}
                onChange={(e) => handleInputChange("jobSetup", e.target.value)}
                style={postJobStyles.select}
                disabled={isLoading}
              >
                <option value="">Select work setup</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div style={postJobStyles.formGroup}>
              <label style={postJobStyles.label}>Job Type *</label>
              <select
                value={jobData.jobType}
                onChange={(e) => handleInputChange("jobType", e.target.value)}
                style={postJobStyles.select}
                disabled={isLoading}
              >
                <option value="">Select job type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div style={postJobStyles.formGroup}>
              <label style={postJobStyles.label}>Minimum Salary *</label>
              <input
                type="text"
                placeholder="e.g. ₱50,000"
                value={jobData.minSalary}
                onChange={(e) => handleInputChange("minSalary", e.target.value)}
                style={postJobStyles.input}
                maxLength="20"
                disabled={isLoading}
              />
            </div>

            <div style={postJobStyles.formGroup}>
              <label style={postJobStyles.label}>Maximum Salary *</label>
              <input
                type="text"
                placeholder="e.g. ₱80,000"
                value={jobData.maxSalary}
                onChange={(e) => handleInputChange("maxSalary", e.target.value)}
                style={postJobStyles.input}
                maxLength="20"
                disabled={isLoading}
              />
            </div>
          </div>

          <div style={postJobStyles.formGroupFull}>
            <label style={postJobStyles.label}>Job Description *</label>
            <textarea
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={jobData.jobDescription}
              onChange={(e) => handleInputChange("jobDescription", e.target.value)}
              style={postJobStyles.textarea}
              maxLength="1000"
              disabled={isLoading}
            />
            <div
              style={{
                fontSize: "0.75rem",
                color: colors.textMuted,
                textAlign: "right",
                marginTop: "4px",
              }}
            >
              {jobData.jobDescription.length}/1000 characters
            </div>
          </div>

          <div style={postJobStyles.formGroupFull}>
            <label style={postJobStyles.label}>Job Requirements *</label>
            <textarea
              placeholder="List the required qualifications, experience, and skills..."
              value={jobData.jobRequirements}
              onChange={(e) => handleInputChange("jobRequirements", e.target.value)}
              style={postJobStyles.textarea}
              maxLength="1000"
              disabled={isLoading}
            />
            <div
              style={{
                fontSize: "0.75rem",
                color: colors.textMuted,
                textAlign: "right",
                marginTop: "4px",
              }}
            >
              {jobData.jobRequirements.length}/1000 characters
            </div>
          </div>

          <div style={postJobStyles.formGroupFull}>
            <label style={postJobStyles.label}>Job Benefits (Optional)</label>
            <textarea
              placeholder="Health insurance, 401k, flexible hours, remote work..."
              value={jobData.jobBenefits}
              onChange={(e) => handleInputChange("jobBenefits", e.target.value)}
              style={postJobStyles.textarea}
              maxLength="1000"
              disabled={isLoading}
            />
            <div
              style={{
                fontSize: "0.75rem",
                color: colors.textMuted,
                textAlign: "right",
                marginTop: "4px",
              }}
            >
              {jobData.jobBenefits.length}/1000 characters
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "flex-end",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <button
              type="button"
              style={{
                ...postJobStyles.button,
                backgroundColor: isLoading ? colors.textMuted : colors.accent,
                color: "white",
                border: "none",
                padding: "12px 32px",
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onClick={handlePublishJob}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish Job"}
            </button>
          </div>
        </div>

        {/* Sidebar with Actions and Tips */}
        <div style={postJobStyles.sidebar}>
          <Tips />
        </div>
      </div>
    </div>
  )
}

export default PostJobContent