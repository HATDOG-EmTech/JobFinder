"use client"

import { useState, useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useTheme } from "../App"
import Sidebar from "./SideBar"
import Header from "./Header"
import DashboardContent from "./DashboardContent"
import FindJobsContent from "./FindJobsContent"
import PostJobContent from "./PostJobContent"
import ApplicationsContent from "./ApplicationContent"
import ProfileContent from "./ProfileContent"
import SettingsContent from "./SettingsContent"

// Create mock data for other users' jobs for demonstration
const mockOtherUsersJobs = [
  {
    job_id: 101,
    user_id: 456, // Different user ID
    job_title: "Frontend Developer",
    job_company: "StartupXYZ",
    job_location: "Austin, TX",
    job_setup: "Remote",
    job_type: "Full-Time",
    min_salary: "85,000",
    max_salary: "115,000",
    job_description:
      "Build responsive web applications using modern JavaScript frameworks. Experience with React, Vue, or Angular preferred.",
    job_requirements:
      "2+ years frontend development experience, proficiency in React or Vue.js, strong CSS and HTML skills.",
    job_benefits: "Flexible hours, remote work, learning stipend, modern equipment",
    datePosted: "2024-01-20",
    status: "Active",
    applicants: [],
  },
  {
    job_id: 102,
    user_id: 789, // Different user ID
    job_title: "Data Scientist",
    job_company: "DataTech Inc",
    job_location: "New York, NY",
    job_setup: "Hybrid",
    job_type: "Full-Time",
    min_salary: "110,000",
    max_salary: "150,000",
    job_description:
      "Analyze large datasets and build machine learning models to drive business insights. Python, SQL, and ML experience required.",
    job_requirements: "3+ years data science experience, strong Python and SQL skills, experience with ML frameworks.",
    job_benefits: "Health insurance, 401k, flexible work, conference budget",
    datePosted: "2024-01-18",
    status: "Active",
    applicants: [],
  },
  {
    job_id: 103,
    user_id: 321, // Different user ID
    job_title: "Product Manager",
    job_company: "TechCorp",
    job_location: "San Francisco, CA",
    job_setup: "Onsite",
    job_type: "Full-Time",
    min_salary: "100,000",
    max_salary: "140,000",
    job_description:
      "Lead product development and strategy for our main platform. Work with engineering and design teams to deliver great user experiences.",
    job_requirements:
      "4+ years product management experience, strong analytical skills, experience with agile development.",
    job_benefits: "Health insurance, stock options, catered meals, gym membership",
    datePosted: "2024-01-22",
    status: "Active",
    applicants: [],
  },
  {
    job_id: 104,
    user_id: 654, // Different user ID
    job_title: "Marketing Specialist",
    job_company: "Creative Agency",
    job_location: "Los Angeles, CA",
    job_setup: "Hybrid",
    job_type: "Full-Time",
    min_salary: "55,000",
    max_salary: "75,000",
    job_description:
      "Develop and execute marketing campaigns across digital channels. Experience with social media, content marketing, and analytics required.",
    job_requirements:
      "2+ years marketing experience, knowledge of digital marketing tools, strong communication skills.",
    job_benefits: "Creative workspace, flexible hours, professional development budget",
    datePosted: "2024-01-19",
    status: "Active",
    applicants: [],
  },
  {
    job_id: 105,
    user_id: 987, // Different user ID
    job_title: "Software Engineer",
    job_company: "Innovation Labs",
    job_location: "Boston, MA",
    job_setup: "Remote",
    job_type: "Full-Time",
    min_salary: "95,000",
    max_salary: "125,000",
    job_description:
      "Join our engineering team to build innovative software solutions. Work with cutting-edge technologies and contribute to open-source projects.",
    job_requirements:
      "3+ years software development experience, proficiency in multiple programming languages, experience with cloud platforms.",
    job_benefits: "Remote work, flexible schedule, learning budget, open-source contribution time",
    datePosted: "2024-01-21",
    status: "Active",
    applicants: [],
  },
]

function Dashboard({ user, onLogout }) {
  const { isDark } = useTheme()
  const location = useLocation()
  const [allPostedJobs, setAllPostedJobs] = useState([])

  // Initialize with mock data on component mount
  useEffect(() => {
    // Initialize with mock other users' jobs
    setAllPostedJobs(mockOtherUsersJobs)
  }, [])

  // Simplified current page calculation without useMemo
  const getCurrentPage = () => {
    const path = location.pathname
    if (path === "/dashboard") return "Dashboard"
    if (path === "/dashboard/find-jobs") return "Find Jobs"
    if (path === "/dashboard/post-job") return "Post Job"
    if (path === "/dashboard/applications") return "My Applications"
    if (path === "/dashboard/profile") return "Profile"
    if (path === "/dashboard/settings") return "Settings"
    return "Dashboard"
  }

  const currentPage = getCurrentPage()

  // Use useCallback to prevent infinite re-renders
  const handleJobsUpdate = useCallback((jobs) => {
    setAllPostedJobs(jobs)
  }, [])

  const dashboardStyles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: isDark ? "#0f172a" : "#f8fafc",
      width: "100vw",
      overflow: "hidden",
    },
    mainContent: {
      flex: 1,
      marginLeft: "260px",
      width: "calc(100vw - 260px)",
      maxWidth: "calc(100vw - 260px)",
      overflow: "hidden",
    },
    contentArea: {
      marginTop: "80px",
      padding: "24px",
      width: "100%",
      boxSizing: "border-box",
    },
  }

  return (
    <div style={dashboardStyles.container}>
      <Sidebar activePage={currentPage} />
      <div style={dashboardStyles.mainContent}>
        <Header user={user} onLogout={onLogout} />
        <main style={dashboardStyles.contentArea}>
          {(() => {
            const path = location.pathname

            // Exact path matching to prevent loops
            if (path === "/dashboard") {
              return <DashboardContent user={user} onJobsUpdate={handleJobsUpdate} />
            }
            if (path === "/dashboard/find-jobs") {
              return <FindJobsContent user={user} allPostedJobs={allPostedJobs} />
            }
            if (path === "/dashboard/post-job") {
              return <PostJobContent />
            }
            if (path === "/dashboard/applications") {
              return <ApplicationsContent />
            }
            if (path === "/dashboard/profile") {
              return <ProfileContent user={user} />
            }
            if (path === "/dashboard/settings") {
              return <SettingsContent />
            }

            // Only redirect if we're on an invalid dashboard sub-route
            if (
              path.startsWith("/dashboard/") &&
              !path.match(/^\/(dashboard\/(find-jobs|post-job|applications|profile|settings))$/)
            ) {
              window.location.replace("/dashboard")
              return null
            }

            // Default dashboard content for exact /dashboard path
            return <DashboardContent user={user} onJobsUpdate={handleJobsUpdate} />
          })()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard