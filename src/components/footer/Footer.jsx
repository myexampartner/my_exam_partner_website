"use client";

import React, { useState } from "react";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link"; // ✅ use Next.js Link
import Swal from "sweetalert2";

function Footer() {
  const iconData = [
    { icon: FacebookRoundedIcon, link: "https://www.facebook.com/share/1CuB3RkK29/?mibextid=wwXIfr" },
    { icon: InstagramIcon, link: "https://www.instagram.com/haadihelpsanimals?igsh=cHpyajRjaGdkZGxm&utm_source=qr" },
    { icon: LinkedInIcon, link: "https://www.linkedin.com" },
  ];

  const linkData = [
    { name: "Home", to: "/" },
    { name: "Tutors", to: "/tutors" },
    { name: "About Us", to: "/about" },
    { name: "Curriculum", to: "/curriculum" },
    { name: "Contact Us", to: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Terms & Conditions", to: "/terms-and-conditions" },
    { name: "Service & Resolution", to: "/service-fulfillment-resolution-policy" },
    { name: "Referral Program Policy", to: "/referral-program-policy" },
  ];

  const contactData = [
    { icon: EmailIcon, data: "info@myexampartner.com" },
    { icon: LocationOnIcon, data: "123 Main Street, City, Country" },
  ];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({
        title: 'Email Required',
        text: 'Please enter your email address to subscribe.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1a1a2e',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom'
        }
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f44336',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom'
        }
      });
      return;
    }

    try {
      setLoading(true);
      
      // Show loading alert
      Swal.fire({
        title: 'Subscribing...',
        text: 'Please wait while we process your subscription.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom'
        },
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch('/api/subscribe-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'website_footer'
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Successfully Subscribed!',
          html: `
            <div style="text-align: center; margin: 20px 0;">
              <div style="
                width: 80px; 
                height: 80px; 
                background: #e8f5e8; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                margin: 0 auto 20px;
                border: 3px solid #4caf50;
              ">
                <span style="font-size: 40px; color: #4caf50;">✓</span>
              </div>
              <h3 style="color: #4caf50; margin: 0 0 10px 0; font-size: 1.5rem;">Welcome to Our Newsletter!</h3>
              <p style="color: #666; margin: 0; line-height: 1.5;">
                Thank you for subscribing! You'll receive updates about our latest courses, 
                exam tips, and educational content.
              </p>
              <div style="
                background: #f0f8ff; 
                border: 1px solid #b3d9ff; 
                border-radius: 8px; 
                padding: 15px; 
                margin: 20px 0;
                color: #1976d2;
              ">
                <strong>📧 Email:</strong> ${email}
              </div>
            </div>
          `,
          confirmButtonText: 'Awesome!',
          confirmButtonColor: '#4caf50',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom'
          },
          width: '500px'
        });
        setEmail("");
      } else {
        Swal.fire({
          title: 'Subscription Failed',
          text: data.error || 'Failed to subscribe. Please try again.',
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#f44336',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Connection Error',
        text: 'Unable to connect to our servers. Please check your internet connection and try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f44336',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Custom SweetAlert2 Styles */}
      <style jsx global>{`
        .swal2-popup-custom {
          border-radius: 16px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .swal2-title-custom {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #1a1a2e !important;
          margin-bottom: 0.5rem !important;
        }
        
        .swal2-content-custom {
          font-size: 1rem !important;
          color: #666666 !important;
          line-height: 1.5 !important;
        }
        
        .swal2-confirm {
          border-radius: 8px !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
          font-size: 1rem !important;
          text-transform: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease !important;
        }
        
        .swal2-confirm:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>

      <Toaster />

      <Stack spacing={3} width="100%" mt={18}>
        {/* Divider */}
        <hr
          style={{
            backgroundColor: "var(--info-color)",
            height: "3px",
            width: "100%",
            border: "none",
          }}
        />

        {/* Main Footer Section */}
        <Box py={5} px={{ xs: 2, sm: 3, md: 5 }}>
          <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
            {/* Logo & Description */}
            <Grid item xs={12} sm={6} md={4} lg={2} maxWidth={390}>
              <Stack spacing={3} alignItems={{ xs: "center", lg: "flex-start" }} textAlign={{ xs: "center", lg: "left" }}>
                <Stack direction="row" gap={1} alignItems="center" justifyContent={{ xs: "center", lg: "flex-start" }}>
                  <img
                    src="/images/my-exam-partner-logo.jpg"
                    alt="Logo"
                    style={{ height: 70, width: 70 }}
                  />
                  <Typography
                    color="var(--dark-color)"
                    fontSize={{ xs: 18, md: 20 }}
                    fontWeight="bold"
                  >
                    MY EXAM PARTNER
                  </Typography>
                </Stack>

                <Typography
                  color="var(--text-secondary)"
                  fontSize={{ xs: 16, md: 20 }}
                >
                  World-Class Tutors. Personalized Lessons. Exam Techniques. All
                  Curricula Covered.
                </Typography>

                <Stack direction="row" gap={2} justifyContent={{ xs: "center", lg: "flex-start" }}>
                  {iconData.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <IconButton
                          sx={{ border: "2px solid var(--info-color)", p: 0.5 }}
                        >
                          <IconComponent
                            sx={{ color: "var(--info-color)", fontSize: 35 }}
                          />
                        </IconButton>
                      </a>
                    );
                  })}
                </Stack>
              </Stack>
            </Grid>

            {/* Site Map */}
            <Grid item xs={12} sm={6} md={4} lg={2} width={["100%","auto"]}>
              <Stack spacing={1.3} alignItems={{ xs: "center", lg: "flex-start" }} textAlign={{ xs: "center", lg: "left" }}>
                <Typography
                  color="var(--dark-color)"
                  fontSize={{ xs: 18, md: 22 }}
                  fontWeight={550}
                >
                  Site Map
                </Typography>

                {linkData.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <Link
                      href={item.to}
                      style={{ fontSize: 16, color: "var(--text-secondary)" }}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Stack spacing={1.5} alignItems={{ xs: "center", lg: "flex-start" }} textAlign={{ xs: "center", lg: "left" }}>
                <Typography
                  fontSize={{ xs: 18, md: 22 }}
                  color="var(--dark-color)"
                  fontWeight={550}
                >
                  Contact Us
                </Typography>
                {contactData.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Stack
                      key={index}
                      direction="row"
                      gap={1}
                      alignItems="center"
                      justifyContent={{ xs: "center", lg: "flex-start" }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor: "var(--info-color)",
                          "&:hover": { backgroundColor: "var(--info-color)" },
                        }}
                      >
                        <IconComponent
                          sx={{ fontSize: 12, color: "var(--text-primary)" }}
                        />
                      </IconButton>
                      <Typography
                        color="var(--text-secondary)"
                        fontSize={{ xs: 14, md: 18 }}
                      >
                        {item.data}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Grid>

            {/* Legal Links */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Stack spacing={1.3} alignItems={{ xs: "center", lg: "flex-start" }} textAlign={{ xs: "center", lg: "left" }}>
                <Typography
                  color="var(--dark-color)"
                  fontSize={{ xs: 18, md: 22 }}
                  fontWeight={550}
                >
                  Legal
                </Typography>

                {legalLinks.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <Link
                      href={item.to}
                      style={{ fontSize: 16, color: "var(--text-secondary)" }}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Email Subscription */}
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Stack spacing={2} alignItems={{ xs: "center", lg: "flex-start" }} textAlign={{ xs: "center", lg: "left" }}>
                <Typography
                  fontSize={{ xs: 18, md: 22 }}
                  color="var(--dark-color)"
                  fontWeight={550}
                >
                  Study Steady – Be Exam Ready
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Stack
                    direction="row"
                    sx={{
                      border: "2px solid rgba(190, 190, 190, 0.64)",
                      borderRadius: "25px",
                      height: 42,
                    }}
                    gap={1}
                  >
                    <TextField
                      variant="outlined"
                      type="email"
                      required
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{
                        "& fieldset": { border: "none" },
                        flex: 1,
                        fontSize: 12,
                        "& input": {
                          py: 1,
                          fontSize: 12,
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      sx={{
                        backgroundColor: "var(--info-color)",
                        color: "var(--text-primary)",
                        fontSize: 12,
                        px: 2,
                        borderRadius: "25px",
                        minWidth: 90,
                        "&:hover": { backgroundColor: "var(--info-color)" },
                        "&:disabled": { 
                          backgroundColor: "#ccc",
                          color: "#666"
                        },
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              border: '2px solid #fff',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                              }
                            }}
                          />
                          <span>Subscribing...</span>
                        </Box>
                      ) : (
                        'Send'
                      )}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Stack>

      {/* Bottom Bar */}
      <Stack
        sx={{ backgroundColor: "var(--info-color)" }}
        width="100%"
        py={1.5}
        alignItems="center"
      >
        <Typography color="var(--text-primary)" fontSize={{ xs: 14, sm: 16 }}>
          © {new Date().getFullYear()} All Rights Reserved.
        </Typography>
      </Stack>
    </>
  );
}

export default Footer;
