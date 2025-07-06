"use client"

import { useEffect } from "react"

const TermsModal = ({ isOpen, onClose, type }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden" // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalStyles = {
    overlay: {
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
      padding: "1rem",
    },
    modal: {
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      maxWidth: "466px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "hidden",
      position: "relative",
    },
    header: {
      padding: "1.5rem 2rem",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f8fafc",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#1e293b",
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#64748b",
      padding: "0.5rem",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
    },
    content: {
      padding: "2rem",
      maxHeight: "calc(90vh - 120px)",
      overflowY: "auto",
      fontSize: "0.875rem",
      lineHeight: "1.6",
      color: "#374151",
    },
    section: {
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "1rem",
    },
    paragraph: {
      marginBottom: "1rem",
      lineHeight: "1.6",
    },
    list: {
      paddingLeft: "1.5rem",
      marginBottom: "1rem",
    },
    listItem: {
      marginBottom: "0.5rem",
    },
    strong: {
      fontWeight: "600",
      color: "#1e293b",
    },
    lastUpdated: {
      fontSize: "0.75rem",
      color: "#64748b",
      fontStyle: "italic",
      marginTop: "2rem",
      paddingTop: "1rem",
      borderTop: "1px solid #e2e8f0",
    },
  }

  const termsContent = (
    <div>
      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>1. Acceptance of Terms</h3>
        <p style={modalStyles.paragraph}>
          By accessing and using JobFinder, you accept and agree to be bound by the terms and provision of this
          agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>2. User Accounts</h3>
        <p style={modalStyles.paragraph}>
          When you create an account with us, you must provide information that is accurate, complete, and current at
          all times. You are responsible for safeguarding the password and for all activities that occur under your
          account.
        </p>
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>You must be at least 18 years old to use this service</li>
          <li style={modalStyles.listItem}>You are responsible for maintaining the confidentiality of your account</li>
          <li style={modalStyles.listItem}>You must notify us immediately of any unauthorized use of your account</li>
        </ul>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>3. Acceptable Use</h3>
        <p style={modalStyles.paragraph}>
          You may use our service for lawful purposes only. You agree not to use the service:
        </p>
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>
            In any way that violates any applicable federal, state, local, or international law
          </li>
          <li style={modalStyles.listItem}>To post false, inaccurate, misleading, defamatory, or libelous content</li>
          <li style={modalStyles.listItem}>
            To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
          </li>
          <li style={modalStyles.listItem}>To submit false or misleading information</li>
          <li style={modalStyles.listItem}>To upload viruses or other malicious code</li>
        </ul>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>4. Content and Intellectual Property</h3>
        <p style={modalStyles.paragraph}>
          The service and its original content, features, and functionality are and will remain the exclusive property
          of JobFinder and its licensors. The service is protected by copyright, trademark, and other laws.
        </p>
        <p style={modalStyles.paragraph}>
          You retain rights to any content you submit, post, or display on or through the service. By posting content,
          you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display such content.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>5. Job Postings and Applications</h3>
        <p style={modalStyles.paragraph}>
          Employers are responsible for the accuracy of their job postings. Job seekers are responsible for the accuracy
          of their profiles and applications. We do not guarantee the accuracy of any job postings or user profiles.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>6. Termination</h3>
        <p style={modalStyles.paragraph}>
          We may terminate or suspend your account and bar access to the service immediately, without prior notice or
          liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach
          the Terms.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>7. Disclaimers</h3>
        <p style={modalStyles.paragraph}>
          The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this
          Company excludes all representations, warranties, conditions and terms.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>8. Limitation of Liability</h3>
        <p style={modalStyles.paragraph}>
          In no event shall JobFinder, nor its directors, employees, partners, agents, suppliers, or affiliates, be
          liable for any indirect, incidental, special, consequential, or punitive damages.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>9. Changes to Terms</h3>
        <p style={modalStyles.paragraph}>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
          material, we will try to provide at least 30 days notice prior to any new terms taking effect.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>10. Contact Information</h3>
        <p style={modalStyles.paragraph}>
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>Email: hatdog@jobfinder.com</li>
          <li style={modalStyles.listItem}>Address: 1338 Arlegui St, Quiapo, Manila, 1001 Metro Manila</li>
          <li style={modalStyles.listItem}>Phone: (0912) 345 6789</li>
        </ul>
      </div>

      <p style={modalStyles.lastUpdated}>Last updated: July 4, 2025</p>
    </div>
  )

  const privacyContent = (
    <div>
      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>1. Information We Collect</h3>
        <p style={modalStyles.paragraph}>
          We collect information you provide directly to us, such as when you create an account, update your profile, or
          contact us for support.
        </p>
        <p style={modalStyles.paragraph}>
          <span style={modalStyles.strong}>Personal Information:</span>
        </p>
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>Name, email address, and contact information</li>
          <li style={modalStyles.listItem}>Professional information (job title, skills, experience)</li>
          <li style={modalStyles.listItem}>Resume and portfolio information</li>
          <li style={modalStyles.listItem}>Profile photos and other uploaded content</li>
        </ul>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>2. How We Use Your Information</h3>
        <p style={modalStyles.paragraph}>We use the information we collect to:</p>
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>Provide, maintain, and improve our services</li>
          <li style={modalStyles.listItem}>Process transactions and send related information</li>
          <li style={modalStyles.listItem}>Send technical notices, updates, and support messages</li>
          <li style={modalStyles.listItem}>Respond to your comments, questions, and customer service requests</li>
          <li style={modalStyles.listItem}>Match job seekers with relevant job opportunities</li>
          <li style={modalStyles.listItem}>Communicate with you about products, services, and events</li>
        </ul>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>3. Information Sharing and Disclosure</h3>
        <p style={modalStyles.paragraph}>We may share your information in the following situations:</p>
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>
            <span style={modalStyles.strong}>With Employers:</span> When you apply for jobs, your profile information
            may be shared with potential employers
          </li>
          <li style={modalStyles.listItem}>
            <span style={modalStyles.strong}>With Service Providers:</span> We may share your information with
            third-party service providers who perform services on our behalf
          </li>
          <li style={modalStyles.listItem}>
            <span style={modalStyles.strong}>For Legal Reasons:</span> We may disclose your information if required by
            law or in response to valid legal requests
          </li>
          <li style={modalStyles.listItem}>
            <span style={modalStyles.strong}>Business Transfers:</span> Information may be transferred in connection
            with a merger, acquisition, or sale of assets
          </li>
        </ul>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>4. Data Security</h3>
        <p style={modalStyles.paragraph}>
          We take reasonable measures to help protect your personal information from loss, theft, misuse, and
          unauthorized access, disclosure, alteration, and destruction. However, no internet or electronic storage
          system is 100% secure.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>5. Data Retention</h3>
        <p style={modalStyles.paragraph}>
          We store your personal information for as long as necessary to provide our services, comply with legal
          obligations, resolve disputes, and enforce our agreements. You may request deletion of your account at any
          time.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>6. Your Rights and Choices</h3>
        <p style={modalStyles.paragraph}>You have the following rights regarding your personal information:</p>
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>Access and update your account information</li>
          <li style={modalStyles.listItem}>Request deletion of your personal information</li>
          <li style={modalStyles.listItem}>Opt out of promotional communications</li>
          <li style={modalStyles.listItem}>Control your profile visibility settings</li>
          <li style={modalStyles.listItem}>Download your data in a portable format</li>
        </ul>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>7. Cookies and Tracking Technologies</h3>
        <p style={modalStyles.paragraph}>
          We use cookies and similar tracking technologies to collect and use personal information about you. You can
          control cookies through your browser settings, but disabling cookies may affect the functionality of our
          service.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>8. Third-Party Links</h3>
        <p style={modalStyles.paragraph}>
          Our service may contain links to third-party websites or services. We are not responsible for the privacy
          practices of these third parties. We encourage you to read their privacy policies.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>9. Children's Privacy</h3>
        <p style={modalStyles.paragraph}>
          Our service is not intended for children under 18 years of age. We do not knowingly collect personal
          information from children under 18. If you become aware that a child has provided us with personal
          information, please contact us.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>10. International Data Transfers</h3>
        <p style={modalStyles.paragraph}>
          Your information may be transferred to and processed in countries other than your own. We will take
          appropriate measures to ensure your information receives adequate protection.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>11. Changes to This Privacy Policy</h3>
        <p style={modalStyles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last updated" date.
        </p>
      </div>

      <div style={modalStyles.section}>
        <h3 style={modalStyles.sectionTitle}>12. Contact Us</h3>
        <p style={modalStyles.paragraph}>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>Email: hatdog@jobfinder.com</li>
          <li style={modalStyles.listItem}>Address: 1338 Arlegui St, Quiapo, Manila, 1001 Metro Manila</li>
          <li style={modalStyles.listItem}>Phone: (0912) 345 6789</li>
        </ul>
      </div>

      <p style={modalStyles.lastUpdated}>Last updated: July 4, 2025</p>
    </div>
  )

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>{type === "terms" ? "Terms of Service" : "Privacy Policy"}</h2>
          <button
            style={modalStyles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f1f5f9"
              e.target.style.color = "#1e293b"
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent"
              e.target.style.color = "#64748b"
            }}
          >
            ×
          </button>
        </div>
        <div style={modalStyles.content}>{type === "terms" ? termsContent : privacyContent}</div>
      </div>
    </div>
  )
}

export default TermsModal
