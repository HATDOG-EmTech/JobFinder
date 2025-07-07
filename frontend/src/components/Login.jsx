"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../api/auth"
import SocialLogin from "./SocialLogin"
import TermsModal from "./TermsModal"

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(null)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  // Unified typography system
  const typography = {
    logoText: {
      fontSize: "1.5rem", // 24px
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
    },
    authTitle: {
      fontSize: "1.875rem", // 30px
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
    },
    authSubtitle: {
      fontSize: "1rem", // 16px
      fontWeight: "500",
      lineHeight: "1.5",
    },
    tabText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
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
    linkText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    bodyText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.5",
    },
    smallText: {
      fontSize: "0.75rem", // 12px
      fontWeight: "600",
      lineHeight: "1.4",
      letterSpacing: "0.1em",
    },
    errorText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.4",
    },
    footerText: {
      fontSize: "0.8rem", // 13px
      fontWeight: "500",
      lineHeight: "1.5",
    },
  }

  // Fixed styling with uniform width
  const loginStyles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      maxWidth: "500px", // Fixed uniform width
      margin: "0 auto",
      padding: "2rem 1rem", // Consistent padding
      minHeight: "100vh",
      justifyContent: "center",
    },
    authCard: {
      width: "100%", // Full width of container
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
      padding: "2rem 2rem 1rem 2rem", // Top padding for logo
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
    authTabs: {
      display: "flex",
      borderBottom: "1px solid #e2e8f0",
    },
    authTab: {
      flex: 1,
      textAlign: "center",
      padding: "1.25rem",
      textDecoration: "none",
      color: "#64748b",
      ...typography.tabText,
      backgroundColor: "#f8fafc",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    authTabActive: {
      backgroundColor: "white",
      color: "#1e293b",
      borderBottom: "2px solid #3b82f6",
    },
    formContainer: {
      padding: "2rem", // Consistent padding
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
    demoInfo: {
      backgroundColor: "#f0f9ff",
      border: "1px solid #0ea5e9",
      borderRadius: "12px",
      padding: "1rem",
      marginBottom: "1.5rem",
      ...typography.bodyText,
      color: "#0369a1",
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
    warningAlert: {
      backgroundColor: "#fffbeb",
      border: "1px solid #fed7aa",
      color: "#ea580c",
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
    passwordHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.75rem",
    },
    forgotPassword: {
      background: "none",
      border: "none",
      ...typography.linkText,
      color: "#3b82f6",
      cursor: "pointer",
      transition: "color 0.2s ease",
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
      fontSize: "16px", // Prevents zoom on iOS
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
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      marginBottom: "2rem",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      accentColor: "#3b82f6",
    },
    checkboxLabel: {
      ...typography.bodyText,
      color: "#374151",
      cursor: "pointer",
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
      marginBottom: "2rem",
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
    divider: {
      display: "flex",
      alignItems: "center",
      margin: "2rem 0",
      color: "#9ca3af",
      ...typography.smallText,
    },
    dividerLine: {
      content: "",
      flex: 1,
      borderBottom: "1px solid #e2e8f0",
    },
    dividerText: {
      padding: "0 1.5rem",
      backgroundColor: "white",
    },
    authFooter: {
      textAlign: "center",
      ...typography.bodyText,
      color: "#64748b",
      marginTop: "1.5rem",
    },
    authFooterLink: {
      color: "#3b82f6",
      textDecoration: "none",
      ...typography.linkText,
      cursor: "pointer",
      transition: "color 0.2s ease",
    },
    termsFooter: {
      marginTop: "2rem",
      textAlign: "center",
      ...typography.footerText,
      color: "#64748b",
      padding: "0 2rem", // Consistent with card padding
    },
    termsLink: {
      color: "#3b82f6",
      textDecoration: "none",
      fontWeight: "600",
    },
    errorText: {
      ...typography.errorText,
      color: "#ef4444",
      marginTop: "0.5rem",
      display: "block",
    },
  }

  // Check for account lockout on component mount
  useEffect(() => {
    const storedAttempts = Number.parseInt(localStorage.getItem("loginAttempts") || "0")
    const storedLockoutTime = localStorage.getItem("lockoutTime")

    if (storedLockoutTime) {
      const lockoutEndTime = new Date(storedLockoutTime)
      const now = new Date()

      if (now < lockoutEndTime) {
        setIsLocked(true)
        setLockoutTime(lockoutEndTime)
        setLoginAttempts(storedAttempts)

        const timeUntilUnlock = lockoutEndTime.getTime() - now.getTime()
        setTimeout(() => {
          setIsLocked(false)
          setLockoutTime(null)
          setLoginAttempts(0)
          localStorage.removeItem("loginAttempts")
          localStorage.removeItem("lockoutTime")
        }, timeUntilUnlock)
      } else {
        localStorage.removeItem("loginAttempts")
        localStorage.removeItem("lockoutTime")
      }
    }

    setLoginAttempts(storedAttempts)
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = "Username is required"
    } else {
      // Check if it's an email format
      const isEmail = /\S+@\S+\.\S+/.test(usernameOrEmail)
      // Check if it's a valid username format (letters, numbers, underscores, 3+ chars)
      const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(usernameOrEmail)

      if (!isEmail && !isUsername) {
        newErrors.usernameOrEmail = "Please enter a valid username"
      }
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLockout = () => {
    const newAttempts = loginAttempts + 1
    setLoginAttempts(newAttempts)
    localStorage.setItem("loginAttempts", newAttempts.toString())

    if (newAttempts >= 5) {
      const lockoutEndTime = new Date(Date.now() + 15 * 60 * 1000)
      setIsLocked(true)
      setLockoutTime(lockoutEndTime)
      localStorage.setItem("lockoutTime", lockoutEndTime.toISOString())

      setTimeout(
        () => {
          setIsLocked(false)
          setLockoutTime(null)
          setLoginAttempts(0)
          localStorage.removeItem("loginAttempts")
          localStorage.removeItem("lockoutTime")
        },
        15 * 60 * 1000,
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLocked) {
      setErrors({ submit: "Account is temporarily locked. Please try again later." })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      console.log("Login attempt with:", { usernameOrEmail, password: "[HIDDEN]", rememberMe })

      // Call the Django API
      const response = await authAPI.login(usernameOrEmail, password)

      // Store tokens if using JWT
      if (response.access) {
        localStorage.setItem("access_token", response.access)
      }
      if (response.refresh) {
        localStorage.setItem("refresh_token", response.refresh)
      }

      // Get user profile data
      const userProfile = await authAPI.getCurrentUser()

      const userData = {
        id: userProfile.id,
        email: userProfile.email,
        name: `${userProfile.first_name} ${userProfile.last_name}`.trim() || userProfile.username,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        username: userProfile.username,
        role: userProfile.role,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe,
      }

      setLoginAttempts(0)
      localStorage.removeItem("loginAttempts")
      localStorage.removeItem("lockoutTime")

      if (rememberMe) {
        localStorage.setItem("rememberedCredentials", usernameOrEmail)
      } else {
        localStorage.removeItem("rememberedCredentials")
      }

      onLogin(userData)
    } catch (error) {
      console.error("Login error:", error.message)

      // Handle specific error messages from Django
      if (error.message.includes("Invalid credentials") || error.message.includes("password")) {
        setErrors({ password: "Invalid username/email or password" })
      } else if (error.message.includes("email") || error.message.includes("username")) {
        setErrors({ usernameOrEmail: "No account found with this username" })
      } else {
        setErrors({ submit: error.message || "Login failed. Please try again." })
      }

      handleLockout()
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    if (field === "usernameOrEmail") {
      setUsernameOrEmail(value)
    } else if (field === "password") {
      setPassword(value)
    }
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password")
  }

  const loadRememberedCredentials = () => {
    const rememberedCredentials = localStorage.getItem("rememberedCredentials")
    if (rememberedCredentials) {
      setUsernameOrEmail(rememberedCredentials)
      setRememberMe(true)
    }
  }

  useEffect(() => {
    loadRememberedCredentials()
  }, [])

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return ""
    const now = new Date()
    const diff = lockoutTime.getTime() - now.getTime()
    const minutes = Math.ceil(diff / (1000 * 60))
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
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

  return (
    <div style={loginStyles.container}>
      {/* Auth Card with Logo Inside */}
      <div style={loginStyles.authCard}>
        {/* Logo Section */}
        <div style={loginStyles.logoContainer}>
          <div style={loginStyles.logo}>
            <img src="Logo/JOB FINDER [1]-10.png" alt="JobFinder Logo" style={loginStyles.logoImg} />
          </div>
          <h1 style={loginStyles.logoText}>JobFinder</h1>
        </div>

        {/* Tabs */}
        <div style={loginStyles.authTabs}>
          <button style={{ ...loginStyles.authTab, ...loginStyles.authTabActive }}>Login</button>
          <button style={loginStyles.authTab} onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

        {/* Form Container */}
        <div style={loginStyles.formContainer}>
          <h2 style={loginStyles.title}>Welcome back</h2>
          <p style={loginStyles.subtitle}>Sign in to your account to continue</p>

          {/* Account Lockout Warning */}
          {isLocked && (
            <div style={{ ...loginStyles.alertBox, ...loginStyles.errorAlert }}>
              🔒 Account temporarily locked due to multiple failed attempts. Try again in {getRemainingLockoutTime()}.
            </div>
          )}

          {/* Login Attempts Warning */}
          {loginAttempts > 2 && !isLocked && (
            <div style={{ ...loginStyles.alertBox, ...loginStyles.warningAlert }}>
              ⚠️ {5 - loginAttempts} attempt{5 - loginAttempts !== 1 ? "s" : ""} remaining before account lockout.
            </div>
          )}

          {/* General Error Message */}
          {errors.submit && <div style={{ ...loginStyles.alertBox, ...loginStyles.errorAlert }}>{errors.submit}</div>}

          <form onSubmit={handleSubmit}>
            <div style={loginStyles.formGroup}>
              <label htmlFor="usernameOrEmail" style={loginStyles.label}>
                Username
              </label>
              <input
                type="text"
                id="usernameOrEmail"
                placeholder="example123"
                value={usernameOrEmail}
                onChange={(e) => handleInputChange("usernameOrEmail", e.target.value)}
                disabled={isLocked}
                required
                style={{
                  ...loginStyles.input,
                  ...(errors.usernameOrEmail ? loginStyles.inputError : {}),
                }}
                onFocus={(e) => {
                  if (!errors.usernameOrEmail) {
                    Object.assign(e.target.style, loginStyles.inputFocus)
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.usernameOrEmail ? "#ef4444" : "#d1d5db"
                  e.target.style.boxShadow = errors.usernameOrEmail ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                }}
              />
              {errors.usernameOrEmail && <span style={loginStyles.errorText}>{errors.usernameOrEmail}</span>}
            </div>

            <div style={loginStyles.formGroup}>
              <div style={loginStyles.passwordHeader}>
                <label htmlFor="password" style={loginStyles.label}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={loginStyles.forgotPassword}
                  onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
                  onMouseLeave={(e) => (e.target.style.color = "#3b82f6")}
                >
                  Forgot password?
                </button>
              </div>
              <div style={loginStyles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={isLocked}
                  required
                  style={{
                    ...loginStyles.input,
                    paddingRight: "3rem",
                    ...(errors.password ? loginStyles.inputError : {}),
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      Object.assign(e.target.style, loginStyles.inputFocus)
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
                  style={loginStyles.passwordToggle}
                  disabled={isLocked}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {errors.password && <span style={loginStyles.errorText}>{errors.password}</span>}
            </div>

            <div style={loginStyles.checkboxGroup}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={isLocked}
                style={loginStyles.checkbox}
              />
              <label htmlFor="rememberMe" style={loginStyles.checkboxLabel}>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLocked}
              style={{
                ...loginStyles.submitButton,
                ...(isLoading || isLocked ? loginStyles.submitButtonDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !isLocked) {
                  Object.assign(e.target.style, loginStyles.submitButtonHover)
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !isLocked) {
                  e.target.style.backgroundColor = "#3b82f6"
                  e.target.style.transform = "none"
                  e.target.style.boxShadow = "none"
                }
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div style={loginStyles.divider}>
            <div style={loginStyles.dividerLine}></div>
            <span style={loginStyles.dividerText}>OR CONTINUE WITH</span>
            <div style={loginStyles.dividerLine}></div>
          </div>

          <SocialLogin />

          <div style={loginStyles.authFooter}>
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                style={loginStyles.authFooterLink}
                onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
                onMouseLeave={(e) => (e.target.style.color = "#3b82f6")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Terms Footer Inside Card */}
        <div style={loginStyles.termsFooter}>
          <p>
            By using JobFinder, you agree to our{" "}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              style={{
                ...loginStyles.termsLink,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              style={{
                ...loginStyles.termsLink,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>

        {/* Terms and Privacy Modals */}
        <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} type="terms" />
        <TermsModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} type="privacy" />
      </div>
    </div>
  )
}

export default Login