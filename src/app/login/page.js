"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Email, ArrowBack, Home } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Welcome message on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      Swal.fire({
        title: 'Welcome to Admin Panel',
        text: 'Please sign in with your admin credentials to continue',
        icon: 'info',
        confirmButtonColor: '#667eea',
        confirmButtonText: 'Got it',
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom'
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = () => {
    Swal.fire({
      title: 'Forgot Password?',
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p style="margin-bottom: 15px;">If you've forgotten your password, please contact the system administrator:</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="margin: 5px 0;"><strong>Email:</strong> admin@myexampartner.com</p>
            <p style="margin: 5px 0;"><strong>Default Password:</strong> admin123</p>
            <p style="margin: 5px 0; color: #666; font-size: 0.9em;">Please change your password after first login for security.</p>
          </div>
        </div>
      `,
      icon: 'question',
      confirmButtonColor: '#667eea',
      confirmButtonText: 'I understand',
      showCancelButton: true,
      cancelButtonText: 'Close',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the form errors before submitting',
        icon: 'warning',
        confirmButtonColor: '#667eea',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom'
        }
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: 'Signing In...',
      text: 'Please wait while we authenticate you',
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom'
      }
    });

    try {
      setLoading(true);
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        // Check if user is admin
        if (data.user.role !== 'admin') {
          Swal.fire({
            title: 'Access Denied',
            text: 'Admin privileges required to access this area',
            icon: 'error',
            confirmButtonColor: '#ff6b6b',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom',
              content: 'swal2-content-custom'
            }
          });
          return;
        }

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", "true");
        
        // Set auth token cookie for middleware
        const isProduction = process.env.NODE_ENV === 'production';
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; ${isProduction ? 'secure; ' : ''}samesite=strict`; // 24 hours
        
        // Show success alert
        Swal.fire({
          title: 'Welcome Back!',
          text: `Login successful! Welcome back, ${data.user.name}`,
          icon: 'success',
          confirmButtonColor: '#4ecdc4',
          confirmButtonText: 'Continue to Dashboard',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: true,
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom'
          }
        }).then(() => {
          router.push("/admin/dashboard");
        });
      } else {
        Swal.fire({
          title: 'Login Failed',
          text: data.error || 'Invalid credentials. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ff6b6b',
          confirmButtonText: 'Try Again',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Connection Error',
        text: 'Unable to connect to the server. Please check your internet connection and try again.',
        icon: 'error',
        confirmButtonColor: '#ff6b6b',
        confirmButtonText: 'Retry',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom'
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
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
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
        
        .swal2-loading {
          border: 4px solid #f3f3f3 !important;
          border-top: 4px solid #667eea !important;
          border-radius: 50% !important;
          width: 50px !important;
          height: 50px !important;
          animation: swal2-spin 1s linear infinite !important;
        }
        
        @keyframes swal2-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .swal2-timer-progress-bar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
      `}</style>

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 6,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-3px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  opacity: 0.3,
                  filter: "blur(8px)",
                  zIndex: -1,
                },
              }}
            >
              <Image
                src="/images/my-exam-partner-logo.jpg"
                alt="Exam Partner Logo"
                width={80}
                height={80}
                style={{
                  objectFit: "contain",
                  borderRadius: "50%"
                }}
              />
            </Box>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
              Sign in to continue
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#667eea",
                      borderWidth: 2,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#667eea",
                      borderWidth: 2,
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#667eea" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontSize: 18,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                  transform: "translateY(-2px)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "left 0.5s",
                },
                "&:hover::before": {
                  left: "100%",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 2, color: "white" }} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Back to Home Button */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              onClick={() => router.push('/')}
              startIcon={<Home />}
              sx={{
                color: '#667eea',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                }
              }}
            >
              Back to Home
            </Button>
          </Box>

          {/* Forgot Password Link */}
          {/* <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              onClick={handleForgotPassword}
              sx={{
                color: '#667eea',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot your password?
            </Button>
          </Box> */}

        </Paper>
      </Container>
    </Box>
    </>
  );
}

