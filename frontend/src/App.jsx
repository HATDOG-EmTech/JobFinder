"use client"
import { useState, useEffect, createContext, useContext } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import "./App.css"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"

// Theme Context
const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  return user ? children : <Navigate to="/login" replace />
}

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children, user }) => {
  return !user ? children : <Navigate to="/dashboard" replace />
}

function App() {
  const [user, setUser] = useState(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [theme, setTheme] = useState("Light")
  const [isLoading, setIsLoading] = useState(true)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("jobfinder-theme")
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // If no saved theme, detect system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const defaultTheme = systemPrefersDark ? "Dark" : "Light"
      setTheme(defaultTheme)
      localStorage.setItem("jobfinder-theme", defaultTheme)
    }
  }, [])

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
          const userData = JSON.parse(userInfo)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error loading user session:", error)
        localStorage.removeItem("userInfo")
      } finally {
        setIsLoading(false)
      }
    }

    checkUserSession()
  }, [])

  const handleLogin = (userData) => {
    const userInfo = {
      id: "123",
      ...userData,
    }
    localStorage.setItem("userInfo", JSON.stringify(userInfo))
    setUser(userData)
    setRegistrationSuccess(false) // Reset registration success message
  }

  const handleRegister = (userData) => {
    console.log("User registered successfully:", userData)
    setRegistrationSuccess(true)
    // Navigation will be handled by React Router automatically
  }

  const handleLogout = () => {
    setUser(null)
    setRegistrationSuccess(false)
    localStorage.clear()
  }

  const themeContextValue = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme)
      localStorage.setItem("jobfinder-theme", newTheme)
    },
    isDark: theme === "Dark" || (theme === "System" && window.matchMedia("(prefers-color-scheme: dark)").matches),
  }

  // Listen for system theme changes when using System theme
  useEffect(() => {
    if (theme === "System") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        // Force a re-render when system theme changes
        setTheme("System")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: "1.125rem",
            color: "#64748b",
          }}
        >
          Loading...
        </div>
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute user={user}>
                  <div>
                    {registrationSuccess && (
                      <div className="success-banner">
                        ✅ Account created successfully! Please sign in with your credentials.
                      </div>
                    )}
                    <Login onLogin={handleLogin} />
                  </div>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute user={user}>
                  <Register onRegister={handleRegister} />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute user={user}>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute user={user}>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Protected Routes - Let Dashboard handle all sub-routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />

            {/* Root redirect */}
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

            {/* Catch all - redirect to appropriate page */}
            <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeContext.Provider>
  )
}

export default App