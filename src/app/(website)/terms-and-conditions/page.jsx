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
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  Cancel as CancelIcon,
  Support as SupportIcon,
} from "@mui/icons-material";

export default function TermsAndConditions() {
  const sections = [
    {
      icon: <DescriptionIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "1. Definitions",
      content: [
        "\"My Exam Partner\" refers to the Company providing online educational and tutoring services. \"User\", \"you\", or \"your\" refers to the student, parent, or legal guardian accessing the services."
      ]
    },
    {
      icon: <SchoolIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "2. Service Scope",
      content: [
        "We provide online tutoring services only. No in-person or offline tutoring sessions are offered under these Terms."
      ]
    },
    {
      icon: <SupportIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "3. Account Registration",
      content: [
        "Users must provide accurate educational and contact information during registration. For students under 16 years of age, a parent or guardian must complete the registration process."
      ]
    },
    {
      icon: <PaymentIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "4. Payments",
      content: [
        "All fees must be paid in advance through approved payment gateways. Rates are displayed on the website and may change with notice."
      ]
    },
    {
      icon: <CancelIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "5. Refunds & Cancellations",
      content: [
        "Refunds are governed exclusively by our Refund & Cancellation Policy, which forms an integral part of these Terms."
      ]
    },
    {
      icon: <GavelIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "6. Session Conduct",
      content: [
        "Users must attend sessions on time and maintain respectful communication. Tutors are required to follow the Company's professional and safeguarding standards."
      ]
    },
    {
      icon: <CancelIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "7. Missed Sessions",
      content: [
        "If a user misses two consecutive sessions without prior notice, one session hour will be deducted, as detailed in the Refund & Cancellation Policy."
      ]
    },
    {
      icon: <SupportIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "8. Referral Program",
      content: [
        "Users participating in referral promotions are subject to the Referral Program Policy. Fraudulent activity will result in suspension of benefits."
      ]
    },
    {
      icon: <DescriptionIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "9. Intellectual Property",
      content: [
        "All educational materials, text, graphics, and content remain the exclusive property of My Exam Partner and may not be reproduced or distributed without written consent."
      ]
    },
    {
      icon: <SupportIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "10. Limitation of Liability",
      content: [
        "To the fullest extent permitted by law, the Company's liability shall not exceed the total amount paid by the user in the preceding six (6) months. The Company is not liable for indirect or consequential losses."
      ]
    },
    {
      icon: <CancelIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "11. Force Majeure",
      content: [
        "The Company shall not be liable for any delay or failure to perform due to events beyond its reasonable control, including system outages or natural disasters."
      ]
    },
    {
      icon: <GavelIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "12. Governing Law",
      content: [
        "These Terms shall be governed by the laws of England & Wales, interpreted consistently with U.S. federal consumer protection standards."
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
              <GavelIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Terms & Conditions
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
              Please read these terms carefully. By using our tutoring services, you agree to be bound 
              by these terms and conditions.
            </Typography>
            
            <Chip
              label="Last Updated: December 2024"
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
              Terms & Conditions of Use
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
              These Terms and Conditions ("Terms") govern your use of My Exam Partner's website 
              and tutoring services. By accessing or using our services, you agree to be legally bound 
              by these Terms.
            </Typography>
          </Paper>

          {/* Terms Sections */}
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

          {/* Additional Terms */}
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "var(--dark-color)",
                fontWeight: 700,
                mb: 3,
                textAlign: "center",
              }}
            >
              Additional Terms
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--dark-color)",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Privacy & Data Protection
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Your privacy is important to us. Please review our Privacy Policy to understand 
                  how we collect, use, and protect your personal information.
                </Typography>
              </Box>
              
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--dark-color)",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Governing Law
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  These terms are governed by the laws of the jurisdiction in which My Exam Partner 
                  operates. Any disputes will be resolved through binding arbitration.
                </Typography>
              </Box>
              
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--dark-color)",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Severability
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  If any provision of these terms is found to be unenforceable, the remaining 
                  provisions will continue to be valid and enforceable.
                </Typography>
              </Box>
            </Stack>
          </Paper>

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
              Questions About These Terms?
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
              If you have any questions about these Terms and Conditions, please contact us 
              and we'll be happy to clarify any concerns.
            </Typography>
            
            <Typography sx={{ fontWeight: 600 }}>
              📧 Email: info@myexampartner.com
            </Typography>
          </Paper>

          {/* Agreement */}
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
              Agreement to Terms
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              By using our services, you acknowledge that you have read, understood, and agree to be 
              bound by these Terms and Conditions. These terms may be updated from time to time, 
              and your continued use of our services constitutes acceptance of any changes.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
