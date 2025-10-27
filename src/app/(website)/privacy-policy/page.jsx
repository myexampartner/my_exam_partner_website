"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  DataUsage as DataUsageIcon,
  Policy as PolicyIcon,
} from "@mui/icons-material";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <SecurityIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "1. Information We Collect",
      content: [
        "At the time of registration, we collect the following information:",
        "• Educational details: current grade level, curriculum, and examination board",
        "• Contact information: full name, phone number, and email address",
        "• Technical details necessary to provide services (e.g., Skype ID, Zoom ID, or other platform credentials)"
      ]
    },
    {
      icon: <DataUsageIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "2. Purpose of Data Collection",
      content: [
        "The data is collected to:",
        "• Deliver personalized tutoring services",
        "• Share student progress reports and learning plans",
        "• Communicate with parents or guardians for scheduling and updates",
        "• Maintain service quality and compliance with safeguarding standards"
      ]
    },
    {
      icon: <ShieldIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "3. Legal Basis for Processing",
      content: [
        "Processing is conducted under:",
        "• Performance of a contract (for service delivery)",
        "• Legitimate interest (quality assurance and internal operations)",
        "• Parental consent for minors under 16 years of age"
      ]
    },
    {
      icon: <VisibilityIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "4. Data Retention",
      content: [
        "Data is retained for up to three (3) years after completion of the final tutoring session, unless required longer by law. Thereafter, it is securely deleted or anonymized."
      ]
    },
    {
      icon: <LockIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "5. Data Protection & Security",
      content: [
        "All personal data is stored on encrypted systems with restricted administrative access. Tutors and staff are bound by strict confidentiality agreements."
      ]
    },
    {
      icon: <PolicyIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "6. Data Sharing",
      content: [
        "We may share limited data with third-party service providers (such as payment processors and communication platforms) solely to fulfill contractual obligations. No personal data is sold or shared for marketing purposes."
      ]
    },
    {
      icon: <SecurityIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "7. International Transfers",
      content: [
        "Data may be processed or stored in countries outside the user's jurisdiction, subject to adequate data protection safeguards consistent with UK-GDPR and U.S. CCPA principles."
      ]
    },
    {
      icon: <ShieldIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "8. User Rights",
      content: [
        "Users have the right to access, correct, or request deletion of their personal data. Requests can be made via help@myexampartner.com."
      ]
    },
    {
      icon: <DataUsageIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "9. Cookies",
      content: [
        "Our website uses essential and analytical cookies to enhance user experience. Users may control cookie settings through their browser."
      ]
    },
    {
      icon: <PolicyIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "10. Governing Law",
      content: [
        "This Policy is governed by the laws of England & Wales and interpreted consistently with U.S. privacy legislation where applicable."
      ]
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, var(--info-color) 0%, var(--primary-color) 100%)",
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ShieldIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Privacy Policy
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                opacity: 0.9,
                maxWidth: "800px",
                lineHeight: 1.6,
              }}
            >
              Your privacy is our priority. Learn how we protect and handle your personal information 
              to provide you with the best educational experience.
            </Typography>
            
            <Chip
              label="Last Updated: December 2025"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 600,
                px: 2,
                py: 1,
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={6}>
          {/* Introduction */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "var(--dark-color)",
                fontWeight: 700,
                mb: 3,
                textAlign: "center",
              }}
            >
              Privacy Policy
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                textAlign: "center",
                maxWidth: "900px",
                mx: "auto",
                mb: 2,
              }}
            >
              <strong>Effective Date:</strong> October 2025<br/>
              <strong>Last Updated:</strong> October 2025
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                textAlign: "center",
                maxWidth: "900px",
                mx: "auto",
              }}
            >
              This Privacy Policy describes how My Exam Partner ("Company", "we", "our", or "us") 
              collects, uses, and protects personal information. We comply with the UK Data Protection 
              Act 2018 (UK-GDPR), the U.S. Children's Online Privacy Protection Act (COPPA), and the 
              California Consumer Privacy Act (CCPA).
            </Typography>
          </Paper>

          {/* Policy Sections */}
          {sections.map((section, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction={"column"} spacing={3} alignItems="flex-start" >
                <Stack direction="row" justifyContent={"flex-start"} spacing={3} alignItems="center"  >

                <Box
                  sx={{
                    backgroundColor: "rgba(11, 32, 148, 0.1)",
                    borderRadius: "50%",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 60,
                    height: 60,
                  }}
                  >
                  {section.icon}
                </Box>
                  <Typography 
                    variant="h5"
                    sx={{
                      color: "var(--dark-color)",
                      fontWeight: 700,
                      mb: 2,
                    }}
                    >
                    {section.title}
                  </Typography>
                    </Stack>
                 
                  
                  <Stack spacing={2} pl={2} >
                    {section.content.map((item, itemIndex) => (
                      <Box
                        key={itemIndex}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "var(--info-color)",
                            mt: 1.5,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: "var(--text-secondary)",
                            lineHeight: 1.7,
                            fontSize: "1rem",
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack> 
              </Stack>
            </Paper>
          ))}

          {/* Contact Information */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "var(--info-color)",
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Questions About Your Privacy?
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                mb: 3,
                opacity: 0.9,
              }}
            >
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              please don't hesitate to contact us.
            </Typography>
            
            <Typography sx={{ fontWeight: 600 }}>
              📧 Email: help@myexampartner.com
            </Typography>
          </Paper>

          {/* Policy Updates */}
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "#f8f9fa",
              border: "2px solid var(--info-color)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "var(--dark-color)",
                fontWeight: 700,
                mb: 2,
                textAlign: "center",
              }}
            >
              Policy Updates
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or legal requirements. We will notify you of any significant changes by email or through 
              our website. Your continued use of our services after such changes constitutes acceptance 
              of the updated policy.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
