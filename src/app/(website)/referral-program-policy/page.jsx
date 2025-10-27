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
  Group as GroupIcon,
  CardGiftcard as CardGiftcardIcon,
  AccountBalance as AccountBalanceIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

export default function ReferralProgramPolicy() {
  const sections = [
    {
      icon: <GroupIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "1. Eligibility",
      content: [
        "All registered users with active tutoring accounts are eligible to participate in the referral program."
      ]
    },
    {
      icon: <CardGiftcardIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "2. General Reward",
      content: [
        "Users who refer a new student who completes at least four (4) tutoring sessions shall receive a ten percent (10%) credit applied to their next package purchase."
      ]
    },
    {
      icon: <AccountBalanceIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "3. Bonus Classes",
      content: [
        "Referring two (2) or more friends entitles the referrer to three (3) complimentary classes.",
        "Referring a family of four (4) who collectively purchase one hundred (100) or more classes entitles the referrer to ten (10) complimentary classes.",
        "Bonus classes must be utilized within fourteen (14) days of being credited. Unused bonus classes expire automatically thereafter."
      ]
    },
    {
      icon: <TimelineIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "4. Conditions",
      content: [
        "Rewards are issued only after the referred student(s) have completed their qualifying sessions.",
        "Referral benefits are non-transferable and may not be exchanged for cash.",
        "Referrals obtained through fraudulent or duplicate accounts will result in disqualification."
      ]
    },
    {
      icon: <SecurityIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "5. Program Modification",
      content: [
        "The Company reserves the right to modify or terminate the referral program at any time, in accordance with FTC promotional disclosure guidelines."
      ]
    },
    {
      icon: <CancelIcon sx={{ color: "var(--info-color)", fontSize: 28 }} />,
      title: "6. Governing Law",
      content: [
        "This Policy is governed by the laws of England & Wales, interpreted consistently with U.S. Federal Trade Commission (FTC) promotional fairness principles."
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
              <GroupIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Referral Program Policy
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
              Share the benefits of quality education with friends and family while earning rewards 
              for yourself. Learn about our referral program terms and conditions.
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
              Referral Program Policy
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
              This Referral Program Policy ("Policy") describes the rules and rewards applicable to the 
              My Exam Partner referral initiative.
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

          {/* Additional Information */}
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
              Additional Information
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
                  All referral data is handled in accordance with our Privacy Policy. We respect 
                  the privacy of both referrers and referred students and will not share personal 
                  information without consent.
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
                  Dispute Resolution
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Any disputes regarding referral rewards or program participation will be resolved 
                  through our standard customer service procedures. We are committed to fair and 
                  transparent resolution of all issues.
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
                  Legal Compliance
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  This referral program complies with applicable laws and regulations. Participants 
                  are responsible for understanding and complying with local laws regarding referral 
                  programs and rewards.
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
              Questions About Our Referral Program?
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
              If you have any questions about our referral program or need assistance with 
              referrals, please don't hesitate to contact us.
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
              We may update this Referral Program Policy from time to time to reflect changes in 
              our program terms or legal requirements. We will notify participants of any significant 
              changes by email or through our website. Continued participation in the program after 
              such changes constitutes acceptance of the updated policy.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
