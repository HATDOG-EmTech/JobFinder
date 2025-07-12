// API configuration and authentication functions
const API_BASE_URL = import.meta.env.VITE_API_URL // Adjust this to your Django server URL

// Helper function to get CSRF token if needed
const getCSRFToken = () => {
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "csrftoken") {
      return value
    }
  }
  return null
}

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`
  const token = localStorage.getItem("access_token")

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  // Add authorization header if token exists
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  // Add CSRF token if needed
  const csrfToken = getCSRFToken()
  if (csrfToken) {
    defaultHeaders["X-CSRFToken"] = csrfToken
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    console.log("Making API request to:", url)
    console.log("Request config:", config)

    const response = await fetch(url, config)

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    // Handle different response types
    if (response.status === 204) {
      return null // No content
    }

    // Always try to get response text first
    const responseText = await response.text()
    console.log("Raw response text:", responseText)

    let data = null

    // Try to parse as JSON
    if (responseText) {
      try {
        data = JSON.parse(responseText)
        console.log("Parsed response data:", data)
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError)
        console.error("Response text was:", responseText)
        throw new Error(`Server returned invalid JSON: ${responseText}`)
      }
    }

    if (!response.ok) {
      console.error("Request failed with status:", response.status)
      console.error("Error data:", data)

      // Handle Django validation errors
      if (data && typeof data === "object") {
        const errorMessages = []

        // Check for field-specific errors
        Object.keys(data).forEach((field) => {
          if (data[field]) {
            const fieldErrors = Array.isArray(data[field]) ? data[field] : [data[field]]
            errorMessages.push(`${field}: ${fieldErrors.join(", ")}`)
          }
        })

        if (errorMessages.length > 0) {
          throw new Error(errorMessages.join("; "))
        }

        // Fallback to generic error messages
        if (data.detail) throw new Error(data.detail)
        if (data.message) throw new Error(data.message)
        if (data.error) throw new Error(data.error)
      }

      // If we have response text but couldn't parse meaningful errors
      if (responseText) {
        throw new Error(`Server error (${response.status}): ${responseText}`)
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("API Request Error:", error)
    throw error
  }
}

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    console.log("Registration data received:", userData)

    // Clean and validate the data before sending
    const registrationPayload = {
      username: userData.username ? userData.username.trim() : userData.email.trim().toLowerCase(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      first_name: userData.firstName.trim(),
      last_name: userData.lastName.trim(),
      gender: userData.gender || "",
      mobile: userData.mobile || "",
      location: userData.location || "",
      user_title: userData.userTitle || "",
      bio: userData.bio || "",
      skills: userData.skills || "",
      linkedin: userData.linkedin || "",
      github: userData.github || "",
      role: "User",
    }

    console.log("Sending registration payload:", registrationPayload)

    return await apiRequest("/user/register/", {
      method: "POST",
      body: JSON.stringify(registrationPayload),
    })
  },

  // Login user
  login: async (usernameOrEmail, password) => {
    // Try to determine if it's an email or username
    const isEmail = /\S+@\S+\.\S+/.test(usernameOrEmail)

    // First try with the provided value as username
    try {
      return await apiRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify({
          username: usernameOrEmail,
          password: password,
        }),
      })
    } catch (error) {
      // If it's an email and the first attempt failed, try with email field
      if (isEmail) {
        try {
          return await apiRequest("/auth/login/", {
            method: "POST",
            body: JSON.stringify({
              email: usernameOrEmail,
              password: password,
            }),
          })
        } catch (emailError) {
          // If both fail, throw the original error
          throw error
        }
      }
      // If it's not an email, just throw the original error
      throw error
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    return await apiRequest("/user/me/")
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await apiRequest("/user/update/", {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
  },

  // Forgot password
  forgotPassword: async (username, email, newPassword) => {
    return await apiRequest("/user/forgot-password/", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        email: email,
        new_password: newPassword,
      }),
    })
  },

  // Change password - Using the existing forgot password endpoint with current user info
  changePassword: async (passwordData) => {
    try {
      // First get current user info
      const currentUser = await apiRequest("/user/me/")

      // Use the forgot password endpoint to change password
      return await apiRequest("/user/forgot-password/", {
        method: "POST",
        body: JSON.stringify({
          username: currentUser.username || currentUser.email,
          email: currentUser.email,
          new_password: passwordData.new_password,
        }),
      })
    } catch (error) {
      console.error("Change password error:", error)
      throw error
    }
  },

  // Logout (client-side cleanup)
  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("userInfo")
  },
}

// Job API functions
export const jobAPI = {
  // Get all jobs
  getAllJobs: async () => {
    return await apiRequest("/jobposting/")
  },

  // Create new job - Fixed to work with JobSerializer
  createJob: async (jobData) => {
    console.log("Creating job with data:", jobData)

    // Ensure we have an auth token
    const token = localStorage.getItem("access_token")
    if (!token) {
      throw new Error("Authentication required. Please log in.")
    }

    return await apiRequest("/jobposting/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    })
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      throw new Error("Authentication required. Please log in.")
    }

    return await apiRequest(`/jobposting/update/${jobId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    })
  },

  // Delete job
  deleteJob: async (jobId) => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      throw new Error("Authentication required. Please log in.")
    }

    return await apiRequest(`/jobposting/delete/${jobId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  // Search jobs
  searchJobs: async (query) => {
    return await apiRequest(`/jobs/search/?q=${encodeURIComponent(query)}`)
  },
}

// Application API functions
export const applicationAPI = {
  // Get user's applications
  getUserApplications: async () => {
    return await apiRequest("/applications/")
  },

  // Apply for job
  applyForJob: async (jobId) => {
    return await apiRequest("/applications/", {
      method: "POST",
      body: JSON.stringify({
        job: jobId,
      }),
    })
  },

  // Get applications for employer - FIXED ENDPOINT
  getEmployerApplications: async () => {
    return await apiRequest("/applications/employer/")
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status) => {
    return await apiRequest(`/applications/status/${applicationId}/`, {
      method: "PATCH",
      body: JSON.stringify({
        application_status: status,
      }),
    })
  },

  // Filter applications
  getFilteredApplications: async (status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : ""
    return await apiRequest(`/applications/filter/${query}`)
  },
}

// Export the apiRequest function so it can be used in other components
export { apiRequest }