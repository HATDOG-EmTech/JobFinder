"use client"

const SocialLogin = () => {
  // Unified typography system
  const typography = {
    buttonText: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      lineHeight: "1.4",
    },
  }

  const socialStyles = {
    container: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    button: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      padding: "1rem",
      border: "1px solid #d1d5db",
      borderRadius: "12px",
      backgroundColor: "white",
      ...typography.buttonText,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      color: "#374151",
    },
    buttonHover: {
      backgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    icon: {
      width: "20px",
      height: "20px",
      flexShrink: 0,
    },
  }

  const handleGoogleLogin = () => {
    console.log("Google login clicked")
  }

  const handleLinkedInLogin = () => {
    console.log("LinkedIn login clicked")
  }

  const GoogleIcon = () => (
    <svg style={socialStyles.icon} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )

  const LinkedInIcon = () => (
    <svg style={socialStyles.icon} viewBox="0 0 24 24">
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
      />
    </svg>
  )

  return (
    <div style={socialStyles.container}>
      <button
        onClick={handleGoogleLogin}
        style={socialStyles.button}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, socialStyles.buttonHover)
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white"
          e.target.style.borderColor = "#d1d5db"
          e.target.style.transform = "none"
          e.target.style.boxShadow = "none"
        }}
      >
        <GoogleIcon />
        Google
      </button>
      <button
        onClick={handleLinkedInLogin}
        style={socialStyles.button}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, socialStyles.buttonHover)
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white"
          e.target.style.borderColor = "#d1d5db"
          e.target.style.transform = "none"
          e.target.style.boxShadow = "none"
        }}
      >
        <LinkedInIcon />
        LinkedIn
      </button>
    </div>
  )
}

export default SocialLogin
