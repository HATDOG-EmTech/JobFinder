"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../api/auth"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1) // 1: Enter email/username, 2: Enter new password

  // Unified typography system
  const typography = {
    logoText: {
      fontSize: "1.5rem",
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
    },
    authTitle: {
      fontSize: "1.875rem",
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
    },
    authSubtitle: {
      fontSize: "1rem",
      fontWeight: "500",
      lineHeight: "1.5",
    },
    labelText: {
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.4",
    },
    inputText: {
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.4",
    },
    buttonText: {
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.4",
    },
    linkText: {
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.4",
    },
    bodyText: {
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.5",
    },
    errorText: {
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.4",
    },
  }

  const forgotPasswordStyles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      maxWidth: "500px",
      margin: "0 auto",
      padding: "2rem 1rem",
      minHeight: "100vh",
      justifyContent: "center",
    },
    authCard: {
      width: "100%",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
    },
    logoContainer: {
      display: "flex",
      flexDirection: "row",
      gap: "0.75rem",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 2rem 1rem 2rem",
      borderBottom: "1px solid #f1f5f9",
    },
    logo: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    },
    logoImg: {
      width: "40px",
      height: "32px",
    },
    logoText: {
      ...typography.logoText,
      color: "#1e293b",
    },
    formContainer: {
      padding: "2rem",
    },
    title: {
      ...typography.authTitle,
      color: "#1e293b",
      marginBottom: "0.75rem",
      textAlign: "center",
    },
    subtitle: {
      ...typography.authSubtitle,
      color: "#64748b",
      marginBottom: "2rem",
      textAlign: "center",
    },
    alertBox: {
      borderRadius: "12px",
      padding: "1rem",
      marginBottom: "1.5rem",
      ...typography.bodyText,
    },
    errorAlert: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#dc2626",
    },
    infoAlert: {
      backgroundColor: "#f0f9ff",
      border: "1px solid #bae6fd",
      color: "#0369a1",
    },
    successAlert: {
      backgroundColor: "#f0fdf4",
      border: "1px solid #bbf7d0",
      color: "#166534",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      ...typography.labelText,
      color: "#374151",
      display: "block",
      marginBottom: "0.75rem",
    },
    inputContainer: {
      position: "relative",
    },
    input: {
      ...typography.inputText,
      width: "100%",
      padding: "1rem",
      border: "1px solid #d1d5db",
      borderRadius: "12px",
      transition: "all 0.2s ease",
      fontSize: "16px",
      backgroundColor: "white",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      outline: "none",
    },
    inputError: {
      borderColor: "#ef4444",
      boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
    },
    passwordToggle: {
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      ...typography.bodyText,
      color: "#6b7280",
      padding: "0.25rem",
    },
    submitButton: {
      width: "100%",
      padding: "1rem",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "12px",
      ...typography.buttonText,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "16px",
      marginBottom: "1.5rem",
    },
    submitButtonHover: {
      backgroundColor: "#2563eb",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    backLink: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      ...typography.linkText,
      color: "#3b82f6",
      textDecoration: "none",
      cursor: "pointer",
      transition: "color 0.2s ease",
      background: "none",
      border: "none",
      padding: "0.5rem",
    },
    errorText: {
      ...typography.errorText,
      color: "#ef4444",
      marginTop: "0.5rem",
      display: "block",
    },
  }

  const validateForm = () => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required"
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    if (step === 2) {
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required"
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters long"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (step === 1) {
      // Move to step 2 to enter new password
      setStep(2)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Call the Django API
      await authAPI.forgotPassword(formData.username, formData.email, formData.newPassword)

      // Show success message and redirect
      alert("Password reset successful! You can now log in with your new password.")
      navigate("/login")
    } catch (error) {
      console.error("Reset password error:", error)

      if (error.message.includes("Username and email do not match")) {
        setErrors({ submit: "Username and email do not match our records." })
        setStep(1) // Go back to step 1
      } else {
        setErrors({ submit: error.message || "Failed to reset password. Please try again." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const EyeIcon = ({ show }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {show ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        </>
      ) : (
        <>
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
        </>
      )}
    </svg>
  )

  const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div style={forgotPasswordStyles.container}>
      <div style={forgotPasswordStyles.authCard}>
        {/* Logo Section */}
        <div style={forgotPasswordStyles.logoContainer}>
          <div style={forgotPasswordStyles.logo}>
            <img src="Logo/JOB FINDER [1]-10.png" alt="JobFinder Logo" style={forgotPasswordStyles.logoImg} />
          </div>
          <h1 style={forgotPasswordStyles.logoText}>JobFinder</h1>
        </div>

        {/* Form Container */}
        <div style={forgotPasswordStyles.formContainer}>
          <h2 style={forgotPasswordStyles.title}>{step === 1 ? "Reset Password" : "Create New Password"}</h2>
          <p style={forgotPasswordStyles.subtitle}>
            {step === 1
              ? "Enter your username and email address to reset your password."
              : `Enter your new password for ${formData.email}`}
          </p>

          {errors.submit && (
            <div style={{ ...forgotPasswordStyles.alertBox, ...forgotPasswordStyles.errorAlert }}>{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div style={forgotPasswordStyles.formGroup}>
                  <label htmlFor="username" style={forgotPasswordStyles.label}>
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    disabled={isLoading}
                    required
                    style={{
                      ...forgotPasswordStyles.input,
                      ...(errors.username ? forgotPasswordStyles.inputError : {}),
                    }}
                    onFocus={(e) => {
                      if (!errors.username) {
                        Object.assign(e.target.style, forgotPasswordStyles.inputFocus)
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.username ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = errors.username ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                    }}
                  />
                  {errors.username && <span style={forgotPasswordStyles.errorText}>{errors.username}</span>}
                </div>

                <div style={forgotPasswordStyles.formGroup}>
                  <label htmlFor="email" style={forgotPasswordStyles.label}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                    required
                    style={{
                      ...forgotPasswordStyles.input,
                      ...(errors.email ? forgotPasswordStyles.inputError : {}),
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        Object.assign(e.target.style, forgotPasswordStyles.inputFocus)
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.email ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = errors.email ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                    }}
                  />
                  {errors.email && <span style={forgotPasswordStyles.errorText}>{errors.email}</span>}
                </div>
              </>
            ) : (
              <div style={forgotPasswordStyles.formGroup}>
                <label htmlFor="newPassword" style={forgotPasswordStyles.label}>
                  New Password
                </label>
                <div style={forgotPasswordStyles.inputContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    disabled={isLoading}
                    required
                    style={{
                      ...forgotPasswordStyles.input,
                      paddingRight: "3rem",
                      ...(errors.newPassword ? forgotPasswordStyles.inputError : {}),
                    }}
                    onFocus={(e) => {
                      if (!errors.newPassword) {
                        Object.assign(e.target.style, forgotPasswordStyles.inputFocus)
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.newPassword ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = errors.newPassword ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={forgotPasswordStyles.passwordToggle}
                    disabled={isLoading}
                  >
                    <EyeIcon show={showPassword} />
                  </button>
                </div>
                {errors.newPassword && <span style={forgotPasswordStyles.errorText}>{errors.newPassword}</span>}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...forgotPasswordStyles.submitButton,
                ...(isLoading ? forgotPasswordStyles.submitButtonDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  Object.assign(e.target.style, forgotPasswordStyles.submitButtonHover)
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#3b82f6"
                  e.target.style.transform = "none"
                  e.target.style.boxShadow = "none"
                }
              }}
            >
              {isLoading ? "Processing..." : step === 1 ? "Continue" : "Update Password"}
            </button>
          </form>

          <button
            onClick={() => (step === 1 ? navigate("/login") : setStep(1))}
            style={forgotPasswordStyles.backLink}
            onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.color = "#3b82f6")}
          >
            <ArrowLeftIcon />
            {step === 1 ? "Back to Login" : "Back"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword