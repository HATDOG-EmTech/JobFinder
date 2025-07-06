import { useTheme } from "../App"

const Logo = () => {
  const { isDark } = useTheme()
  // Unified typography system
  const typography = {
    logoText: {
      fontSize: "1.5rem", // 24px
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
    },
  }

    const logoSrc = isDark
    ? "Logo/JOB FINDER-dark[1].PNG" // dark mode logo
    : "Logo/JOB FINDER [1]-10.png";    // light mode logo

  const logoStyles = {
    container: {
      display: "flex",
      flexDirection: "row",
      gap: "0.75rem",
      alignItems: "center",
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
  }

  return (
    <div style={logoStyles.container}>
      <div style={logoStyles.logo}>
        <img src={logoSrc} alt="JobFinder Logo" style={logoStyles.logoImg} />
      </div>
      <h1 style={logoStyles.logoText}>JobFinder</h1>
    </div>
  )
}

export default Logo
