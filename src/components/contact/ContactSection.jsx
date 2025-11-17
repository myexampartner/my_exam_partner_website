"use client";
import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from '@mui/icons-material/FacebookRounded';import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useState } from "react";
import Swal from "sweetalert2";
export default function ContactSection() {
  const isSmall = useMediaQuery("(max-width:900px)");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    curriculum: "",
    grade: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBelow900 = useMediaQuery("(max-width:900px)");
  const isBelow1200 = useMediaQuery("(max-width:1200px)");
  const isBelow600 = useMediaQuery("(max-width:600px)");

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!formData.phone) {
      newErrors.phone = "WhatsApp number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "WhatsApp number atleast 10 digits.";
    }

    if (!formData.curriculum) {
      newErrors.curriculum = "Curriculum is required.";
    }

    if (!formData.grade) {
      newErrors.grade = "Grade is required.";
    }

    if (!formData.message) {
      newErrors.message = "Message is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          Swal.fire({
            title: "Success!",
            text: "Message sent successfully! We'll get back to you soon.",
            icon: "success",
            confirmButtonText: "Great!",
            confirmButtonColor: "#667eea",
            timer: 3000,
            timerProgressBar: true,
          });
          setFormData({
            name: "",
            email: "",
            phone: "",
            curriculum: "",
            grade: "",
            message: "",
          });
          setErrors({});
        } else {
          Swal.fire({
            title: "Error!",
            text: result.error || "Failed to send message. Please try again.",
            icon: "error",
            confirmButtonText: "Try Again",
            confirmButtonColor: "#e74c3c",
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        Swal.fire({
          title: "Network Error!",
          text: "Please check your connection and try again.",
          icon: "error",
          confirmButtonText: "Retry",
          confirmButtonColor: "#e74c3c",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Stack
    mt={8}
      spacing={8}
      alignItems={["flex-start", "center", "center"]}
      justifyContent="space-evenly"
      py={5}
      px={[2, 3, 8]}
      direction={isSmall ? "column" : "row"}
      minWidth={"100%"}
      maxWidth={"100%"}
    >
      {/* LEFT SIDE - Contact Info */}
      <Stack>
        <Stack spacing={3}>
          <Typography
            color="var(--primary-color)"
            fontSize={25}
            textAlign={["center", "center", "left"]}
            fontWeight={'bold'}
          >
            Get In Touch With Us
          </Typography>
          <Typography
            fontSize={18}
            color="var(--text-secondary)"
            sx={{ maxWidth: { sm: "auto", md: 400 } }}
            textAlign={["center", "center", "left"]}
          >
            Reach out to us and let’s make learning simple, flexible, and
            effective for you.
          </Typography>

          <Stack
            direction={["column", "row", "column"]}
            justifyContent={"center"}
            flexWrap={"wrap"}
            gap={[4, 5, 2]}
            alignSelf={["center", "center", "flex-start"]}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <EmailIcon
                sx={{
                  backgroundColor: "var(--info-color)",
                  color: "white",
                  p: 0.8,
                  borderRadius: "50%",
                  fontSize: 35,
                }}
              />
              <Box>
                <Typography fontWeight="bold">E-Mail</Typography>
                <Typography fontSize={14} color="gray">
                  info@myexampartner.com
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <LocationOnIcon
                sx={{
                  backgroundColor: "var(--info-color)",
                  color: "white",
                  p: 0.8,
                  borderRadius: "50%",
                  fontSize: 35,
                }}
              />
              <Box>
                <Typography fontWeight="bold">Address</Typography>
                <Typography fontSize={14} color="gray">
                  London, UK
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <PhoneIcon
                sx={{
                  backgroundColor: "var(--info-color)",
                  color: "white",
                  p: 0.8,
                  borderRadius: "50%",
                  fontSize: 35,
                }}
              />
              <Box>
                <Typography fontWeight="bold">Phone Number</Typography>
                <Typography fontSize={14} color="gray">
                  +44 123 456 789
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Box
            sx={{
              width: "80%",
              height: "2px",
              backgroundColor: "rgba(0,0,0,0.3)",
              my: 2,
              alignSelf: { xs: "center", sm: "center", md: "flex-start" },
            }}
          />

            <Stack direction={['column','row','column']} gap={1} alignItems={['center','center','flex-start']} alignSelf={['center','center','flex-start']}>
                 <Typography fontWeight="bold">Follow Us Now:</Typography>
          <Stack direction="row" spacing={2}>
            {[
              { Icon: FacebookIcon, link: "https://www.facebook.com/share/1CuB3RkK29/?mibextid=wwXIfr" },
              { Icon: LinkedInIcon, link: "https://www.linkedin.com" },
              { Icon: InstagramIcon, link: "https://www.instagram.com/myexampartnerofficial?igsh=OXV4M25nN2RsdThx" }
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <IconButton
                  sx={{
                    border: "2px solid var(--info-color)",
                    color: "var(--info-color)",
                   p:0.5,
                    "&:hover": { backgroundColor: "rgba(33,59,156,0.1)" },
                  }}
                >
                  <item.Icon sx={{ fontSize:35,}}/>
                </IconButton>
              </a>
            ))}
            </Stack>
         
          </Stack>
        </Stack>
      </Stack>

      {/* RIGHT SIDE - Contact Form */}
      <Stack
        spacing={3}
        boxShadow={6}
        p={5}
        borderRadius={12}
        maxWidth={isBelow600?'100%':isBelow900 ? "80%" :isBelow1200 ?'50%': "40%"}
        minWidth={isBelow600?'100%':isBelow900 ? "80%" : isBelow1200?'50%': "40%"}
        textAlign={"center"}
        component="form"
        onSubmit={handleSubmit}
        py={8}
      >
        <Typography color="var(--info-color)" fontSize={28} fontWeight={550}>
          My Exam Partner
        </Typography>

        <Stack spacing={2} maxWidth={"100%"} minWidth={"100%"}>
          <Stack
            direction={isBelow600 ? "column" : "row"}
            spacing={isBelow600 ? 2 : 0}
            justifyContent={isBelow600 ? "flex-start" : "space-between"}
            width="100%"
          >
            <Stack width={isBelow600 ? "100%" : "49%"} spacing={0.5}>
              <TextField
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Name"
                size="small" // reduces default height
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    paddingY: "6px", // reduce vertical padding
                    height: "45px", // smaller field height
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 12px", // control input text padding
                  },
                }}
              />

              {errors.name && (
                <Typography color="red" fontSize={12} textAlign="left">
                  {errors.name}
                </Typography>
              )}
            </Stack>

            <Stack width={isBelow600 ? "100%" : "49%"} spacing={0.5}>
              <TextField
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    paddingY: "6px", // reduce vertical padding
                    height: "45px", // smaller field height
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 12px", // control input text padding
                  },
                }}
              />
              {errors.email && (
                <Typography color="red" fontSize={12} textAlign="left">
                  {errors.email}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack spacing={0.5}>
            <TextField
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="number"
              placeholder="WhatsApp Number"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  paddingY: "6px", // reduce vertical padding
                  height: "45px", // smaller field height
                },
                "& .MuiOutlinedInput-input": {
                  padding: "8px 12px", // control input text padding
                },
              }}
            />
            {errors.phone && (
              <Typography color="red" fontSize={12} textAlign="left">
                {errors.phone}
              </Typography>
            )}
          </Stack>

          <Stack spacing={0.5}>
  <FormControl fullWidth>
    <Select
      name="curriculum"
      value={formData.curriculum}
      onChange={handleChange}
      displayEmpty
      variant="outlined"
      sx={{
        borderRadius: "25px",
        height: "45px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#ccc",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#aaa",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#000", // match focus color of textfields
        },
        "& .MuiSelect-select": {
          padding: "10px 16px",
          borderRadius: "25px", color: "#a4a4a4",
          textAlign: "left", // ensures placeholder (Grade) stays left
        },
      }}
    >
      <MenuItem value="" disabled>
        <em>Curriculum</em>
      </MenuItem>
      <MenuItem value="British Curriculum">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/british.png"
            alt="British Curriculum"
            style={{
              width: 20,
              height: 20,
              objectFit: "contain",
              borderRadius: "4px"
            }}
          />
          British Curriculum
        </Box>
      </MenuItem>
      <MenuItem value="IB Curriculum">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/IB.png"
            alt="IB Curriculum"
            style={{
              width: 20,
              height: 20,
              objectFit: "contain",
              borderRadius: "4px"
            }}
          />
          IB Curriculum
        </Box>
      </MenuItem>
      <MenuItem value="SABIS">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/SABIS.jpg"
            alt="SABIS"
            style={{
              width: 20,
              height: 20,
              objectFit: "contain",
              borderRadius: "4px"
            }}
          />
          SABIS
        </Box>
      </MenuItem>
      <MenuItem value="HKDSE">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/HKDSE.png"
            alt="HKDSE"
            style={{
              width: 20,
              height: 20,
              objectFit: "contain",
              borderRadius: "4px"
            }}
          />
          HKDSE
        </Box>
      </MenuItem>
      <MenuItem value="CBSE">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/CBSE.png"
            alt="CBSE"
            style={{
              width: 20,
              height: 20,
              objectFit: "contain",
              borderRadius: "4px"
            }}
          />
          CBSE
        </Box>
      </MenuItem>
      <MenuItem value="Canadian Curriculum">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/canadian-curriculum.jpg"
            alt="Canadian Curriculum"
            style={{
              width: 20,
              height: 20,
              objectFit: "contain",
              borderRadius: "4px"
            }}
          />
          Canadian Curriculum
        </Box>
      </MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>
  </FormControl>

  {errors.curriculum && (
    <Typography color="red" fontSize={12} textAlign="left">
      {errors.curriculum}
    </Typography>
  )}
