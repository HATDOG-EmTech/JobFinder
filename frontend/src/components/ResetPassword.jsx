"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const ResetPassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [isValidAccess, setIsValidAccess] = useState(false)

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

  const resetPasswordStyles = {
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
    successAlert: {
      backgroundColor: "#f0fdf4",
      border: "1px solid #bbf7d0",
      color: "#166534",
    },
    infoAlert: {
      backgroundColor: "#f0f9ff",
      border: "1px solid #bae6fd",
      color: "#0369a1",
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
      paddingRight: "3rem",
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
    passwordStrength: {
      marginTop: "0.5rem",
      ...typography.bodyText,
      fontSize: "0.75rem",
    },
    strengthWeak: {
      color: "#ef4444",
    },
    strengthMedium: {
      color: "#f59e0b",
    },
    strengthStrong: {
      color: "#10b981",
    },
  }

  // Check if user has valid access to this page
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail")

    if (!storedEmail) {
      // No valid access, redirect to forgot password
      navigate("/forgot-password")
      return
    }

    setEmail(storedEmail)
    setIsValidAccess(true)
  }, [navigate])

  const getPasswordStrength = (password) => {
    if (!password) return { strength: "", text: "" }

    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    if (score < 3) return { strength: "weak", text: "Weak password" }
    if (score < 4) return { strength: "medium", text: "Medium password" }
    return { strength: "strong", text: "Strong password" }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call to update password
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Password reset successful for:", email)

      // Clear the reset email from localStorage
      localStorage.removeItem("resetEmail")

      // Show success message and redirect
      alert("Password reset successful! You can now log in with your new password.")
      navigate("/login")
    } catch (error) {
      console.error("Reset password error:", error)
      setErrors({ submit: "Failed to reset password. Please try again." })
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

  const passwordStrength = getPasswordStrength(formData.password)

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

  // Don't render anything if access is not valid
  if (!isValidAccess) {
    return null
  }

  return (
    <div style={resetPasswordStyles.container}>
      <div style={resetPasswordStyles.authCard}>
        {/* Logo Section */}
        <div style={resetPasswordStyles.logoContainer}>
          <div style={resetPasswordStyles.logo}>
            <img src="Logo/JOB FINDER [1]-10.png" alt="JobFinder Logo" style={resetPasswordStyles.logoImg} />
          </div>
          <h1 style={resetPasswordStyles.logoText}>JobFinder</h1>
        </div>

        {/* Form Container */}
        <div style={resetPasswordStyles.formContainer}>
          <h2 style={resetPasswordStyles.title}>Create New Password</h2>
          <p style={resetPasswordStyles.subtitle}>
            Enter your new password for <strong>{email}</strong>
          </p>

          <div style={{ ...resetPasswordStyles.alertBox, ...resetPasswordStyles.infoAlert }}>
            <strong>Password Requirements:</strong>
            <br />• At least 8 characters long
            <br />• Contains uppercase and lowercase letters
            <br />• Contains at least one number
          </div>

          {errors.submit && (
            <div style={{ ...resetPasswordStyles.alertBox, ...resetPasswordStyles.errorAlert }}>{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={resetPasswordStyles.formGroup}>
              <label htmlFor="password" style={resetPasswordStyles.label}>
                New Password
              </label>
              <div style={resetPasswordStyles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={isLoading}
                  required
                  style={{
                    ...resetPasswordStyles.input,
                    ...(errors.password ? resetPasswordStyles.inputError : {}),
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      Object.assign(e.target.style, resetPasswordStyles.inputFocus)
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? "#ef4444" : "#d1d5db"
                    e.target.style.boxShadow = errors.password ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={resetPasswordStyles.passwordToggle}
                  disabled={isLoading}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {formData.password && passwordStrength.text && (
                <div
                  style={{
                    ...resetPasswordStyles.passwordStrength,
                    ...(passwordStrength.strength === "weak" ? resetPasswordStyles.strengthWeak : {}),
                    ...(passwordStrength.strength === "medium" ? resetPasswordStyles.strengthMedium : {}),
                    ...(passwordStrength.strength === "strong" ? resetPasswordStyles.strengthStrong : {}),
                  }}
                >
                  {passwordStrength.text}
                </div>
              )}
              {errors.password && <span style={resetPasswordStyles.errorText}>{errors.password}</span>}
            </div>

            <div style={resetPasswordStyles.formGroup}>
              <label htmlFor="confirmPassword" style={resetPasswordStyles.label}>
                Confirm New Password
              </label>
              <div style={resetPasswordStyles.inputContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  disabled={isLoading}
                  required
                  style={{
                    ...resetPasswordStyles.input,
                    ...(errors.confirmPassword ? resetPasswordStyles.inputError : {}),
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmPassword) {
                      Object.assign(e.target.style, resetPasswordStyles.inputFocus)
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? "#ef4444" : "#d1d5db"
                    e.target.style.boxShadow = errors.confirmPassword ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={resetPasswordStyles.passwordToggle}
                  disabled={isLoading}
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
              </div>
              {errors.confirmPassword && <span style={resetPasswordStyles.errorText}>{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...resetPasswordStyles.submitButton,
                ...(isLoading ? resetPasswordStyles.submitButtonDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  Object.assign(e.target.style, resetPasswordStyles.submitButtonHover)
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
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>
          </form>

          <button
            onClick={() => navigate("/forgot-password")}
            style={resetPasswordStyles.backLink}
            onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.color = "#3b82f6")}
          >
            <ArrowLeftIcon />
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword