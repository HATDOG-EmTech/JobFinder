"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../App"
import { jobAPI, applicationAPI } from "../api/auth"

function FindJobsContent({ user }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("All")
  const [setupFilter, setSetupFilter] = useState("All")
  const [sortBy, setSortBy] = useState("Most Recent")
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applyingJobs, setApplyingJobs] = useState(new Set())
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const { isDark } = useTheme()

  // Fetch jobs and user applications from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all jobs
        const jobsResponse = await jobAPI.getAllJobs()
        console.log("Jobs API response:", jobsResponse)

        // Handle paginated response from Django
        const jobsData = jobsResponse.results || jobsResponse
        setAllJobs(jobsData)

        // Fetch user's applications to check which jobs they've already applied to
        if (user) {
          try {
            const applicationsResponse = await applicationAPI.getUserApplications()
            console.log("Applications response:", applicationsResponse)

            const userApplications = applicationsResponse.results || applicationsResponse
            const appliedJobIds = new Set(userApplications.map((app) => app.job || app.job_id))
            setAppliedJobs(appliedJobIds)
          } catch (appError) {
            console.error("Error fetching user applications:", appError)
            // Don't fail the whole component if applications can't be fetched
          }
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs. Please try again.")
        setAllJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Handle job application
  const handleApplyForJob = async (jobId) => {
    if (!user) {
      alert("Please log in to apply for jobs.")
      return
    }

    if (appliedJobs.has(jobId)) {
      alert("You have already applied for this job.")
      return
    }

    try {
      setApplyingJobs((prev) => new Set(prev).add(jobId))

      console.log("Applying for job:", jobId)
      await applicationAPI.applyForJob(jobId)

      // Update applied jobs set
      setAppliedJobs((prev) => new Set(prev).add(jobId))

      alert("Application submitted successfully!")
    } catch (error) {
      console.error("Error applying for job:", error)
      alert(`Failed to apply for job: ${error.message}`)
    } finally {
      setApplyingJobs((prev) => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

  // Dark theme colors - consistent with other components
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
    accent: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  }

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
      fontSize: "1.125rem",
      fontWeight: "600",
      lineHeight: "1.3",
      letterSpacing: "-0.025em",
    },
    bodyText: {
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.5",
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
    smallText: {
      fontSize: "0.75rem",
      fontWeight: "500",
      lineHeight: "1.4",
    },
  }

  const findJobsStyles = {
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
    searchCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "28px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      marginBottom: "28px",
    },
    searchGrid: {
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
      boxSizing: "border-box",
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
    inputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      ...typography.bodyText,
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      backgroundColor: colors.input,
      color: colors.text,
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: colors.accent,
      boxShadow: `0 0 0 3px ${colors.accent}20`,
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
      transition: "all 0.2s ease",
      boxSizing: "border-box",
      width: "100%",
    },
    resultsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      flexWrap: "wrap",
      gap: "16px",
    },
    resultsText: {
      ...typography.bodyText,
      color: colors.textSecondary,
    },
    sortSelect: {
      padding: "10px 14px",
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "6px",
      ...typography.bodyText,
      outline: "none",
      backgroundColor: colors.input,
      color: colors.text,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
    },
    jobCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: "12px",
      padding: "28px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)",
      marginBottom: "20px",
      transition: "all 0.2s ease",
      cursor: "pointer",
    },
    jobCardHover: {
      boxShadow: isDark
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transform: "translateY(-2px)",
      borderColor: colors.accent + "40",
    },
    jobHeader: {
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
    jobInfo: {
      flex: 1,
    },
    jobTitle: {
      ...typography.cardTitle,
      color: colors.text,
      marginBottom: "6px",
      margin: "0 0 6px 0",
    },
    company: {
      ...typography.bodyText,
      color: colors.textSecondary,
      marginBottom: "16px",
      margin: "0 0 16px 0",
    },
    jobDetails: {
      display: "flex",
      gap: "20px",
      ...typography.bodyText,
      color: colors.textSecondary,
      marginBottom: "16px",
      flexWrap: "wrap",
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    detailIcon: {
      width: "16px",
      height: "16px",
      color: colors.textMuted,
      flexShrink: 0,
    },
    description: {
      ...typography.bodyText,
      color: colors.textSecondary,
      lineHeight: "1.6",
      marginBottom: "20px",
      margin: "0 0 20px 0",
    },
    actions: {
      display: "flex",
      gap: "14px",
      flexWrap: "wrap",
    },
    button: {
      padding: "10px 20px",
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
      boxShadow: "none",
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
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px 20px",
      color: colors.textSecondary,
    },
    errorContainer: {
      textAlign: "center",
      padding: "60px 20px",
      color: colors.error,
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

  // Filter out jobs posted by the current user and only show active jobs
  const availableJobs = allJobs.filter((job) => {
    // Filter out jobs posted by current user
    if (user && job.author === user.id) {
      return false
    }
    // Only show active jobs (assuming no status field means active)
    return job.status === "Active" || !job.status
  })

  // Filter and sort jobs
  const getFilteredJobs = () => {
    const filtered = availableJobs.filter((job) => {
      const matchesSearch =
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesJobType = jobTypeFilter === "All" || job.job_type === jobTypeFilter
      const matchesSetup = setupFilter === "All" || job.job_setup === setupFilter

      return matchesSearch && matchesJobType && matchesSetup
    })

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Most Recent":
          return new Date(b.created_at) - new Date(a.created_at)
        case "Oldest First":
          return new Date(a.created_at) - new Date(b.created_at)
        case "Title A-Z":
          return a.job_title.localeCompare(b.job_title)
        case "Title Z-A":
          return b.job_title.localeCompare(a.job_title)
        case "Company A-Z":
          return a.job_company.localeCompare(b.job_company)
        case "Company Z-A":
          return b.job_company.localeCompare(a.job_company)
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredJobs = getFilteredJobs()

  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [focusedInput, setFocusedInput] = useState(null)

  const getCompanyInitial = (company) => {
    return company.charAt(0).toUpperCase()
  }

  // Icons
  const SearchIcon = () => (
    <svg style={findJobsStyles.titleIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const SearchIconSmall = () => (
    <svg style={findJobsStyles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const LocationIcon = () => (
    <svg style={findJobsStyles.detailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const PesoIcon = () => (
    <svg style={findJobsStyles.detailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="3" x2="8" y2="21" stroke="currentColor" strokeWidth="2" />
      <path d="M8 5h5a4 4 0 1 1 0 8H8" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const ClockIcon = () => (
    <svg style={findJobsStyles.detailIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffDays = Math.floor(diff / (1000 * 3600 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get button text and style based on application status
  const getApplyButtonProps = (jobId) => {
    const isApplying = applyingJobs.has(jobId)
    const hasApplied = appliedJobs.has(jobId)

    if (hasApplied) {
      return {
        text: "Applied ✓",
        style: findJobsStyles.appliedButton,
        disabled: true,
        onClick: null,
      }
    }

    if (isApplying) {
      return {
        text: "Applying...",
        style: findJobsStyles.primaryButtonDisabled,
        disabled: true,
        onClick: null,
      }
    }

    return {
      text: "Apply Now",
      style: findJobsStyles.primaryButton,
      disabled: false,
      onClick: () => handleApplyForJob(jobId),
    }
  }

  // Loading state
  if (loading) {
    return (
      <div style={findJobsStyles.container}>
        <div style={findJobsStyles.header}>
          <h1 style={findJobsStyles.title}>
            <SearchIcon />
            Find Jobs
          </h1>
          <p style={findJobsStyles.subtitle}>Discover your next career opportunity from thousands of job listings</p>
        </div>
        <div style={findJobsStyles.loadingContainer}>
          <div>Loading jobs...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={findJobsStyles.container}>
        <div style={findJobsStyles.header}>
          <h1 style={findJobsStyles.title}>
            <SearchIcon />
            Find Jobs
          </h1>
          <p style={findJobsStyles.subtitle}>Discover your next career opportunity from thousands of job listings</p>
        </div>
        <div style={findJobsStyles.errorContainer}>
          <div style={findJobsStyles.noResultsIcon}>⚠️</div>
          <h3 style={{ color: colors.error, marginBottom: "8px" }}>Error Loading Jobs</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={findJobsStyles.container}>
      <div style={findJobsStyles.header}>
        <h1 style={findJobsStyles.title}>
          <SearchIcon />
          Find Jobs
        </h1>
        <p style={findJobsStyles.subtitle}>Discover your next career opportunity from thousands of job listings</p>
      </div>

      {/* Search and Filters */}
      <div style={findJobsStyles.searchCard}>
        <div style={findJobsStyles.searchGrid}>
          <div style={findJobsStyles.inputGroup}>
            <label style={findJobsStyles.label}>Search Jobs</label>
            <div style={findJobsStyles.searchContainer}>
              <SearchIconSmall />
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setFocusedInput("search")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...findJobsStyles.searchInput,
                  ...(focusedInput === "search" ? findJobsStyles.inputFocus : {}),
                }}
              />
            </div>
          </div>
          <div style={findJobsStyles.inputGroup}>
            <label style={findJobsStyles.label}>Job Type</label>
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              onFocus={() => setFocusedInput("jobType")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...findJobsStyles.select,
                ...(focusedInput === "jobType" ? findJobsStyles.inputFocus : {}),
              }}
            >
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div style={findJobsStyles.inputGroup}>
            <label style={findJobsStyles.label}>Work Setup</label>
            <select
              value={setupFilter}
              onChange={(e) => setSetupFilter(e.target.value)}
              onFocus={() => setFocusedInput("setup")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...findJobsStyles.select,
                ...(focusedInput === "setup" ? findJobsStyles.inputFocus : {}),
              }}
            >
              <option value="All">All Setups</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div style={findJobsStyles.inputGroup}>
            <label style={findJobsStyles.label}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              onFocus={() => setFocusedInput("sort")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...findJobsStyles.select,
                ...(focusedInput === "sort" ? findJobsStyles.inputFocus : {}),
              }}
            >
              <option value="Most Recent">Most Recent</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Title A-Z">Title A-Z</option>
              <option value="Title Z-A">Title Z-A</option>
              <option value="Company A-Z">Company A-Z</option>
              <option value="Company Z-A">Company Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={findJobsStyles.resultsHeader}>
        <div style={findJobsStyles.resultsText}>
          Showing {filteredJobs.length} of {availableJobs.length} jobs
        </div>
      </div>

      {/* Job Listings */}
      <div>
        {filteredJobs.length === 0 ? (
          <div style={findJobsStyles.noResults}>
            <div style={findJobsStyles.noResultsIcon}>🔍</div>
            <h3 style={{ color: colors.text, marginBottom: "8px" }}>No jobs found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const applyButtonProps = getApplyButtonProps(job.id)

            return (
              <div
                key={job.id}
                style={{
                  ...findJobsStyles.jobCard,
                  ...(hoveredCard === job.id ? findJobsStyles.jobCardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(job.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={findJobsStyles.jobHeader}>
                  <div
                    style={{
                      ...findJobsStyles.companyLogo,
                      backgroundColor: companyColors[job.job_company] || "#64748b",
                    }}
                  >
                    {getCompanyInitial(job.job_company)}
                  </div>

                  <div style={findJobsStyles.jobInfo}>
                    <h3 style={findJobsStyles.jobTitle}>{job.job_title}</h3>
                    <p style={findJobsStyles.company}>{job.job_company}</p>

                    <div style={findJobsStyles.jobDetails}>
                      <div style={findJobsStyles.detailItem}>
                        <LocationIcon />
                        <span>{job.job_location}</span>
                      </div>
                      <div style={findJobsStyles.detailItem}>
                        <PesoIcon />
                        <span>
                          ₱{Number.parseFloat(job.min_salary).toLocaleString()} - ₱
                          {Number.parseFloat(job.max_salary).toLocaleString()}
                        </span>
                      </div>
                      <div style={findJobsStyles.detailItem}>
                        <ClockIcon />
                        <span>{formatDate(job.created_at)}</span>
                      </div>
                    </div>

                    <p style={findJobsStyles.description}>
                      {job.job_description.length > 200
                        ? `${job.job_description.substring(0, 200)}...`
                        : job.job_description}
                    </p>

                    <div style={findJobsStyles.actions}>
                      <button
                        style={{
                          ...findJobsStyles.button,
                          ...findJobsStyles.secondaryButton,
                          ...(hoveredButton === `details-${job.id}` ? findJobsStyles.secondaryButtonHover : {}),
                        }}
                        onMouseEnter={() => setHoveredButton(`details-${job.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        View Details
                      </button>
                      <button
                        style={{
                          ...findJobsStyles.button,
                          ...applyButtonProps.style,
                          ...(hoveredButton === `apply-${job.id}` && !applyButtonProps.disabled
                            ? findJobsStyles.primaryButtonHover
                            : {}),
                        }}
                        onMouseEnter={() => !applyButtonProps.disabled && setHoveredButton(`apply-${job.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={applyButtonProps.onClick}
                        disabled={applyButtonProps.disabled}
                      >
                        {applyButtonProps.text}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default FindJobsContent