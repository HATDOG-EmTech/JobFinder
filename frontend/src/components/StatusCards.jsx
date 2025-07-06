"use client"
import { useTheme } from "../App"

const JobsPostedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const ApplicationsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="14,2 14,8 20,8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="16"
      y1="13"
      x2="8"
      y2="13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="16"
      y1="17"
      x2="8"
      y2="17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ApplicantsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
  </svg>
)

function StatusCards({ dashboardStats }) {
  const { isDark } = useTheme()

  // Use provided dashboard stats or fallback to defaults
  const stats = dashboardStats || {
    totalJobsPosted: 0,
    totalJobsApplied: 0,
    totalApplicants: 0,
  }

  // Calculate derived metrics
  const getJobPostingStatus = (total) => {
    if (total === 0) return { status: "No jobs posted", color: "#64748b" }
    if (total <= 3) return { status: "Getting started", color: "#f59e0b" }
    if (total <= 10) return { status: "Active employer", color: "#3b82f6" }
    return { status: "Top employer", color: "#10b981" }
  }

  const getApplicationsStatus = (count) => {
    if (count === 0) return { status: "Ready to apply", color: "#64748b" }
    if (count <= 5) return { status: "Getting started", color: "#f59e0b" }
    if (count <= 15) return { status: "Active job seeker", color: "#3b82f6" }
    return { status: "Very active", color: "#10b981" }
  }

  const getApplicantsStatus = (count) => {
    if (count === 0) return { status: "No applicants yet", color: "#64748b" }
    if (count <= 5) return { status: "Few candidates", color: "#f59e0b" }
    if (count <= 15) return { status: "Good response", color: "#3b82f6" }
    return { status: "High interest", color: "#10b981" }
  }

  const jobPostingStatus = getJobPostingStatus(stats.totalJobsPosted)
  const applicationsStatus = getApplicationsStatus(stats.totalJobsApplied)
  const applicantsStatus = getApplicantsStatus(stats.totalApplicants)

  const cardStyles = {
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      padding: "1.5rem",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", sans-serif',
    },
    card: {
      backgroundColor: isDark ? "#1e293b" : "white",
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: isDark
        ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
      border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
      transition: "all 0.2s ease",
      cursor: "pointer",
    },
    cardHover: {
      transform: "translateY(-2px)",
      boxShadow: isDark
        ? "0 10px 25px rgba(0, 0, 0, 0.4)"
        : "0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1rem",
    },
    title: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: isDark ? "#f8fafc" : "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      margin: 0,
    },
    icon: {
      width: "24px",
      height: "24px",
      color: isDark ? "#cbd5e1" : "#64748b", // Updated for better dark mode visibility
    },
    value: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: isDark ? "#f8fafc" : "#1e293b",
      margin: "0.5rem 0",
      lineHeight: "1",
    },
    status: {
      fontSize: "0.875rem",
      fontWeight: "500",
      marginBottom: "0.75rem",
    },
    metric: {
      fontSize: "0.75rem",
      color: isDark ? "#cbd5e1" : "#64748b",
      marginTop: "0.5rem",
    },
  }

  const handleCardClick = (cardType) => {
    console.log(`${cardType} card clicked`)
    // Add navigation or modal logic here
  }

  return (
    <div style={cardStyles.container}>
      {/* Total Jobs Posted Card */}
      <div
        style={cardStyles.card}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, cardStyles.cardHover)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none"
          e.currentTarget.style.boxShadow = isDark
            ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
            : "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)"
        }}
        onClick={() => handleCardClick("Total Jobs Posted")}
      >
        <div style={cardStyles.header}>
          <h3 style={cardStyles.title}>Total Jobs Posted</h3>
          <div style={cardStyles.icon}>
            <JobsPostedIcon />
          </div>
        </div>
        <div style={cardStyles.value}>{stats.totalJobsPosted}</div>
        <div style={{ ...cardStyles.status, color: jobPostingStatus.color }}>{jobPostingStatus.status}</div>
        <div style={cardStyles.metric}>{stats.totalJobsPosted > 0 ? "Jobs you've created" : "Start posting jobs"}</div>
      </div>

      {/* Total Jobs Applied Card */}
      <div
        style={cardStyles.card}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, cardStyles.cardHover)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none"
          e.currentTarget.style.boxShadow = isDark
            ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
            : "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)"
        }}
        onClick={() => handleCardClick("Total Jobs Applied")}
      >
        <div style={cardStyles.header}>
          <h3 style={cardStyles.title}>Total Jobs Applied</h3>
          <div style={cardStyles.icon}>
            <ApplicationsIcon />
          </div>
        </div>
        <div style={cardStyles.value}>{stats.totalJobsApplied}</div>
        <div style={{ ...cardStyles.status, color: applicationsStatus.color }}>{applicationsStatus.status}</div>
        <div style={cardStyles.metric}>
          {stats.totalJobsApplied > 0 ? `${stats.totalJobsApplied} applications sent` : "Start your job search"}
        </div>
      </div>

      {/* Total Applicants Card */}
      <div
        style={cardStyles.card}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, cardStyles.cardHover)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none"
          e.currentTarget.style.boxShadow = isDark
            ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
            : "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)"
        }}
        onClick={() => handleCardClick("Total Applicants")}
      >
        <div style={cardStyles.header}>
          <h3 style={cardStyles.title}>Total Applicants</h3>
          <div style={cardStyles.icon}>
            <ApplicantsIcon />
          </div>
        </div>
        <div style={cardStyles.value}>{stats.totalApplicants}</div>
        <div style={{ ...cardStyles.status, color: applicantsStatus.color }}>{applicantsStatus.status}</div>
        <div style={cardStyles.metric}>
          {stats.totalApplicants > 0 ? "People interested in your jobs" : "No applicants yet"}
        </div>
      </div>
    </div>
  )
}

export default StatusCards