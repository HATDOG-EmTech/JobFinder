"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "../App"
import StatusCards from "./StatusCards"
import { jobAPI, applicationAPI, apiRequest } from "../api/auth"

function DashboardContent({ user, onJobsUpdate }) {
  const { isDark } = useTheme()

  // State for jobs posted by the current user
  const [postedJobs, setPostedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userApplications, setUserApplications] = useState([])

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null)
  const [showApplicants, setShowApplicants] = useState(false)
  const [showEditJob, setShowEditJob] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [showApplicantProfile, setShowApplicantProfile] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)

  const [loadingProfile, setLoadingProfile] = useState(false)
  const [applicantProfileData, setApplicantProfileData] = useState(null)

  // Fetch jobs posted by the current user
  const fetchPostedJobs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching jobs for user:", user?.id)

      // Get all jobs using the correct API
      const response = await jobAPI.getAllJobs()
      console.log("All jobs response:", response)

      // Filter jobs posted by current user
      const allJobs = response.results || response
      const userJobs = allJobs.filter((job) => job.author === user?.id)
      console.log("User jobs:", userJobs)

      // Transform the data to match the expected format
      const transformedJobs = userJobs.map((job) => ({
        job_id: job.id,
        user_id: job.author,
        job_title: job.job_title,
        job_company: job.job_company,
        job_location: job.job_location,
        job_setup: job.job_setup,
        job_type: job.job_type,
        min_salary: job.min_salary,
        max_salary: job.max_salary,
        job_description: job.job_description,
        job_requirements: job.job_requirements,
        job_benefits: job.job_benefits || "",
        datePosted: job.created_at,
        status: "Active", // Default status
        applicants: [], // Will be populated separately
      }))

      setPostedJobs(transformedJobs)

      // Fetch applications after setting jobs
      if (transformedJobs.length > 0) {
        await fetchApplicationsForJobs(transformedJobs)
      }
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError("Failed to load your job postings. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Fetch applications for each job
  const fetchApplicationsForJobs = useCallback(async (jobs) => {
    try {
      console.log("Fetching applications for employer...")

      // Get applications for employer using the correct API
      const response = await applicationAPI.getEmployerApplications()
      console.log("Applications response:", response)

      // FIXED: Handle the response structure correctly
      // The response is an object with 'results' property, not an array directly
      let applications = []

      if (Array.isArray(response)) {
        applications = response
      } else if (response && Array.isArray(response.results)) {
        applications = response.results
      } else if (response && response.data && Array.isArray(response.data)) {
        applications = response.data
      } else {
        console.log("Unexpected response structure:", response)
        applications = []
      }

      console.log("Processed applications array:", applications)

      if (applications.length === 0) {
        console.log("No applications found")
        return
      }

      // Group applications by job ID
      const applicationsByJob = applications.reduce((acc, app) => {
        console.log("Processing application:", app)

        // Use the job ID from the application
        const jobId = app.job

        if (!acc[jobId]) {
          acc[jobId] = []
        }

        acc[jobId].push({
          user_id: app.user || app.id, // Use user field if available, fallback to id
          application_id: app.id, // Store the actual application ID for status updates
          name: `${app.first_name || ""} ${app.last_name || ""}`.trim() || app.username || "Unknown User",
          email: app.email || "No email provided",
          phone: app.phone || "Not provided",
          location: app.location || "Not specified",
          bio: app.bio || "No bio available",
          skills: app.skills || "No skills listed",
          user_title: app.user_title || "Job Seeker",
          date: app.date || app.created_at,
          status: app.application_status || "Applied",
        })
        return acc
      }, {})

      console.log("Applications grouped by job:", applicationsByJob)

      // Update jobs with their applications
      const jobsWithApplications = jobs.map((job) => ({
        ...job,
        applicants: applicationsByJob[job.job_id] || [],
      }))

      console.log("Jobs with applications:", jobsWithApplications)
      setPostedJobs(jobsWithApplications)
    } catch (err) {
      console.error("Error fetching applications:", err)
      // Don't show error for applications, just log it
      console.log("Failed to fetch applications, continuing without them")
    }
  }, [])

  // Fetch user's own applications
  const fetchUserApplications = useCallback(async () => {
    try {
      console.log("Fetching user applications...")
      const response = await applicationAPI.getUserApplications()
      console.log("User applications response:", response)

      // Handle both array response and object with results
      let applications = []
      if (Array.isArray(response)) {
        applications = response
      } else if (response && Array.isArray(response.results)) {
        applications = response.results
      } else if (response && response.data && Array.isArray(response.data)) {
        applications = response.data
      }

      setUserApplications(applications)
      console.log("User applications set:", applications)
    } catch (err) {
      console.error("Error fetching user applications:", err)
      // Don't show error, just log it
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    if (user?.id) {
      fetchPostedJobs()
      fetchUserApplications()
    }
  }, [user?.id, fetchPostedJobs, fetchUserApplications])

  // Use useCallback to memoize the function and prevent infinite loops
  const updateJobsData = useCallback(() => {
    if (onJobsUpdate) {
      onJobsUpdate(postedJobs)
    }
  }, [postedJobs, onJobsUpdate])

  // Only call updateJobsData when postedJobs actually changes
  useEffect(() => {
    updateJobsData()
  }, [updateJobsData])

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [setupFilter, setSetupFilter] = useState("All")
  const [sortBy, setSortBy] = useState("Most Recent")

  // Unified typography system
  const typography = {
    pageTitle: {
      fontSize: "2.25rem",
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
    },
    pageSubtitle: {
      fontSize: "1.125rem",
      fontWeight: "400",
      lineHeight: "1.6",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "700",
      lineHeight: "1.3",
      letterSpacing: "-0.025em",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      lineHeight: "1.3",
    },
    bodyText: {
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.5",
    },
    labelText: {
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.4",
    },
    buttonText: {
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.4",
    },
    badgeText: {
      fontSize: "0.75rem",
      fontWeight: "700",
      lineHeight: "1.4",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  }

  // Theme-aware colors
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
    warning: "#f59e0b",
    danger: "#ef4444",
    // Profile modal colors that adapt to theme
    profileModalBg: isDark ? "#1e293b" : "#ffffff",
    profileModalText: isDark ? "#f8fafc" : "#0f172a",
    profileModalTextSecondary: isDark ? "#cbd5e1" : "#64748b",
    profileModalTextMuted: isDark ? "#94a3b8" : "#9ca3af",
    profileModalBorder: isDark ? "#334155" : "#e2e8f0",
    profileAccent: "#3b82f6",
    profileSectionBg: isDark ? "#334155" : "#f8fafc",
  }

  const dashboardStyles = {
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
    },
    subtitle: {
      ...typography.pageSubtitle,
      color: colors.textSecondary,
      margin: "0",
    },
    sectionTitle: {
      ...typography.sectionTitle,
      color: colors.text,
      marginBottom: "24px",
      marginTop: "48px",
    },
    // Filter styles
    filtersCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "28px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      marginBottom: "28px",
    },
    filtersGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr",
      gap: "20px",
      alignItems: "end",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      ...typography.labelText,
      color: colors.text,
      marginBottom: "8px",
    },
    searchContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    searchInput: {
      width: "100%",
      padding: "12px 16px 12px 40px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.bodyText,
      outline: "none",
      transition: "border-color 0.2s ease",
      fontFamily: "inherit",
      backgroundColor: colors.input,
      color: colors.text,
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: colors.textMuted,
      width: "16px",
      height: "16px",
      zIndex: 1,
    },
    select: {
      padding: "12px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.bodyText,
      outline: "none",
      backgroundColor: colors.input,
      color: colors.text,
      cursor: "pointer",
      fontFamily: "inherit",
    },
    resultsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    resultsText: {
      ...typography.bodyText,
      color: colors.textSecondary,
    },
    jobsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    jobCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "24px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      transition: "all 0.2s ease",
      cursor: "pointer",
    },
    jobCardHover: {
      transform: "translateY(-2px)",
      boxShadow: isDark ? "0 10px 25px rgba(0, 0, 0, 0.4)" : "0 8px 25px rgba(0, 0, 0, 0.1)",
    },
    jobHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    jobTitle: {
      ...typography.cardTitle,
      color: colors.text,
      marginBottom: "4px",
    },
    jobCompany: {
      ...typography.bodyText,
      color: colors.textSecondary,
      marginBottom: "12px",
    },
    jobDetails: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      marginBottom: "16px",
      ...typography.bodyText,
      color: colors.textSecondary,
    },
    jobDetailItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    jobDetailIcon: {
      width: "16px",
      height: "16px",
      color: colors.textMuted,
      flexShrink: 0,
    },
    jobDescription: {
      ...typography.bodyText,
      color: colors.textSecondary,
      lineHeight: "1.6",
      marginBottom: "16px",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    detailIcon: {
      width: "16px",
      height: "16px",
      color: colors.textMuted,
      flexShrink: 0,
    },
    jobActions: {
      display: "flex",
      gap: "12px",
      marginTop: "16px",
    },
    button: {
      padding: "8px 16px",
      borderRadius: "6px",
      ...typography.buttonText,
      cursor: "pointer",
      border: "none",
      outline: "none",
      boxShadow: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      fontSize: "0.875rem",
    },
    primaryButton: {
      backgroundColor: colors.accent,
      color: "white",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: colors.text,
      border: `1px solid ${colors.border}`,
    },
    dangerButton: {
      backgroundColor: colors.danger,
      color: "white",
    },
    acceptButton: {
      backgroundColor: colors.success,
      color: "white",
      padding: "6px 12px",
      fontSize: "0.75rem",
    },
    rejectButton: {
      backgroundColor: colors.danger,
      color: "white",
      padding: "6px 12px",
      fontSize: "0.75rem",
    },
    viewProfileButton: {
      backgroundColor: "transparent",
      color: colors.accent,
      border: `1px solid ${colors.accent}`,
      padding: "6px 12px",
      fontSize: "0.75rem",
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "12px",
      ...typography.badgeText,
      fontSize: "0.75rem",
    },
    noResults: {
      textAlign: "center",
      padding: "60px 20px",
      color: colors.textSecondary,
    },
    noResultsIcon: {
      fontSize: "48px",
      marginBottom: "16px",
      color: colors.textMuted,
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "32px",
      maxWidth: "800px",
      maxHeight: "80vh",
      overflow: "auto",
      margin: "20px",
      border: `1px solid ${colors.border}`,
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    modalTitle: {
      ...typography.cardTitle,
      color: colors.text,
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: colors.textMuted,
      padding: "4px",
    },
    applicantCard: {
      backgroundColor: isDark ? "#334155" : "#f8fafc",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "16px",
      border: `1px solid ${colors.border}`,
    },
    applicantHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    applicantInfo: {
      flex: 1,
    },
    applicantName: {
      ...typography.labelText,
      color: colors.text,
      marginBottom: "4px",
      fontSize: "1rem",
      fontWeight: "600",
    },
    applicantEmail: {
      ...typography.bodyText,
      color: colors.textSecondary,
      marginBottom: "12px",
    },
    applicantDetails: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "16px",
      ...typography.bodyText,
      color: colors.textSecondary,
    },
    applicantActions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    // Profile Modal Styles - Enhanced for dark mode
    profileModal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1001,
      backdropFilter: "blur(4px)",
    },
    profileModalContent: {
      backgroundColor: colors.profileModalBg,
      borderRadius: "20px",
      padding: "40px",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "90vh",
      overflow: "auto",
      margin: "20px",
      border: `1px solid ${colors.profileModalBorder}`,
      color: colors.profileModalText,
      textAlign: "center",
      boxShadow: isDark
        ? "0 25px 50px rgba(0, 0, 0, 0.6), 0 10px 20px rgba(0, 0, 0, 0.4)"
        : "0 25px 50px rgba(0, 0, 0, 0.2), 0 10px 20px rgba(0, 0, 0, 0.1)",
      position: "relative",
    },
    profileAvatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      backgroundColor: colors.profileAccent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 24px",
      fontSize: "32px",
      fontWeight: "bold",
      color: "white",
      boxShadow: isDark ? "0 8px 16px rgba(59, 130, 246, 0.3)" : "0 8px 16px rgba(59, 130, 246, 0.2)",
    },
    profileName: {
      fontSize: "1.75rem",
      fontWeight: "700",
      color: colors.profileModalText,
      marginBottom: "8px",
      lineHeight: "1.2",
    },
    profileTitle: {
      fontSize: "1.125rem",
      color: colors.profileModalTextSecondary,
      marginBottom: "32px",
      fontWeight: "500",
    },
    profileContactItem: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "20px",
      padding: "12px 16px",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
      borderRadius: "12px",
      color: colors.profileModalTextSecondary,
      fontSize: "0.95rem",
      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
    },
    profileContactIcon: {
      width: "20px",
      height: "20px",
      color: colors.profileAccent,
      flexShrink: 0,
    },
    profileSection: {
      marginTop: "32px",
      textAlign: "left",
      backgroundColor: colors.profileSectionBg,
      borderRadius: "12px",
      padding: "20px",
      border: `1px solid ${colors.profileModalBorder}`,
    },
    profileSectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: colors.profileModalText,
      marginBottom: "16px",
      borderBottom: `2px solid ${colors.profileAccent}`,
      paddingBottom: "8px",
      display: "inline-block",
    },
    profileSectionContent: {
      fontSize: "0.95rem",
      color: colors.profileModalTextSecondary,
      lineHeight: "1.7",
    },
    profileSocialButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      width: "100%",
      padding: "16px 20px",
      marginBottom: "16px",
      backgroundColor: "transparent",
      border: `2px solid ${colors.profileModalBorder}`,
      borderRadius: "12px",
      color: colors.profileModalTextSecondary,
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textDecoration: "none",
    },
    profileSocialButtonHover: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      borderColor: colors.profileAccent,
      color: colors.profileAccent,
      transform: "translateY(-2px)",
    },
    profileCloseButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: colors.profileModalTextMuted,
      padding: "8px",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    profileCloseButtonHover: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
      color: colors.profileModalText,
      transform: "scale(1.1)",
    },
    // Edit Job Modal Styles
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "20px",
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
    input: {
      padding: "12px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.bodyText,
      outline: "none",
      boxShadow: "none",
      transition: "border-color 0.2s ease",
      fontFamily: "inherit",
      backgroundColor: colors.input,
      color: colors.text,
    },
    textarea: {
      padding: "12px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.bodyText,
      outline: "none",
      boxShadow: "none",
      resize: "vertical",
      minHeight: "100px",
      fontFamily: "inherit",
      lineHeight: "1.6",
      backgroundColor: colors.input,
      color: colors.text,
    },
    modalActions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "24px",
      paddingTop: "20px",
      borderTop: `1px solid ${colors.border}`,
    },
    characterCount: {
      fontSize: "0.75rem",
      color: colors.textMuted,
      textAlign: "right",
      marginTop: "4px",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px 20px",
      color: colors.textSecondary,
    },
    errorContainer: {
      backgroundColor: isDark ? "#7f1d1d" : "#fef2f2",
      border: `1px solid ${isDark ? "#dc2626" : "#fecaca"}`,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "24px",
      color: isDark ? "#fca5a5" : "#dc2626",
    },
    refreshButton: {
      backgroundColor: colors.accent,
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "8px 16px",
      cursor: "pointer",
      marginTop: "12px",
      fontSize: "0.875rem",
      fontWeight: "600",
    },
  }

  // Calculate dashboard statistics
  const getDashboardStats = () => {
    const totalJobsPosted = postedJobs.length
    const totalApplicants = postedJobs.reduce((sum, job) => sum + job.applicants.length, 0)
    const totalJobsApplied = userApplications.length // Use real data instead of mock

    return {
      totalJobsPosted,
      totalJobsApplied,
      totalApplicants,
    }
  }

  // Filter and sort jobs
  const getFilteredJobs = () => {
    const filtered = postedJobs.filter((job) => {
      const matchesSearch =
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = typeFilter === "All" || job.job_type === typeFilter
      const matchesSetup = setupFilter === "All" || job.job_setup === setupFilter

      return matchesSearch && matchesType && matchesSetup
    })

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Most Recent":
          return new Date(b.datePosted) - new Date(a.datePosted)
        case "Oldest First":
          return new Date(a.datePosted) - new Date(b.datePosted)
        case "Title A-Z":
          return a.job_title.localeCompare(b.job_title)
        case "Title Z-A":
          return b.job_title.localeCompare(a.job_title)
        case "Most Applicants":
          return b.applicants.length - a.applicants.length
        case "Least Applicants":
          return a.applicants.length - b.applicants.length
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredJobs = getFilteredJobs()
  const dashboardStats = getDashboardStats()

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?"
    const names = name.split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  // SVG Icon Components
  const SearchIcon = () => (
    <svg style={dashboardStyles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const LocationIcon = () => (
    <svg style={dashboardStyles.jobDetailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const BriefcaseIcon = () => (
    <svg style={dashboardStyles.jobDetailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const HomeIcon = () => (
    <svg style={dashboardStyles.jobDetailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" />
      <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const PesoIcon = () => (
    <svg style={dashboardStyles.detailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="3" x2="8" y2="21" stroke="currentColor" strokeWidth="2" />
      <path d="M8 5h5a4 4 0 1 1 0 8H8" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const CalendarIcon = () => (
    <svg style={dashboardStyles.jobDetailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const UsersIcon = () => (
    <svg style={dashboardStyles.jobDetailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const EmailIcon = () => (
    <svg style={dashboardStyles.profileContactIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const PhoneIcon = () => (
    <svg style={dashboardStyles.profileContactIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )

  const MapPinIcon = () => (
    <svg style={dashboardStyles.profileContactIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const UserIcon = () => (
    <svg style={dashboardStyles.profileContactIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const GithubIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const LinkedinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="9"
        width="4"
        height="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const getApplicantStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return { backgroundColor: "#dbeafe", color: "#1e40af" }
      case "Under Review":
        return { backgroundColor: "#fef3c7", color: "#92400e" }
      case "Interview":
        return { backgroundColor: "#dcfce7", color: "#16a34a" }
      case "Accepted":
        return { backgroundColor: "#f3e8ff", color: "#7c3aed" }
      case "Rejected":
        return { backgroundColor: "#fee2e2", color: "#dc2626" }
      default:
        return { backgroundColor: "#f1f5f9", color: "#64748b" }
    }
  }

  const handleStatusChange = async (jobId, applicationId, newStatus) => {
    try {
      console.log("Updating application status:", { applicationId, newStatus })

      await applicationAPI.updateApplicationStatus(applicationId, newStatus)

      setPostedJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.job_id === jobId
            ? {
                ...job,
                applicants: job.applicants.map((applicant) =>
                  applicant.application_id === applicationId ? { ...applicant, status: newStatus } : applicant,
                ),
              }
            : job,
        ),
      )

      console.log("Application status updated successfully")
    } catch (err) {
      console.error("Error updating application status:", err)
      alert("Failed to update application status. Please try again.")
    }
  }

  const handleAcceptApplicant = async (jobId, applicationId, currentStatus) => {
    let newStatus
    let confirmMessage
    let successMessage

    // Determine the new status based on current status
    if (currentStatus === "Under Review") {
      newStatus = "Interview"
      confirmMessage = "Move this applicant to Interview stage?"
      successMessage = "Applicant moved to Interview stage!"
    } else if (currentStatus === "Interview") {
      newStatus = "Accepted"
      confirmMessage = "Accept this applicant for the position?"
      successMessage = "Applicant accepted! They have been notified."
    } else {
      // For other statuses, show appropriate message
      alert(
        `Cannot accept applicant with status "${currentStatus}". Please update status to "Under Review" or "Interview" first.`,
      )
      return
    }

    // Confirm the action
    if (window.confirm(confirmMessage)) {
      try {
        await handleStatusChange(jobId, applicationId, newStatus)
        alert(successMessage)
        // Close the modal after successful action
        closeModal()
      } catch (error) {
        console.error("Error accepting applicant:", error)
        alert("Failed to update applicant status. Please try again.")
      }
    }
  }

  const handleRejectApplicant = async (jobId, applicationId) => {
    if (window.confirm("Are you sure you want to reject this applicant? This action cannot be undone.")) {
      try {
        await handleStatusChange(jobId, applicationId, "Rejected")
        alert("Applicant rejected. They have been notified.")
        // Close the modal after successful action
        closeModal()
      } catch (error) {
        console.error("Error rejecting applicant:", error)
        alert("Failed to reject applicant. Please try again.")
      }
    }
  }

  const fetchUserProfile = async (userId) => {
    try {
      console.log("Fetching user profile for ID:", userId)
      const response = await apiRequest(`/user/search/?q=${encodeURIComponent(userId.toString())}`)
      console.log("User profile response:", response)

      if (response && response.results && response.results.length > 0) {
        return response.results[0]
      }
      return null
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  const fetchApplicantCompleteProfile = async (applicant) => {
    setLoadingProfile(true)
    setApplicantProfileData(null)

    try {
      console.log("Fetching complete profile for applicant:", applicant)
      let profileData = null

      // Try to fetch user profile by user_id first
      if (applicant.user_id) {
        profileData = await fetchUserProfile(applicant.user_id)
      }

      // If no profile found and we have email, try searching by email
      if (!profileData && applicant.email && applicant.email !== "No email provided") {
        const searchResponse = await apiRequest(`/user/search/?q=${encodeURIComponent(applicant.email)}`)
        if (searchResponse && searchResponse.results && searchResponse.results.length > 0) {
          profileData = searchResponse.results[0]
        }
      }

      if (profileData) {
        console.log("Found complete profile data:", profileData)
        const completeProfile = {
          ...profileData,
          application_id: applicant.application_id,
          application_status: applicant.status,
          application_date: applicant.date,
          applied_job_id: selectedJob?.job_id,
          applied_job_title: selectedJob?.job_title,
        }
        setApplicantProfileData(completeProfile)
      } else {
        console.log("Could not find complete profile, using application data")
        setApplicantProfileData({
          ...applicant,
          error: "Could not load complete profile",
        })
      }
    } catch (error) {
      console.error("Error fetching complete profile:", error)
      setApplicantProfileData({
        ...applicant,
        error: "Could not load complete profile",
      })
    } finally {
      setLoadingProfile(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const getProfileValue = (profile, field, fallback = "Not specified") => {
    if (!profile) return fallback
    const value = profile[field]
    if (!value || value === "" || value === "null" || value === null) return fallback
    return value
  }

  const handleViewProfile = async (applicant) => {
    console.log("Viewing profile for applicant:", applicant)
    setSelectedApplicant(applicant)
    setShowApplicantProfile(true)
    await fetchApplicantCompleteProfile(applicant)
  }

  const handleViewApplicants = (job) => {
    setSelectedJob(job)
    setShowApplicants(true)
  }

  const handleEditJob = (job) => {
    setEditingJob({ ...job })
    setShowEditJob(true)
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      try {
        await jobAPI.deleteJob(jobId)
        setPostedJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== jobId))
        alert("Job posting deleted successfully.")
      } catch (err) {
        console.error("Error deleting job:", err)
        alert("Failed to delete job posting. Please try again.")
      }
    }
  }

  const handleSaveJob = async () => {
    // Validate required fields based on database schema
    const requiredFields = [
      "job_title",
      "job_company",
      "job_location",
      "job_setup",
      "job_type",
      "min_salary",
      "max_salary",
      "job_description",
      "job_requirements",
    ]

    const missingFields = requiredFields.filter((field) => !editingJob[field]?.toString().trim())

    if (missingFields.length > 0) {
      alert("Please fill in all required fields.")
      return
    }

    try {
      const jobData = {
        job_title: editingJob.job_title.trim(),
        job_company: editingJob.job_company.trim(),
        job_location: editingJob.job_location.trim(),
        job_setup: editingJob.job_setup,
        job_type: editingJob.job_type,
        min_salary: editingJob.min_salary.toString().trim(),
        max_salary: editingJob.max_salary.toString().trim(),
        job_description: editingJob.job_description.trim(),
        job_requirements: editingJob.job_requirements.trim(),
        job_benefits: editingJob.job_benefits?.trim() || "",
      }

      await jobAPI.updateJob(editingJob.job_id, jobData)

      // Update the job in the local state
      setPostedJobs((prevJobs) =>
        prevJobs.map((job) => (job.job_id === editingJob.job_id ? { ...job, ...jobData } : job)),
      )

      setShowEditJob(false)
      setEditingJob(null)
      alert("Job updated successfully!")
    } catch (err) {
      console.error("Error updating job:", err)
      alert("Failed to update job. Please try again.")
    }
  }

  const handleEditInputChange = (field, value) => {
    setEditingJob((prev) => ({ ...prev, [field]: value }))
  }

  const closeModal = () => {
    setShowApplicants(false)
    setSelectedJob(null)
  }

  const closeEditModal = () => {
    setShowEditJob(false)
    setEditingJob(null)
  }

  const closeProfileModal = () => {
    setShowApplicantProfile(false)
    setSelectedApplicant(null)
    setApplicantProfileData(null)
  }

  const handleRefresh = () => {
    fetchPostedJobs()
  }

  // Loading state
  if (loading) {
    return (
      <div style={dashboardStyles.container}>
        <div style={dashboardStyles.loadingContainer}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <h3 style={{ color: colors.text, marginBottom: "8px" }}>Loading your job postings...</h3>
            <p>Please wait while we fetch your data.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.header}>
        <h1 style={dashboardStyles.title}>Welcome back, {user?.first_name || user?.username || "User"}!</h1>
        <p style={dashboardStyles.subtitle}>Here's an overview of your job postings and applicant management.</p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={dashboardStyles.errorContainer}>
          <strong>Error:</strong> {error}
          <button style={dashboardStyles.refreshButton} onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      )}

      {/* Status Cards with Dashboard Stats */}
      <StatusCards dashboardStats={dashboardStats} />

      {/* Job Filters */}
      <div style={dashboardStyles.filtersCard}>
        <div style={dashboardStyles.filtersGrid}>
          <div style={dashboardStyles.inputGroup}>
            <label style={dashboardStyles.label}>Search Jobs</label>
            <div style={dashboardStyles.searchContainer}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={dashboardStyles.searchInput}
              />
            </div>
          </div>

          <div style={dashboardStyles.inputGroup}>
            <label style={dashboardStyles.label}>Job Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={dashboardStyles.select}>
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div style={dashboardStyles.inputGroup}>
            <label style={dashboardStyles.label}>Work Setup</label>
            <select value={setupFilter} onChange={(e) => setSetupFilter(e.target.value)} style={dashboardStyles.select}>
              <option value="All">All Setups</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div style={dashboardStyles.inputGroup}>
            <label style={dashboardStyles.label}>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={dashboardStyles.select}>
              <option value="Most Recent">Most Recent</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Title A-Z">Title A-Z</option>
              <option value="Title Z-A">Title Z-A</option>
              <option value="Most Applicants">Most Applicants</option>
              <option value="Least Applicants">Least Applicants</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={dashboardStyles.resultsHeader}>
        <div style={dashboardStyles.resultsText}>
          Showing {filteredJobs.length} of {postedJobs.length} jobs
        </div>
      </div>

      {/* Posted Jobs Section */}
      {filteredJobs.length === 0 ? (
        <div style={dashboardStyles.noResults}>
          <div style={dashboardStyles.noResultsIcon}>📋</div>
          <h3 style={{ color: colors.text, marginBottom: "8px" }}>
            {postedJobs.length === 0 ? "No jobs posted yet" : "No jobs found"}
          </h3>
          <p>
            {postedJobs.length === 0
              ? "Start by posting your first job to attract candidates"
              : "Try adjusting your search criteria or filters"}
          </p>
        </div>
      ) : (
        <div style={dashboardStyles.jobsGrid}>
          {filteredJobs.map((job) => (
            <div
              key={job.job_id}
              style={dashboardStyles.jobCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, dashboardStyles.jobCardHover)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none"
                e.currentTarget.style.boxShadow = isDark
                  ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
                  : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)"
              }}
            >
              <div style={dashboardStyles.jobHeader}>
                <div>
                  <h3 style={dashboardStyles.jobTitle}>{job.job_title}</h3>
                  <p style={dashboardStyles.jobCompany}>{job.job_company}</p>
                </div>
              </div>

              <div style={dashboardStyles.jobDetails}>
                <div style={dashboardStyles.jobDetailItem}>
                  <LocationIcon />
                  <span>{job.job_location}</span>
                </div>
                <div style={dashboardStyles.jobDetailItem}>
                  <BriefcaseIcon />
                  <span>{job.job_type}</span>
                </div>
                <div style={dashboardStyles.jobDetailItem}>
                  <HomeIcon />
                  <span>{job.job_setup}</span>
                </div>
                <div style={dashboardStyles.jobDetailItem}>
                  <PesoIcon />
                  <span>
                    {job.min_salary} - {job.max_salary}
                  </span>
                </div>
              </div>

              <div style={dashboardStyles.jobDetails}>
                <div style={dashboardStyles.jobDetailItem}>
                  <CalendarIcon />
                  <span>Posted: {new Date(job.datePosted).toLocaleDateString()}</span>
                </div>
                <div style={dashboardStyles.jobDetailItem}>
                  <UsersIcon />
                  <span>
                    {job.applicants.length} applicant{job.applicants.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Job Description Preview */}
              <div style={dashboardStyles.jobDescription}>{job.job_description}</div>

              <div style={dashboardStyles.jobActions}>
                <button
                  style={{
                    ...dashboardStyles.button,
                    ...dashboardStyles.primaryButton,
                  }}
                  onClick={() => handleViewApplicants(job)}
                >
                  View Applicants ({job.applicants.length})
                </button>
                <button
                  style={{
                    ...dashboardStyles.button,
                    ...dashboardStyles.secondaryButton,
                  }}
                  onClick={() => handleEditJob(job)}
                >
                  Edit Job
                </button>
                <button
                  style={{
                    ...dashboardStyles.button,
                    ...dashboardStyles.dangerButton,
                  }}
                  onClick={() => handleDeleteJob(job.job_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJob && editingJob && (
        <div style={dashboardStyles.modal} onClick={closeEditModal}>
          <div style={dashboardStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={dashboardStyles.modalHeader}>
              <h2 style={dashboardStyles.modalTitle}>Edit Job: {editingJob.job_title}</h2>
              <button style={dashboardStyles.closeButton} onClick={closeEditModal}>
                ×
              </button>
            </div>

            <div style={dashboardStyles.formGrid}>
              <div style={dashboardStyles.formGroup}>
                <label style={dashboardStyles.label}>Job Title * (max 30 chars)</label>
                <input
                  type="text"
                  value={editingJob.job_title}
                  onChange={(e) => handleEditInputChange("job_title", e.target.value)}
                  style={dashboardStyles.input}
                  maxLength="30"
                />
                <div style={dashboardStyles.characterCount}>{editingJob.job_title.length}/30 characters</div>
              </div>

              <div style={dashboardStyles.formGroup}>
                <label style={dashboardStyles.label}>Company * (max 100 chars)</label>
                <input
                  type="text"
                  value={editingJob.job_company}
                  onChange={(e) => handleEditInputChange("job_company", e.target.value)}
                  style={dashboardStyles.input}
                  maxLength="100"
                />
                <div style={dashboardStyles.characterCount}>{editingJob.job_company.length}/100 characters</div>
              </div>

              <div style={dashboardStyles.formGroup}>
                <label style={dashboardStyles.label}>Location * (max 100 chars)</label>
                <input
                  type="text"
                  value={editingJob.job_location}
                  onChange={(e) => handleEditInputChange("job_location", e.target.value)}
                  style={dashboardStyles.input}
                  maxLength="100"
                />
                <div style={dashboardStyles.characterCount}>{editingJob.job_location.length}/100 characters</div>
              </div>

              <div style={dashboardStyles.formGroup}>
                <label style={dashboardStyles.label}>Work Setup *</label>
                <select
                  value={editingJob.job_setup}
                  onChange={(e) => handleEditInputChange("job_setup", e.target.value)}
                  style={dashboardStyles.select}
                >
                  <option value="Onsite">Onsite</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div style={dashboardStyles.formGroup}>
                <label style={dashboardStyles.label}>Job Type *</label>
                <select
                  value={editingJob.job_type}
                  onChange={(e) => handleEditInputChange("job_type", e.target.value)}
                  style={dashboardStyles.select}
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div style={dashboardStyles.formGroup}>
                <label style={dashboardStyles.label}>Status</label>
                <select
                  value={editingJob.status}
                  onChange={(e) => handleEditInputChange("status", e.target.value)}
                  style={dashboardStyles.select}
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div style={dashboardStyles.formGroup}>
                <label style={dashboardStyles.label}>Minimum Salary * (max 20 chars)</label>
                <input
                  type="text"
                  value={editingJob.min_salary}
                  onChange={(e) => handleEditInputChange("min_salary", e.target.value)}
                  style={dashboardStyles.input}
                  maxLength="20"
                />
                <div style={dashboardStyles.characterCount}>
                  {editingJob.min_salary.toString().length}/20 characters
                </div>
              </div>

              <div style={dashboardStyles.formGroup}>
                <label style={dashboardStyles.label}>Maximum Salary * (max 20 chars)</label>
                <input
                  type="text"
                  value={editingJob.max_salary}
                  onChange={(e) => handleEditInputChange("max_salary", e.target.value)}
                  style={dashboardStyles.input}
                  maxLength="20"
                />
                <div style={dashboardStyles.characterCount}>
                  {editingJob.max_salary.toString().length}/20 characters
                </div>
              </div>
            </div>

            <div style={dashboardStyles.formGroupFull}>
              <label style={dashboardStyles.label}>Job Description * (max 500 chars)</label>
              <textarea
                value={editingJob.job_description}
                onChange={(e) => handleEditInputChange("job_description", e.target.value)}
                style={dashboardStyles.textarea}
                maxLength="500"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
              <div style={dashboardStyles.characterCount}>{editingJob.job_description.length}/500 characters</div>
            </div>

            <div style={dashboardStyles.formGroupFull}>
              <label style={dashboardStyles.label}>Job Requirements * (max 500 chars)</label>
              <textarea
                value={editingJob.job_requirements}
                onChange={(e) => handleEditInputChange("job_requirements", e.target.value)}
                style={dashboardStyles.textarea}
                maxLength="500"
                placeholder="List the required qualifications, experience, and skills..."
              />
              <div style={dashboardStyles.characterCount}>{editingJob.job_requirements.length}/500 characters</div>
            </div>

            <div style={dashboardStyles.formGroupFull}>
              <label style={dashboardStyles.label}>Job Benefits (optional, max 500 chars)</label>
              <textarea
                value={editingJob.job_benefits || ""}
                onChange={(e) => handleEditInputChange("job_benefits", e.target.value)}
                style={dashboardStyles.textarea}
                maxLength="500"
                placeholder="Health insurance, 401k, flexible hours, remote work..."
              />
              <div style={dashboardStyles.characterCount}>{(editingJob.job_benefits || "").length}/500 characters</div>
            </div>

            <div style={dashboardStyles.modalActions}>
              <button
                style={{
                  ...dashboardStyles.button,
                  ...dashboardStyles.secondaryButton,
                }}
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                style={{
                  ...dashboardStyles.button,
                  ...dashboardStyles.primaryButton,
                }}
                onClick={handleSaveJob}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicants && selectedJob && (
        <div style={dashboardStyles.modal} onClick={closeModal}>
          <div style={dashboardStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={dashboardStyles.modalHeader}>
              <h2 style={dashboardStyles.modalTitle}>Applicants for {selectedJob.job_title}</h2>
              <button style={dashboardStyles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>

            {selectedJob.applicants.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
                <h3 style={{ color: colors.text, marginBottom: "8px" }}>No applicants yet</h3>
                <p>Applications will appear here once candidates apply for this position.</p>
              </div>
            ) : (
              selectedJob.applicants.map((applicant) => (
                <div key={applicant.application_id} style={dashboardStyles.applicantCard}>
                  <div style={dashboardStyles.applicantHeader}>
                    <div style={dashboardStyles.applicantInfo}>
                      <div style={dashboardStyles.applicantName}>{applicant.name}</div>
                      <div style={dashboardStyles.applicantEmail}>{applicant.email}</div>
                    </div>
                    <div
                      style={{
                        ...dashboardStyles.statusBadge,
                        ...getApplicantStatusColor(applicant.status),
                      }}
                    >
                      {applicant.status}
                    </div>
                  </div>

                  <div style={dashboardStyles.applicantDetails}>
                    <div>
                      <strong>Applied:</strong> {new Date(applicant.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={dashboardStyles.applicantActions}>
                    <button
                      style={{
                        ...dashboardStyles.button,
                        ...dashboardStyles.viewProfileButton,
                      }}
                      onClick={() => handleViewProfile(applicant)}
                    >
                      View Profile
                    </button>

                    {(applicant.status === "Under Review" || applicant.status === "Interview") && (
                      <>
                        <button
                          style={{
                            ...dashboardStyles.button,
                            ...dashboardStyles.acceptButton,
                          }}
                          onClick={() =>
                            handleAcceptApplicant(selectedJob.job_id, applicant.application_id, applicant.status)
                          }
                        >
                          {applicant.status === "Under Review"
                            ? "Move to Interview"
                            : applicant.status === "Interview"
                              ? "Accept"
                              : "Accept"}
                        </button>
                        <button
                          style={{
                            ...dashboardStyles.button,
                            ...dashboardStyles.rejectButton,
                          }}
                          onClick={() => handleRejectApplicant(selectedJob.job_id, applicant.application_id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Applicant Profile Modal */}
      {showApplicantProfile && selectedApplicant && (
        <div style={dashboardStyles.profileModal} onClick={closeProfileModal}>
          <div
            style={{ ...dashboardStyles.profileModalContent, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={dashboardStyles.profileCloseButton}
              onClick={closeProfileModal}
              onMouseEnter={(e) => Object.assign(e.target.style, dashboardStyles.profileCloseButtonHover)}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                e.target.style.color = colors.profileModalTextMuted
                e.target.style.transform = "scale(1)"
              }}
            >
              ×
            </button>

            {loadingProfile ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>⏳</div>
                <p>Loading complete profile...</p>
              </div>
            ) : applicantProfileData ? (
              <>
                <div style={dashboardStyles.profileAvatar}>
                  {getInitials(
                    getProfileValue(applicantProfileData, "first_name") +
                      " " +
                      getProfileValue(applicantProfileData, "last_name"),
                  )}
                </div>

                <h2 style={dashboardStyles.profileName}>
                  {getProfileValue(applicantProfileData, "first_name")}{" "}
                  {getProfileValue(applicantProfileData, "last_name")}
                </h2>
                <p style={dashboardStyles.profileTitle}>
                  {getProfileValue(applicantProfileData, "user_title", "Job Seeker")}
                </p>

                <div style={dashboardStyles.profileContactItem}>
                  <EmailIcon />
                  <span>{getProfileValue(applicantProfileData, "email")}</span>
                </div>

                <div style={dashboardStyles.profileContactItem}>
                  <PhoneIcon />
                  <span>{getProfileValue(applicantProfileData, "mobile", "Phone not provided")}</span>
                </div>

                <div style={dashboardStyles.profileContactItem}>
                  <MapPinIcon />
                  <span>{getProfileValue(applicantProfileData, "location")}</span>
                </div>

                <div style={dashboardStyles.profileContactItem}>
                  <CalendarIcon />
                  <span>Applied: {formatDate(applicantProfileData.application_date || selectedApplicant.date)}</span>
                </div>

                {getProfileValue(applicantProfileData, "bio") !== "Not specified" && (
                  <div style={dashboardStyles.profileSection}>
                    <h3 style={dashboardStyles.profileSectionTitle}>About</h3>
                    <p style={dashboardStyles.profileSectionContent}>{getProfileValue(applicantProfileData, "bio")}</p>
                  </div>
                )}

                {getProfileValue(applicantProfileData, "skills") !== "Not specified" && (
                  <div style={dashboardStyles.profileSection}>
                    <h3 style={dashboardStyles.profileSectionTitle}>Skills</h3>
                    <p style={dashboardStyles.profileSectionContent}>
                      {getProfileValue(applicantProfileData, "skills")}
                    </p>
                  </div>
                )}

                <div style={{ marginTop: "24px" }}>
                  {getProfileValue(applicantProfileData, "github") !== "Not specified" && (
                    <a
                      href={getProfileValue(applicantProfileData, "github")}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={dashboardStyles.profileSocialButton}
                      onMouseEnter={(e) => Object.assign(e.target.style, dashboardStyles.profileSocialButtonHover)}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent"
                        e.target.style.borderColor = colors.profileModalBorder
                        e.target.style.color = colors.profileModalTextSecondary
                        e.target.style.transform = "translateY(0)"
                      }}
                    >
                      <GithubIcon />
                      GitHub Profile
                    </a>
                  )}

                  {getProfileValue(applicantProfileData, "linkedin") !== "Not specified" && (
                    <a
                      href={getProfileValue(applicantProfileData, "linkedin")}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={dashboardStyles.profileSocialButton}
                      onMouseEnter={(e) => Object.assign(e.target.style, dashboardStyles.profileSocialButtonHover)}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent"
                        e.target.style.borderColor = colors.profileModalBorder
                        e.target.style.color = colors.profileModalTextSecondary
                        e.target.style.transform = "translateY(0)"
                      }}
                    >
                      <LinkedinIcon />
                      LinkedIn Profile
                    </a>
                  )}

                  {/* Show message if no social links are available */}
                  {getProfileValue(applicantProfileData, "github") === "Not specified" &&
                    getProfileValue(applicantProfileData, "linkedin") === "Not specified" && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          color: colors.profileModalTextMuted,
                          fontSize: "0.875rem",
                          fontStyle: "italic",
                        }}
                      >
                        No social profiles available
                      </div>
                    )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
                <h3>Profile Not Found</h3>
                <p>Unable to load the complete profile for this applicant.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardContent