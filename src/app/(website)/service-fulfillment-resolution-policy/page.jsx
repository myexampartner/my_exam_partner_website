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
  Assignment as AssignmentIcon,
  Support as SupportIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";

export default function ServiceFulfillmentResolutionPolicy() {
  const sections = [
    {
      icon: <AssignmentIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "1. Commencement of Services",
      content: [
        "Services are deemed to have commenced once a tutor has been assigned, a learning plan established, or the first session scheduled or attended—whichever occurs first.",
        "From that point onward, the engagement is considered active and non-reversible under this Policy."
      ]
    },
    {
      icon: <CheckCircleIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "2. Commitment to Delivery",
      content: [
        "We deliver every tutoring package with reasonable care, skill, and diligence in accordance with:",
        "• U.S. Federal Trade Commission (FTC) guidelines on fair business practice",
        "• U.K. Consumer Rights Act 2015, Sections 49–54, concerning service performance standards",
        "Our obligation is to perform the agreed-upon sessions. Once delivery begins, all fees are allocated to tutor scheduling, preparation, and resource access."
      ]
    },
    {
      icon: <SupportIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "3. Resolution of Service Issues",
      content: [
        "In the unlikely event of a scheduling error, repeated cancellation, or a technical fault that prevents tutoring from taking place, My Exam Partner will promptly review the matter.",
        "Depending on the situation, we may:",
        "• Re-assign or replace the tutor",
        "• Extend session validity",
        "• Provide equivalent additional learning hours",
        "• Offer another appropriate academic resolution at our sole discretion",
        "We prefer solving, not stalling—so if something goes wrong, expect us to make it right, not run it back."
      ]
    },
    {
      icon: <ScheduleIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "4. Client-Initiated Changes",
      content: [
        "Once your tutoring plan is active, fees are applied toward tutor availability and platform resources.",
        "Post-activation adjustments are not ordinarily available; however, our team may assist with rescheduling or plan modification where feasible."
      ]
    },
    {
      icon: <PaymentIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "5. Service Completion",
      content: [
        "A package is deemed fulfilled once the number of purchased hours has been delivered or made available for scheduling within the agreed duration.",
        "Unused hours expire according to your package's stated validity period."
      ]
    },
    {
      icon: <WarningIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "6. Governing Law",
      content: [
        "This Policy is governed by and construed in accordance with the laws of England & Wales, while conforming to relevant U.S. consumer-protection standards for cross-border services."
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
              <AssignmentIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Service Fulfilment & Resolution Policy
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
              Our commitment to delivering exceptional tutoring services and resolving any issues 
              promptly and fairly to ensure your complete satisfaction.
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
              Service Fulfilment & Resolution Policy
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
              This Service Fulfilment & Resolution Policy ("Policy") governs the purchase and delivery of 
              tutoring services provided by <em>My Exam Partner</em> ("the Company", "we", "our", or "us"). 
              By enrolling in any tutoring package, the client ("you", "student", or "parent/guardian") 
              acknowledges and accepts the terms below.
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
              Need Help or Have Concerns?
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
              Our dedicated support team is here to help resolve any issues and ensure your 
              complete satisfaction with our services.
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
              We may update this Service Fulfilment & Resolution Policy from time to time to reflect 
              changes in our services or procedures. We will notify you of any significant changes 
              by email or through our website. Your continued use of our services after such changes 
              constitutes acceptance of the updated policy.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
