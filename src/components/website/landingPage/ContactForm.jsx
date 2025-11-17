"use client";
import React, { useState } from "react";
import {
  Stack,
  Typography,
  Button,
  TextField,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,Box,
  InputLabel,
} from "@mui/material";
import Swal from "sweetalert2";

function ContactUs() {
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
    id="contact-form"
      direction={isBelow900 ? "column" : isBelow1200 ? "column" : "row"}
      justifyContent={"space-between"}
      maxWidth={["95%", "75%", "75%", "90%", "70%"]}
      minWidth={["95%", "75%", "75%", "90%", "70%"]}
      m={[1, 3]}
      gap={3}
      alignItems={"center"}
      justifySelf={"center"}
      boxShadow={6}
      sx={{ backgroundColor: "white" }}
      p={[3]}
      borderRadius={10}
      spacing={isBelow1200 ? 3 : 0}
    >
      {/* Image Section (hidden below 900px) */}
      {!isBelow1200 && (
        <Stack 
          alignItems={"flex-start"}
          p={[3]}
          borderRadius={4}
          maxWidth={"500px"}
          sx={{
            backgroundImage: "url(/images/contact.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "620px",
          }}
        >
          <Stack spacing={2} maxWidth={"80%"}>
          <Typography 
  color="white"
  fontSize={isBelow1200 ? 30 : 35}
  sx={{
    fontFamily: '"Quicksand", sans-serif !important',
    fontWeight: 500,
  }}
>
  Contact Us For Tutor
</Typography>

            <Typography
              fontSize={18}
              fontWeight={"Medium"}
              color="rgba(204, 204, 204, 1)"
            >
              We’re Just A Message Away To Help You Get Started With The Right
              Tutor.
            </Typography>
          </Stack>
        </Stack>
      )}

      {/* Contact Form */}
      <Stack
        spacing={3}
        maxWidth={isBelow1200 ? "100%" : "50%"}
        minWidth={isBelow1200 ? "100%" : "50%"}
        textAlign={"center"}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography color="var(--info-color)" fontSize={28} fontWeight={550}>
          My Exam Partner
        </Typography>

        <Stack spacing={2} maxWidth={"100%"} minWidth={"100%"}>
          <Stack
            direction={isBelow900 ? "column" : "row"}
            spacing={isBelow900 ? 2 : 0}
            justifyContent={isBelow900 ? "flex-start" : "space-between"}
            width="100%"
          >
            <Stack width={isBelow900 ? "100%" : "49%"} spacing={0.5}>
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

            <Stack width={isBelow900 ? "100%" : "49%"} spacing={0.5}>
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
      <MenuItem sx={{}} value="" disabled>
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

export default ContactUs;
