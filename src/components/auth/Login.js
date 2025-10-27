"use client";
import React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

// Validation Schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Simulate API call - Replace this with your actual authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Example validation (replace with your actual auth logic)
      if (values.email === "admin@myexampartner.com" && values.password === "admin123") {
        toast.success("Login successful! Redirecting...", {
          position: "top-center",
          duration: 2000,
          icon: "🎉",
        });

        // Redirect to admin dashboard after short delay
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        toast.error("Invalid email or password", {
          position: "top-center",
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #EB7D7E, #B097BE, #6FD4E6)",
        py: 4,
        px: 2,
      }}
    >
      <Toaster />

      {/* Login Card */}
      <Paper
        elevation={8}
        sx={{
          maxWidth: 480,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #FF6A4D, #FF8A70)",
            py: 4,
            px: 3,
            textAlign: "center",
          }}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src="/images/my-exam-partner-logo.jpg"
              alt="Logo"
              style={{ height: 70, width: 70 }}
            />
          </Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="white"
            gutterBottom
          >
            MY EXAM PARTNER
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.95 }}>
            Admin Portal
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ p: 4 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            color="var(--dark-color)"
            mb={1}
            textAlign="center"
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            color="var(--text-secondary)"
            mb={3}
            textAlign="center"
          >
            Sign in to access your dashboard
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
              <Form>
                <Stack spacing={3}>
                  {/* Email Field */}
                  <Box>
                    <Typography fontSize={14} fontWeight={500} mb={0.5}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="filled"
                      placeholder="admin@myexampartner.com"
                      error={touched.email && Boolean(errors.email)}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "var(--text-secondary)" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          fontSize: 16,
                          borderRadius: 2,
                          backgroundColor: "rgba(239, 246, 255, 0.5)",
                        },
                      }}
                    />
                    {touched.email && errors.email && (
                      <Typography color="error" fontSize={12} mt={0.5}>
                        {errors.email}
                      </Typography>
                    )}
                  </Box>

                  {/* Password Field */}
                  <Box>
                    <Typography fontSize={14} fontWeight={500} mb={0.5}>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="filled"
                      placeholder="Enter your password"
                      error={touched.password && Boolean(errors.password)}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "var(--text-secondary)" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          fontSize: 16,
                          borderRadius: 2,
                          backgroundColor: "rgba(239, 246, 255, 0.5)",
                        },
                      }}
                    />
                    {touched.password && errors.password && (
                      <Typography color="error" fontSize={12} mt={0.5}>
                        {errors.password}
                      </Typography>
                    )}
                  </Box>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    fullWidth
                    sx={{
                      backgroundColor: "#FF6A4D",
                      color: "white",
                      py: 1.5,
                      fontSize: 16,
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      mt: 2,
                      "&:hover": {
                        backgroundColor: "#ff5533",
                      },
                      "&:disabled": {
                        backgroundColor: "#ffb3a3",
                      },
                    }}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>

                  {/* Demo Credentials Info */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: "rgba(239, 246, 255, 0.7)",
                      borderRadius: 2,
                      border: "1px solid rgba(6, 11, 38, 0.1)",
                    }}
                  >
                    <Typography fontSize={12} fontWeight={600} color="var(--dark-color)" mb={0.5}>
                      Demo Credentials:
                    </Typography>
                    <Typography fontSize={11} color="var(--text-secondary)">
                      Email: admin@myexampartner.com
                    </Typography>
                    <Typography fontSize={11} color="var(--text-secondary)">
                      Password: admin123
                    </Typography>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 2,
            px: 3,
            backgroundColor: "rgba(239, 246, 255, 0.3)",
            textAlign: "center",
          }}
        >
          <Typography fontSize={12} color="var(--text-secondary)">
            © 2025 MY EXAM PARTNER. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
}

export default Login;