</Stack>


<Stack spacing={0.5}>
  <FormControl fullWidth>
    <Select  
      name="grade"
      value={formData.grade}
      onChange={handleChange}
      displayEmpty
      variant="outlined"
      sx={{
        borderRadius: "25px", 
        height: "45px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#ccc",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#aaa",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#000", // focus color (same as TextField)
        },
        "& .MuiSelect-select": {
          padding: "10px 16px",
          borderRadius: "25px",
          textAlign: "left", // ensures placeholder (Grade) stays left
          color: "#a4a4a4",
        },
      }}
    >
      <MenuItem  value="" disabled>
        <em>Grade</em>
      </MenuItem>
      <MenuItem value="Grade 1-5">Grade 1-5</MenuItem>
      <MenuItem value="Grade 6-9">Grade 6-9</MenuItem>
      <MenuItem value="Grade 10-11">Grade 10-11</MenuItem>
      <MenuItem value="Grade 12/Year 13">Grade 12/Year 13</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>
  </FormControl>

  {errors.grade && (
    <Typography color="red" fontSize={12} textAlign="left">
      {errors.grade}
    </Typography>
  )}
</Stack>

          <Stack spacing={0.5}>
            <TextField
              name="message"
              value={formData.message}
              onChange={handleChange}
              type="text"
              placeholder="Message"
              multiline
              minRows={5}
              maxRows={5}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                },
              }}
            />
            {errors.message && (
              <Typography color="red" fontSize={12} textAlign="left">
                {errors.message}
              </Typography>
            )}
          </Stack>

          <Button
            type="submit"
            disabled={isSubmitting}
            sx={{
              backgroundColor: "var(--info-color)",
              borderRadius: "20px",
              maxWidth: "180px",
              alignSelf: "center",
              px: 5,
              color: "white",
              "&:disabled": { backgroundColor: "#ccc" },
            }}
          >
            {isSubmitting ? "Sending..." : "Submit Now"}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
