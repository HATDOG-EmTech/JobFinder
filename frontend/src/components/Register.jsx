"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../api/auth"
import SocialLogin from "./SocialLogin"
import TermsModal from "./TermsModal"

const Register = ({ onRegister }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    mobile: "",
    location: "",
    userTitle: "",
    bio: "",
    skills: "",
    linkedin: "",
    github: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
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

  // Fixed styling with uniform width - exactly matching Login
  const registerStyles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      maxWidth: "500px", // Increased width for multi-step form
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
      outline: "none",
      boxShadow: "none",
    },
    authTabActive: {
      backgroundColor: "white",
      color: "#1e293b",
      borderBottom: "2px solid #3b82f6",
    },
    formContainer: {
      padding: "2rem",
    },
    stepIndicator: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "2rem",
      gap: "1rem",
    },
    stepDot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: "#e2e8f0",
      transition: "all 0.2s ease",
    },
    stepDotActive: {
      backgroundColor: "#3b82f6",
      transform: "scale(1.2)",
    },
    stepLine: {
      width: "40px",
      height: "2px",
      backgroundColor: "#e2e8f0",
    },
    stepLineActive: {
      backgroundColor: "#3b82f6",
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
    formGroup: {
      marginBottom: "1.5rem",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
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
      outline: "none",
      boxShadow: "none",
    },
    select: {
      ...typography.inputText,
      width: "100%",
      padding: "1rem",
      border: "1px solid #d1d5db",
      borderRadius: "12px",
      transition: "all 0.2s ease",
      fontSize: "16px",
      backgroundColor: "white",
      boxSizing: "border-box",
      outline: "none",
      boxShadow: "none",
      cursor: "pointer",
    },
    textarea: {
      ...typography.inputText,
      width: "100%",
      padding: "1rem",
      border: "1px solid #d1d5db",
      borderRadius: "12px",
      transition: "all 0.2s ease",
      fontSize: "16px",
      backgroundColor: "white",
      boxSizing: "border-box",
      outline: "none",
      boxShadow: "none",
      resize: "vertical",
      minHeight: "100px",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
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
      outline: "none",
      boxShadow: "none",
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "flex-start",
      gap: "0.75rem",
      marginBottom: "2rem",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      accentColor: "#3b82f6",
      marginTop: "0.125rem",
      flexShrink: 0,
    },
    checkboxLabel: {
      ...typography.bodyText,
      color: "#374151",
      cursor: "pointer",
      lineHeight: "1.5",
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
    },
    button: {
      flex: 1,
      padding: "1rem",
      border: "none",
      borderRadius: "12px",
      ...typography.buttonText,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "16px",
      outline: "none",
      boxShadow: "none",
    },
    primaryButton: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    secondaryButton: {
      backgroundColor: "#f8fafc",
      color: "#64748b",
      border: "1px solid #e2e8f0",
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
      outline: "none",
      boxShadow: "none",
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
      background: "none",
      border: "none",
      outline: "none",
      boxShadow: "none",
    },
    termsFooter: {
      marginTop: "2rem",
      textAlign: "center",
      ...typography.footerText,
      color: "#64748b",
      padding: "0 2rem",
    },
    termsLink: {
      color: "#3b82f6",
      textDecoration: "none",
      fontWeight: "600",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      fontSize: "inherit",
      fontFamily: "inherit",
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

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = "First name must be at least 2 characters"
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = "Last name must be at least 2 characters"
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }

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
    }

    if (step === 2) {
      if (formData.mobile && !/^\d{10,11}$/.test(formData.mobile.replace(/\D/g, ""))) {
        newErrors.mobile = "Please enter a valid phone number"
      }

      if (formData.linkedin && !formData.linkedin.includes("linkedin.com")) {
        newErrors.linkedin = "Please enter a valid LinkedIn URL"
      }

      if (formData.github && !formData.github.includes("github.com")) {
        newErrors.github = "Please enter a valid GitHub URL"
      }
    }

    if (step === 3) {
      if (!agreeTerms) {
        newErrors.agreeTerms = "You must agree to the terms and conditions"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep(3)) {
      return
    }

    setIsLoading(true)
    setErrors({}) // Clear previous errors

    try {
      console.log("Registration attempt with:", formData)

      // Call the Django API
      const response = await authAPI.register(formData)

      console.log("Registration successful:", response)

      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        mobile: formData.mobile,
        location: formData.location,
        userTitle: formData.userTitle,
        bio: formData.bio,
        skills: formData.skills,
        linkedin: formData.linkedin,
        github: formData.github,
        registeredAt: new Date().toISOString(),
      }

      if (onRegister) {
        onRegister(userData)
      }

      // Show success message
      alert("Registration successful! Please log in with your credentials.")

      // Navigate to login page after successful registration
      navigate("/login")
    } catch (error) {
      console.error("Registration error:", error)

      // Parse Django field errors
      const errorMessage = error.message || "Registration failed. Please try again."

      // Handle specific field errors
      if (errorMessage.includes("username:") || errorMessage.includes("email:")) {
        if (errorMessage.toLowerCase().includes("already exists") || errorMessage.toLowerCase().includes("unique")) {
          setErrors({ email: "An account with this email already exists" })
        } else {
          setErrors({ email: errorMessage })
        }
      } else if (errorMessage.includes("password:")) {
        setErrors({ password: errorMessage.replace("password:", "").trim() })
      } else if (errorMessage.includes("first_name:")) {
        setErrors({ firstName: errorMessage.replace("first_name:", "").trim() })
      } else if (errorMessage.includes("last_name:")) {
        setErrors({ lastName: errorMessage.replace("last_name:", "").trim() })
      } else {
        setErrors({ submit: errorMessage })
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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
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

  const renderStep1 = () => (
    <>
      <h2 style={registerStyles.title}>Create an account</h2>
      <p style={registerStyles.subtitle}>Enter your basic information to get started</p>

      {errors.submit && <div style={{ ...registerStyles.alertBox, ...registerStyles.errorAlert }}>{errors.submit}</div>}

      {/* First Name and Last Name Row */}
      <div style={registerStyles.formRow}>
        <div>
          <label htmlFor="firstName" style={registerStyles.label}>
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Juan"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
            style={{
              ...registerStyles.input,
              ...(errors.firstName ? registerStyles.inputError : {}),
            }}
            onFocus={(e) => {
              if (!errors.firstName) {
                Object.assign(e.target.style, registerStyles.inputFocus)
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.firstName ? "#ef4444" : "#d1d5db"
              e.target.style.boxShadow = errors.firstName ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
            }}
          />
          {errors.firstName && <span style={registerStyles.errorText}>{errors.firstName}</span>}
        </div>

        <div>
          <label htmlFor="lastName" style={registerStyles.label}>
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Dela Cruz"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
            style={{
              ...registerStyles.input,
              ...(errors.lastName ? registerStyles.inputError : {}),
            }}
            onFocus={(e) => {
              if (!errors.lastName) {
                Object.assign(e.target.style, registerStyles.inputFocus)
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.lastName ? "#ef4444" : "#d1d5db"
              e.target.style.boxShadow = errors.lastName ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
            }}
          />
          {errors.lastName && <span style={registerStyles.errorText}>{errors.lastName}</span>}
        </div>
      </div>

      <div style={registerStyles.formGroup}>
        <label htmlFor="email" style={registerStyles.label}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          style={{
            ...registerStyles.input,
            ...(errors.email ? registerStyles.inputError : {}),
          }}
          onFocus={(e) => {
            if (!errors.email) {
              Object.assign(e.target.style, registerStyles.inputFocus)
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.email ? "#ef4444" : "#d1d5db"
            e.target.style.boxShadow = errors.email ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
          }}
        />
        {errors.email && <span style={registerStyles.errorText}>{errors.email}</span>}
      </div>

      <div style={registerStyles.formGroup}>
        <label htmlFor="password" style={registerStyles.label}>
          Password *
        </label>
        <div style={registerStyles.inputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
            style={{
              ...registerStyles.input,
              paddingRight: "3rem",
              ...(errors.password ? registerStyles.inputError : {}),
            }}
            onFocus={(e) => {
              if (!errors.password) {
                Object.assign(e.target.style, registerStyles.inputFocus)
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.password ? "#ef4444" : "#d1d5db"
              e.target.style.boxShadow = errors.password ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
            }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={registerStyles.passwordToggle}>
            <EyeIcon show={showPassword} />
          </button>
        </div>
        {formData.password && passwordStrength.text && (
          <div
            style={{
              ...registerStyles.passwordStrength,
              ...(passwordStrength.strength === "weak" ? registerStyles.strengthWeak : {}),
              ...(passwordStrength.strength === "medium" ? registerStyles.strengthMedium : {}),
              ...(passwordStrength.strength === "strong" ? registerStyles.strengthStrong : {}),
            }}
          >
            {passwordStrength.text}
          </div>
        )}
        {errors.password && <span style={registerStyles.errorText}>{errors.password}</span>}
      </div>

      <div style={registerStyles.formGroup}>
        <label htmlFor="confirmPassword" style={registerStyles.label}>
          Confirm Password *
        </label>
        <div style={registerStyles.inputContainer}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            required
            style={{
              ...registerStyles.input,
              paddingRight: "3rem",
              ...(errors.confirmPassword ? registerStyles.inputError : {}),
            }}
            onFocus={(e) => {
              if (!errors.confirmPassword) {
                Object.assign(e.target.style, registerStyles.inputFocus)
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
            style={registerStyles.passwordToggle}
          >
            <EyeIcon show={showConfirmPassword} />
          </button>
        </div>
        {errors.confirmPassword && <span style={registerStyles.errorText}>{errors.confirmPassword}</span>}
      </div>

      <div style={registerStyles.buttonGroup}>
        <button
          type="button"
          onClick={handleNext}
          style={{
            ...registerStyles.button,
            ...registerStyles.primaryButton,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#2563eb"
            e.target.style.transform = "translateY(-1px)"
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#3b82f6"
            e.target.style.transform = "none"
          }}
        >
          Next Step
        </button>
      </div>
    </>
  )

  const renderStep2 = () => (
    <>
      <h2 style={registerStyles.title}>Personal Information</h2>
      <p style={registerStyles.subtitle}>Tell us more about yourself (optional)</p>

      <div style={registerStyles.formRow}>
        <div>
          <label htmlFor="gender" style={registerStyles.label}>
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            style={registerStyles.select}
            onFocus={(e) => {
              Object.assign(e.target.style, registerStyles.inputFocus)
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d1d5db"
              e.target.style.boxShadow = "none"
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to Say">Prefer not to Say</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label htmlFor="mobile" style={registerStyles.label}>
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            placeholder="09123456789"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            style={{
              ...registerStyles.input,
              ...(errors.mobile ? registerStyles.inputError : {}),
            }}
            onFocus={(e) => {
              if (!errors.mobile) {
                Object.assign(e.target.style, registerStyles.inputFocus)
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.mobile ? "#ef4444" : "#d1d5db"
              e.target.style.boxShadow = errors.mobile ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
            }}
          />
          {errors.mobile && <span style={registerStyles.errorText}>{errors.mobile}</span>}
        </div>
      </div>

      <div style={registerStyles.formGroup}>
        <label htmlFor="location" style={registerStyles.label}>
          Location
        </label>
        <input
          type="text"
          id="location"
          placeholder="City, Country"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          style={registerStyles.input}
          onFocus={(e) => {
            Object.assign(e.target.style, registerStyles.inputFocus)
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db"
            e.target.style.boxShadow = "none"
          }}
        />
      </div>

      <div style={registerStyles.formGroup}>
        <label htmlFor="userTitle" style={registerStyles.label}>
          Current Job Title
        </label>
        <input
          type="text"
          id="userTitle"
          placeholder="e.g. Software Engineer"
          value={formData.userTitle}
          onChange={(e) => handleInputChange("userTitle", e.target.value)}
          style={registerStyles.input}
          onFocus={(e) => {
            Object.assign(e.target.style, registerStyles.inputFocus)
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db"
            e.target.style.boxShadow = "none"
          }}
        />
      </div>

      <div style={registerStyles.formGroup}>
        <label htmlFor="bio" style={registerStyles.label}>
          Bio
        </label>
        <textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          style={registerStyles.textarea}
          onFocus={(e) => {
            Object.assign(e.target.style, registerStyles.inputFocus)
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db"
            e.target.style.boxShadow = "none"
          }}
        />
      </div>

      <div style={registerStyles.formGroup}>
        <label htmlFor="skills" style={registerStyles.label}>
          Skills
        </label>
        <textarea
          id="skills"
          placeholder="e.g. JavaScript, React, Node.js, Python..."
          value={formData.skills}
          onChange={(e) => handleInputChange("skills", e.target.value)}
          style={registerStyles.textarea}
          onFocus={(e) => {
            Object.assign(e.target.style, registerStyles.inputFocus)
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db"
            e.target.style.boxShadow = "none"
          }}
        />
      </div>

      <div style={registerStyles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevious}
          style={{
            ...registerStyles.button,
            ...registerStyles.secondaryButton,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f1f5f9"
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f8fafc"
          }}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          style={{
            ...registerStyles.button,
            ...registerStyles.primaryButton,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#2563eb"
            e.target.style.transform = "translateY(-1px)"
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#3b82f6"
            e.target.style.transform = "none"
          }}
        >
          Next Step
        </button>
      </div>
    </>
  )

  const renderStep3 = () => (
    <>
      <h2 style={registerStyles.title}>Professional Links & Role</h2>
      <p style={registerStyles.subtitle}>Complete your profile (optional)</p>

      <div style={registerStyles.formGroup}>
        <label htmlFor="linkedin" style={registerStyles.label}>
          LinkedIn Profile
        </label>
        <input
          type="url"
          id="linkedin"
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedin}
          onChange={(e) => handleInputChange("linkedin", e.target.value)}
          style={{
            ...registerStyles.input,
            ...(errors.linkedin ? registerStyles.inputError : {}),
          }}
          onFocus={(e) => {
            if (!errors.linkedin) {
              Object.assign(e.target.style, registerStyles.inputFocus)
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.linkedin ? "#ef4444" : "#d1d5db"
            e.target.style.boxShadow = errors.linkedin ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
          }}
        />
        {errors.linkedin && <span style={registerStyles.errorText}>{errors.linkedin}</span>}
      </div>

      <div style={registerStyles.formGroup}>
        <label htmlFor="github" style={registerStyles.label}>
          GitHub Profile
        </label>
        <input
          type="url"
          id="github"
          placeholder="https://github.com/yourusername"
          value={formData.github}
          onChange={(e) => handleInputChange("github", e.target.value)}
          style={{
            ...registerStyles.input,
            ...(errors.github ? registerStyles.inputError : {}),
          }}
          onFocus={(e) => {
            if (!errors.github) {
              Object.assign(e.target.style, registerStyles.inputFocus)
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.github ? "#ef4444" : "#d1d5db"
            e.target.style.boxShadow = errors.github ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
          }}
        />
        {errors.github && <span style={registerStyles.errorText}>{errors.github}</span>}
      </div>

      <div style={registerStyles.checkboxGroup}>
        <input
          type="checkbox"
          id="agreeTerms"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          required
          style={registerStyles.checkbox}
        />
        <label htmlFor="agreeTerms" style={registerStyles.checkboxLabel}>
          I agree to the{" "}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "600",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: "inherit",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "600",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: "inherit",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Privacy Policy
          </button>
        </label>
        {errors.agreeTerms && <span style={registerStyles.errorText}>{errors.agreeTerms}</span>}
      </div>

      <div style={registerStyles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevious}
          style={{
            ...registerStyles.button,
            ...registerStyles.secondaryButton,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f1f5f9"
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f8fafc"
          }}
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...registerStyles.button,
            ...registerStyles.primaryButton,
            ...(isLoading ? registerStyles.submitButtonDisabled : {}),
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = "#2563eb"
              e.target.style.transform = "translateY(-1px)"
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)"
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
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </div>
    </>
  )

  return (
    <div style={registerStyles.container}>
      {/* Auth Card with Logo Inside */}
      <div style={registerStyles.authCard}>
        {/* Logo Section */}
        <div style={registerStyles.logoContainer}>
          <div style={registerStyles.logo}>
            <img src="Logo/JOB FINDER [1]-10.png" alt="JobFinder Logo" style={registerStyles.logoImg} />
          </div>
          <h1 style={registerStyles.logoText}>JobFinder</h1>
        </div>

        {/* Tabs */}
        <div style={registerStyles.authTabs}>
          <button style={registerStyles.authTab} onClick={() => navigate("/login")}>
            Login
          </button>
          <button style={{ ...registerStyles.authTab, ...registerStyles.authTabActive }}>Register</button>
        </div>

        {/* Form Container */}
        <div style={registerStyles.formContainer}>
          {/* Step Indicator */}
          <div style={registerStyles.stepIndicator}>
            <div
              style={{
                ...registerStyles.stepDot,
                ...(currentStep >= 1 ? registerStyles.stepDotActive : {}),
              }}
            ></div>
            <div
              style={{
                ...registerStyles.stepLine,
                ...(currentStep >= 2 ? registerStyles.stepLineActive : {}),
              }}
            ></div>
            <div
              style={{
                ...registerStyles.stepDot,
                ...(currentStep >= 2 ? registerStyles.stepDotActive : {}),
              }}
            ></div>
            <div
              style={{
                ...registerStyles.stepLine,
                ...(currentStep >= 3 ? registerStyles.stepLineActive : {}),
              }}
            ></div>
            <div
              style={{
                ...registerStyles.stepDot,
                ...(currentStep >= 3 ? registerStyles.stepDotActive : {}),
              }}
            ></div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>

          {currentStep === 3 && (
            <>
              <div style={registerStyles.divider}>
                <div style={registerStyles.dividerLine}></div>
                <span style={registerStyles.dividerText}>OR CONTINUE WITH</span>
                <div style={registerStyles.dividerLine}></div>
              </div>

              <SocialLogin />
            </>
          )}

          <div style={registerStyles.authFooter}>
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={registerStyles.authFooterLink}
                onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
                onMouseLeave={(e) => (e.target.style.color = "#3b82f6")}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Terms Footer Inside Card */}
        <div style={registerStyles.termsFooter}>
          <p>
            By creating an account, you agree to our{" "}
            <button type="button" onClick={() => setShowTermsModal(true)} style={registerStyles.termsLink}>
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" onClick={() => setShowPrivacyModal(true)} style={registerStyles.termsLink}>
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>
      {/* Terms and Privacy Modals */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} type="terms" />
      <TermsModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} type="privacy" />
    </div>
  )
}

export default Register