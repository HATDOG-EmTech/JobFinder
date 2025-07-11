"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../App"
import { applicationAPI } from "../api/auth"
import api from "../api"
import JobDetailsModal from "./JobDetailsModal"

function ApplicationsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [setupFilter, setSetupFilter] = useState("All")
  const [sortBy, setSortBy] = useState("Most Recent")
  const [activeTab, setActiveTab] = useState("All")
  const [applications, setApplications] = useState([])
  const [jobDetails, setJobDetails] = useState({}) // Store job details by job ID
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiErrors, setApiErrors] = useState([]) // Track API errors for debugging

  // Modal state
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    cardTitle: {
      fontSize: "1.25rem", // 20px
      fontWeight: "700",
      lineHeight: "1.3",
      letterSpacing: "-0.025em",
    },
    companyText: {
      fontSize: "1rem", // 16px
      fontWeight: "500",
      lineHeight: "1.4",
    },
    bodyText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.5",
    },
    labelText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    buttonText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    tabText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    badgeText: {
      fontSize: "0.75rem", // 12px
      fontWeight: "700",
      lineHeight: "1.4",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
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
    hover: isDark ? "#334155" : "#f8fafc",
    dropdown: isDark ? "#1e293b" : "white",
    dropdownBorder: isDark ? "#334155" : "#e2e8f0",
    accent: "#3b82f6",
  }

  // Try multiple API endpoints to find the correct one for job details
  const tryFetchJobDetails = async (jobId) => {
    const possibleEndpoints = [
      `/api/jobs/${jobId}/`,
      `/api/job/${jobId}/`,
      `/api/jobposting/${jobId}/`,
      `/api/jobpostings/${jobId}/`,
      `/jobs/${jobId}/`,
      `/job/${jobId}/`,
      `/jobposting/${jobId}/`,
      `/jobpostings/${jobId}/`,
    ]

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const response = await api.get(endpoint)
        console.log(`SUCCESS: Job details from ${endpoint}:`, response.data)
        return { success: true, data: response.data, endpoint }
      } catch (error) {
        console.log(`FAILED: ${endpoint} - Status: ${error.response?.status}, Message: ${error.message}`)
        // Continue to next endpoint
      }
    }

    // If all endpoints fail, return failure info
    return {
      success: false,
      error: `All endpoints failed for job ID ${jobId}`,
      endpoints: possibleEndpoints,
    }
  }

  // NEW CODE - Fetch applications with job details included
  useEffect(() => {
    const fetchApplicationsWithJobDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        setApiErrors([])

        console.log("Fetching user applications with job details...")

        // Try to get applications with expanded job details
        const response = await applicationAPI.getUserApplications()
        console.log("Applications response:", response)

        // Handle both paginated and direct array responses
        const applicationsData = response.results || response

        if (Array.isArray(applicationsData)) {
          console.log("Raw applications data:", applicationsData)

          // If job details are not included, we need to fetch them separately
          if (applicationsData.length > 0 && typeof applicationsData[0].job === "number") {
            console.log("Job details not included, trying to fetch separately...")

            // Extract unique job IDs
            const jobIds = [...new Set(applicationsData.map((app) => app.job).filter(Boolean))]
            console.log("Unique job IDs to fetch:", jobIds)

            const jobDetailsMap = {}
            const errors = []

            // Try to fetch job details for each unique job ID
            for (const jobId of jobIds) {
              const result = await tryFetchJobDetails(jobId)

              if (result.success) {
                jobDetailsMap[jobId] = result.data
                console.log(`✅ Successfully fetched job ${jobId} from ${result.endpoint}`)
              } else {
                jobDetailsMap[jobId] = null
                errors.push({
                  jobId,
                  error: result.error,
                  endpoints: result.endpoints,
                })
                console.error(`❌ Failed to fetch job ${jobId}:`, result.error)
              }
            }

            console.log("Final job details map:", jobDetailsMap)
            console.log("API errors:", errors)

            setJobDetails(jobDetailsMap)
            setApiErrors(errors)
          } else {
            console.log("Job details appear to be included in the response")
            // Job details are already included, no need to fetch separately
            setJobDetails({})
          }

          setApplications(applicationsData)
        } else {
          console.error("Invalid applications data format:", response)
          setError("Invalid data format received")
        }
      } catch (err) {
        console.error("Error fetching applications:", err)
        setError("Failed to load applications. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplicationsWithJobDetails()
  }, [])

  const applicationsStyles = {
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
      padding: "14px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.bodyText,
      outline: "none",
      backgroundColor: colors.input,
      color: colors.text,
      cursor: "pointer",
      fontFamily: "inherit",
    },
    tabsContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "8px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      marginBottom: "28px",
    },
    tabs: {
      display: "flex",
      gap: "4px",
    },
    tab: {
      flex: 1,
      padding: "14px 18px",
      borderRadius: "8px",
      ...typography.tabText,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
      border: "none",
      backgroundColor: "transparent",
      color: colors.textSecondary,
      fontFamily: "inherit",
    },
    activeTab: {
      backgroundColor: colors.accent,
      color: "white",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    applicationCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "28px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      marginBottom: "20px",
      transition: "all 0.2s ease",
    },
    applicationHeader: {
      display: "flex",
      alignItems: "flex-start",
      gap: "20px",
      marginBottom: "20px",
    },
    companyLogo: {
      width: "56px",
      height: "56px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      fontWeight: "700",
      color: "white",
      flexShrink: 0,
    },
    applicationInfo: {
      flex: 1,
    },
    jobTitle: {
      ...typography.cardTitle,
      color: colors.text,
      marginBottom: "6px",
    },
    company: {
      ...typography.companyText,
      color: colors.textSecondary,
      marginBottom: "16px",
    },
    statusBadge: {
      padding: "8px 14px",
      borderRadius: "16px",
      ...typography.badgeText,
    },
    applicationDetails: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      ...typography.bodyText,
      color: colors.textSecondary,
      marginBottom: "16px",
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    detailIcon: {
      width: "16px",
      height: "16px",
      color: colors.textMuted,
      flexShrink: 0,
    },
    additionalInfo: {
      ...typography.bodyText,
      color: colors.textSecondary,
      marginBottom: "24px",
    },
    actions: {
      display: "flex",
      gap: "14px",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "8px",
      ...typography.buttonText,
      cursor: "pointer",
      border: `1px solid ${colors.inputBorder}`,
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    },
    primaryButton: {
      backgroundColor: "transparent",
      color: colors.text,
    },
    secondaryButton: {
      backgroundColor: colors.accent,
      color: "white",
      border: `1px solid ${colors.accent}`,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px 20px",
      color: colors.textSecondary,
    },
    errorContainer: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
      textAlign: "center",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: colors.textSecondary,
    },
    emptyStateTitle: {
      ...typography.cardTitle,
      color: colors.text,
      marginBottom: "12px",
    },
    emptyStateText: {
      ...typography.bodyText,
      color: colors.textSecondary,
    },
    debugPanel: {
      backgroundColor: colors.cardBackground,
      border: `2px solid #ff6b6b`,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "20px",
      fontSize: "12px",
      fontFamily: "monospace",
      color: colors.text,
      maxHeight: "500px",
      overflowY: "auto",
    },
    debugTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "12px",
      color: "#ff6b6b",
    },
    debugSection: {
      marginBottom: "12px",
      padding: "8px",
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      borderRadius: "4px",
    },
    errorSection: {
      marginBottom: "12px",
      padding: "8px",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      borderRadius: "4px",
    },
  }

  // Status colors mapping - Updated to match database statuses
  const statusColors = {
    "under review": { backgroundColor: "#fef3c7", color: "#92400e" },
    interview: { backgroundColor: "#dcfce7", color: "#16a34a" },
    accepted: { backgroundColor: "#f3e8ff", color: "#7c3aed" },
    rejected: { backgroundColor: "#fee2e2", color: "#dc2626" },
    // Default fallback
    default: { backgroundColor: "#f1f5f9", color: "#475569" },
  }

  // Company colors for logos
  const companyColors = [
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ]

  const getCompanyColor = (company) => {
    if (!company) return companyColors[0]
    const hash = company.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return companyColors[Math.abs(hash) % companyColors.length]
  }

  // Helper function to get job data from application using the fetched job details
  const getJobData = (app) => {
    console.log(`Getting job data for application ${app.id}:`, {
      app_job_id: app.job,
      job_details_available: !!jobDetails[app.job],
      job_details: jobDetails[app.job],
    })

    // Get the job details from our fetched data
    const job = jobDetails[app.job]

    if (!job) {
      console.log(`No job details found for job ID ${app.job}`)
      return {
        job_title: app.job_title || "Job Title Not Available",
        job_company: "Company Not Available",
        job_location: "Location Not Available",
        job_setup: "Setup Not Available",
        job_type: "Type Not Available",
        min_salary: null,
        max_salary: null,
        job_description: "Description Not Available",
        job_requirements: "Requirements Not Available",
        job_benefits: "Benefits Not Available",
      }
    }

    // Map the job details to our expected format
    // Try different field name variations based on common Django patterns
    const jobData = {
      job_title: app.job_title || job.job_title || job.title,
      job_company: job.job_company || job.company || job.company_name,
      job_location: job.job_location || job.location || job.city,
      job_setup: job.job_setup || job.setup || job.work_setup || job.remote_type,
      job_type: job.job_type || job.type || job.employment_type || job.position_type,
      min_salary: job.min_salary || job.salary_min || job.minimum_salary,
      max_salary: job.max_salary || job.salary_max || job.maximum_salary,
      job_description: job.job_description || job.description || job.details,
      job_requirements: job.job_requirements || job.requirements || job.qualifications,
      job_benefits: job.job_benefits || job.benefits || job.perks,
    }

    console.log(`Processed job data for application ${app.id}:`, jobData)
    return jobData
  }

  // Modal handlers
  const handleViewJobDetails = (app) => {
    const jobData = getJobData(app)

    // Create a job object that matches the modal's expected format
    const jobForModal = {
      id: app.job || app.id,
      job_title: jobData.job_title,
      job_company: jobData.job_company,
      job_location: jobData.job_location,
      job_type: jobData.job_type,
      job_setup: jobData.job_setup,
      min_salary: jobData.min_salary,
      max_salary: jobData.max_salary,
      job_description: jobData.job_description,
      job_requirements: jobData.job_requirements,
      job_benefits: jobData.job_benefits,
      created_at: app.date, // Use application date as fallback
      status: "Active",
    }

    setSelectedJob(jobForModal)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  const handleApplyFromModal = () => {
    // Since user already applied, we don't need to do anything
    // This function exists to satisfy the modal's interface
    console.log("User has already applied to this job")
  }

  const getStatusCounts = () => {
    console.log("Calculating status counts for applications:", applications)

    const counts = {
      All: applications.length,
      Review: 0,
      Interview: 0,
      Accepted: 0,
      Rejected: 0,
    }

    applications.forEach((app) => {
      // Use application_status field from your API
      const status = app.application_status?.toLowerCase() || ""
      console.log(`Application ${app.id} has status: "${status}"`)

      if (status === "under review") {
        counts.Review++
      } else if (status === "interview") {
        counts.Interview++
      } else if (status === "accepted") {
        counts.Accepted++
      } else if (status === "rejected") {
        counts.Rejected++
      } else {
        console.log(`Unknown status "${status}" - not counted in any category`)
      }
    })

    console.log("Final status counts:", counts)
    return counts
  }

  const filteredApplications = applications.filter((app) => {
    const jobData = getJobData(app)

    // Search filter
    const searchTerm = searchQuery.toLowerCase()
    const matchesSearch =
      !searchQuery ||
      jobData?.job_title?.toLowerCase().includes(searchTerm) ||
      jobData?.job_company?.toLowerCase().includes(searchTerm) ||
      jobData?.job_location?.toLowerCase().includes(searchTerm)

    // Type filter
    const matchesType = typeFilter === "All" || jobData?.job_type === typeFilter

    // Setup filter
    const matchesSetup = setupFilter === "All" || jobData?.job_setup === setupFilter

    // Tab filter
    let matchesTab = true
    if (activeTab !== "All") {
      // Use application_status field from your API
      const status = app.application_status?.toLowerCase() || ""

      if (activeTab === "Review") {
        matchesTab = status === "under review"
      } else {
        matchesTab = status === activeTab.toLowerCase()
      }
    }

    const result = matchesSearch && matchesType && matchesSetup && matchesTab
    return result
  })

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const jobDataA = getJobData(a)
    const jobDataB = getJobData(b)

    switch (sortBy) {
      case "Most Recent":
        // Use 'date' field from your API
        return new Date(b.date || 0) - new Date(a.date || 0)
      case "Oldest First":
        return new Date(a.date || 0) - new Date(b.date || 0)
      case "Title A-Z":
        return (jobDataA?.job_title || "").localeCompare(jobDataB?.job_title || "")
      case "Title Z-A":
        return (jobDataB?.job_title || "").localeCompare(jobDataA?.job_title || "")
      default:
        return 0
    }
  })

  const getCompanyInitial = (company) => {
    return company ? company.charAt(0).toUpperCase() : "?"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", dateString, error)
      return "Invalid Date"
    }
  }

  const formatStatus = (status) => {
    if (!status) return "Unknown"

    const statusMap = {
      "under review": "Under Review",
      interview: "Interview",
      accepted: "Accepted",
      rejected: "Rejected",
    }

    const formattedStatus = statusMap[status.toLowerCase()] || status
    return formattedStatus
  }

  const formatSalary = (minSalary, maxSalary) => {
    if (!minSalary || !maxSalary) return "Salary not specified"

    try {
      const min = Number.parseFloat(minSalary)
      const max = Number.parseFloat(maxSalary)
      return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`
    } catch (error) {
      return "Salary not specified"
    }
  }

  const statusCounts = getStatusCounts()

  const ClipboardIcon = () => (
    <svg style={applicationsStyles.titleIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )

  const SearchIcon = () => (
    <svg
      style={applicationsStyles.searchIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const LocationIcon = () => (
    <svg style={applicationsStyles.detailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const PesoIcon = () => (
    <svg style={applicationsStyles.detailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="3" x2="8" y2="21" stroke="currentColor" strokeWidth="2" />
      <path d="M8 5h5a4 4 0 1 1 0 8H8" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const CalendarIcon = () => (
    <svg style={applicationsStyles.detailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const BriefcaseIcon = () => (
    <svg style={applicationsStyles.detailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  if (loading) {
    return (
      <div style={applicationsStyles.container}>
        <div style={applicationsStyles.loadingContainer}>
          <div>Loading your applications and job details...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={applicationsStyles.container}>
        <div style={applicationsStyles.errorContainer}>
          <div>{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={applicationsStyles.container}>
      <div style={applicationsStyles.header}>
        <h1 style={applicationsStyles.title}>
          <ClipboardIcon />
          My Applications
        </h1>
        <p style={applicationsStyles.subtitle}>Track and manage your job applications</p>
      </div>

      {/* Search and Filters */}
      <div style={applicationsStyles.filtersCard}>
        <div style={applicationsStyles.filtersGrid}>
          <div style={applicationsStyles.inputGroup}>
            <label style={applicationsStyles.label}>Search Applications</label>
            <div style={applicationsStyles.searchContainer}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={applicationsStyles.searchInput}
              />
            </div>
          </div>

          <div style={applicationsStyles.inputGroup}>
            <label style={applicationsStyles.label}>Job Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={applicationsStyles.select}
            >
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div style={applicationsStyles.inputGroup}>
            <label style={applicationsStyles.label}>Work Setup</label>
            <select
              value={setupFilter}
              onChange={(e) => setSetupFilter(e.target.value)}
              style={applicationsStyles.select}
            >
              <option value="All">All Setups</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div style={applicationsStyles.inputGroup}>
            <label style={applicationsStyles.label}>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={applicationsStyles.select}>
              <option value="Most Recent">Most Recent</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Title A-Z">Title A-Z</option>
              <option value="Title Z-A">Title Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={applicationsStyles.tabsContainer}>
        <div style={applicationsStyles.tabs}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              style={{
                ...applicationsStyles.tab,
                ...(activeTab === status ? applicationsStyles.activeTab : {}),
              }}
              onClick={() => setActiveTab(status)}
            >
              {status} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div>
        {sortedApplications.length === 0 ? (
          <div style={applicationsStyles.emptyState}>
            <h3 style={applicationsStyles.emptyStateTitle}>No Applications Found</h3>
            <p style={applicationsStyles.emptyStateText}>
              {applications.length === 0
                ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                : `No applications match your current filters. Try adjusting your search criteria. (${applications.length} total applications)`}
            </p>
          </div>
        ) : (
          sortedApplications.map((app) => {
            const jobData = getJobData(app)

            return (
              <div key={app.id} style={applicationsStyles.applicationCard}>
                <div style={applicationsStyles.applicationHeader}>
                  <div
                    style={{
                      ...applicationsStyles.companyLogo,
                      backgroundColor: getCompanyColor(jobData?.job_company || "Unknown"),
                    }}
                  >
                    {getCompanyInitial(jobData?.job_company || "Unknown")}
                  </div>

                  <div style={applicationsStyles.applicationInfo}>
                    <h3 style={applicationsStyles.jobTitle}>{jobData?.job_title || "Job Title Not Available"}</h3>
                    <p style={applicationsStyles.company}>{jobData?.job_company || "Company Not Available"}</p>

                    <div style={applicationsStyles.applicationDetails}>
                      <div style={applicationsStyles.detailItem}>
                        <LocationIcon />
                        <span>{jobData?.job_location || "Location Not Available"}</span>
                      </div>

                      <div style={applicationsStyles.detailItem}>
                        <PesoIcon />
                        <span>{formatSalary(jobData?.min_salary, jobData?.max_salary)}</span>
                      </div>

                      <div style={applicationsStyles.detailItem}>
                        <BriefcaseIcon />
                        <span>{jobData?.job_type || "Type Not Available"}</span>
                      </div>

                      <div style={applicationsStyles.detailItem}>
                        <CalendarIcon />
                        <span>Applied {formatDate(app.date)}</span>
                      </div>
                    </div>

                    <p style={applicationsStyles.additionalInfo}>
                      {jobData?.job_setup && `${jobData.job_setup} • `}
                      {jobData?.job_type && `${jobData.job_type} • `}
                      Status: {formatStatus(app.application_status)}
                      {jobData?.job_description && (
                        <>
                          <br />
                          <span style={{ fontSize: "13px", color: colors.textMuted }}>
                            {jobData.job_description.length > 150
                              ? `${jobData.job_description.substring(0, 150)}...`
                              : jobData.job_description}
                          </span>
                        </>
                      )}
                    </p>

                    <div style={applicationsStyles.actions}>
                      <button
                        style={{ ...applicationsStyles.button, ...applicationsStyles.primaryButton }}
                        onClick={() => handleViewJobDetails(app)}
                      >
                        View Job Details
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      ...applicationsStyles.statusBadge,
                      ...(statusColors[app.application_status?.toLowerCase()] || statusColors.default),
                    }}
                  >
                    {formatStatus(app.application_status)}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={handleApplyFromModal}
        isApplying={false}
        hasApplied={true} // Always true since this is from applications list
      />
    </div>
  )
}

export default ApplicationsContent