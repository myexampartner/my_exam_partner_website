"use client";
import React from "react";
import {
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
function Banner() {
  
  const boxData = [
    { img: "/images/certified.png", text: "Examination Techniques" },
    { img: "/images/examination.png", text: "Weekly & Monthly Progress Report" },
    { img: "/images/progress.png", text: "Fully Customised Schedule" },
    { img: "/images/scheduled.png", text: "Certified and Verified Tutors" },
    { img: "/images/attention.png", text: "Past Paper Focus" },
    { img: "/images/pricing.png", text: "Lesson Plans" },
  ];

const IconData = [
    { icon: "/images/canadian-curriculum.jpg" },
    { icon: "/images/IB.png" },
    { icon: "/images/SABIS.jpg" },
    { icon: "/images/british.png" },
    { icon: "/images/HKDSE.png" },
    { icon: "/images/CBSE.png" },
  ];
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    curriculum: "",
    grade: "",
  });

  const [phoneValue, setPhoneValue] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let temp = {};
    temp.name = formData.name ? "" : "Name is required.";
    temp.phone = phoneValue && phoneValue.length >= 10
      ? ""
      : "Valid phone is required.";
    temp.email = /\S+@\S+\.\S+/.test(formData.email)
      ? ""
      : "Valid email is required.";
    temp.curriculum = formData.curriculum ? "" : "Curriculum is required.";
    temp.grade = formData.grade ? "" : "Grade is required.";
    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setPhoneValue(value);
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          Swal.fire({
            title: 'Success!',
            text: "Form submitted successfully! We'll contact you soon.",
            icon: 'success',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Great!'
          });
          setFormData({
            name: "",
            phone: "",
            email: "",
            curriculum: "",
            grade: "",
          });
          setPhoneValue("");
          setErrors({});
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.error || "Failed to submit form. Please try again.",
            icon: 'error',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        Swal.fire({
          title: 'Network Error!',
          text: "Please check your connection and try again.",
          icon: 'error',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'OK'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
   <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems="flex-start"
      justifyContent={{ xs: "flex-start", md: "space-evenly" }} // Important fix
      gap={5}
      px={3}
      pb={3}
      pt={5}
      sx={{
        width: "100%",
        height: { xs: "auto", md: "100vh" }, // Responsive height
        // overflow: "hidden",
        boxSizing: "border-box",
         background: "linear-gradient(to right, #EB7D7E, #B097BE, #6FD4E6)",
         
      }}
      
    >
      {/* LEFT SECTION */}
      <Stack
        flex={1}
        spacing={3}
        alignItems={['center','center',"flex-start"]}
        justifyContent="center"
        sx={{
          width: "100%",
          maxWidth: "700px",
          boxSizing: "border-box",
        }}
        textAlign={['center','center','left']}
      >
        {/* Heading Section */}
        <Box>
          <Typography fontSize={{ xs: 14, sm: 16, md: 18 }} color="var(--text-primary)">
            Study Steady - Be Exam Ready
          </Typography>

          <Typography
           color="var(--text-primary)"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: 24,
                sm: 30,
                md: 42,
                lg: 46,
              },
              lineHeight: 1.2,
              my: 1,
            }}
          >
            Book Your Free Trial Class Today <br />World-Class
            Tutors from Just $13/hr
          </Typography>

          <Typography  color="var(--text-primary)" fontSize={{ xs: 14, sm: 16, md: 18 }}>
            World-Class Tutors. Personalized Lessons.
            <br />
            Exam Techniques. All Curricula Covered.
          </Typography>
        </Box>

        {/* Feature Boxes */}
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={2}
          maxWidth={["100%",'100%','90%','90%']}
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)", // 2 columns on mobile
            sm: "repeat(3, 1fr)", // 3 columns on tablet and larger
          }}
        >
          {boxData.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              gap={1}
              p={1.5}
              borderRadius={2}
              sx={{
                backgroundColor:"var(--text-primary)",
                flex: "1 1 auto",
              }}
              width={[120, 200, 150]}
            >
              <img
                src={item.img}
                alt="icon"
                style={{ height: 32, width: 32 }}
              />
              <Typography  fontSize={{ xs: 12, sm: 14 }}>{item.text}</Typography>
            </Stack>
          ))}
        </Stack>

        {/* <Stack
          direction="row"
          flexWrap="wrap"
          gap={2}
          maxWidth="100%"
          gridTemplateColumns={{
            xs: "repeat(3, 1fr)", // 2 columns on mobile
            md: "repeat(4, 1fr)", // 3 columns on tablet and larger
            lg: "repeat(4,1fr)",
          }}
          justifyContent={['center','center','flex-start']}
        >
          {IconData.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              gap={1}
             
              sx={{
                maxWidth: 70,
                flex: "1 1 auto",
              }}
              
            >
              <img
                src={item.icon}
                alt="icon"
                style={{ height: 52, width: 52, borderRadius:"50%"}}
              />
            </Stack>
          ))}
        </Stack> */}
      </Stack>

      {/* RIGHT SECTION – FORM */}
      <Box
        flex={1}
        width="100%"
        maxWidth={[400,400,400,400,500]}
        borderRadius={8}
        px={5}
        py={3}
        sx={{
          backgroundColor: "white",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        maxHeight={'100%'}
      >
        <Typography
          fontSize={{ xs: 16, md: 20 }}
          textAlign="center"
          fontWeight={600}
          mb={2}
          maxWidth={200}
          alignSelf={'center'}
        >
          BOOK YOUR FREE TRIAL NOW
        </Typography>

         <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={1}
    >
      {/* Name */}
      <Box>
        <Typography fontSize={14} fontWeight={500}>
          Name
        </Typography>
        <TextField
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          variant="filled"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: { xs: 14, sm: 16 }, px: 1, height: 40 },
          }}
        />
        {errors.name && (
          <Typography color="error" fontSize={12}>
            {errors.name}
          </Typography>
        )}
      </Box>

      {/* Phone */}
      <Box>
        <Typography fontSize={14} fontWeight={500}>
          Phone Number
        </Typography>
        <Box
          sx={{
            "& .react-tel-input": {
              width: "100%",
              "& .form-control": {
                width: "100%",
                height: "40px",
                fontSize: "16px",
                padding: "0 8px 0 48px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                "&:focus": {
                  backgroundColor: "rgba(0, 0, 0, 0.09)",
                  outline: "none",
                  boxShadow: "none",
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.09)",
                },
              },
            },
          }}
        >
          <PhoneInput
            country="us"
            value={phoneValue}
            onChange={handlePhoneChange}
            enableSearch={true}
            disableSearchIcon={false}
            searchPlaceholder="Search countries"
            placeholder="Enter phone number"
            inputProps={{
              name: 'phone',
              required: true,
            }}
            containerStyle={{
              width: "100%",
            }}
            inputStyle={{
              width: "100%",
              height: "40px",
              fontSize: "16px",
              padding: "0 8px 0 48px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "rgba(0, 0, 0, 0.06)",
            }}
            buttonStyle={{
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "4px 0 0 4px",
            }}
            dropdownStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            renderStringAsFlag=""
          />
        </Box>
        {errors.phone && (
          <Typography color="error" fontSize={12}>
            {errors.phone}
          </Typography>
        )}
      </Box>

      {/* Email */}
      <Box>
        <Typography fontSize={14} fontWeight={500}>
          Email
        </Typography>
        <TextField
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          variant="filled"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: { xs: 14, sm: 16 }, px: 1, height: 40 },
          }}
        />
        {errors.email && (
          <Typography color="error" fontSize={12}>
            {errors.email}
          </Typography>
        )}
      </Box>

      {/* Curriculum Dropdown */}
      <Box>
        <Typography fontSize={14} fontWeight={500}>
          Curriculum
        </Typography>
        <FormControl fullWidth variant="filled">
          <Select
            name="curriculum"
            value={formData.curriculum}
            onChange={handleChange}
            disableUnderline
            sx={{ height: 40, fontSize: { xs: 14, sm: 16 }, px: 1 }}
          >
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
          <Typography color="error" fontSize={12}>
            {errors.curriculum}
          </Typography>
        )}
      </Box>

      {/* Grades Dropdown */}
      <Box>
        <Typography fontSize={14} fontWeight={500}>
          Grade
        </Typography>
        <FormControl fullWidth variant="filled">
          <Select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            disableUnderline
            sx={{ height: 40, fontSize: { xs: 14, sm: 16 }, px: 1 }}
          >
            <MenuItem value="Grade 1-5">Grade 1-5</MenuItem>
            <MenuItem value="Grade 6-9">Grade 6-9</MenuItem>
            <MenuItem value="Grade 10-11">Grade 10-11</MenuItem>
            <MenuItem value="Grade 12/Year 13">Grade 12/Year 13</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        {errors.grade && (
          <Typography color="error" fontSize={12}>
            {errors.grade}
          </Typography>
        )}
      </Box>

      <Typography fontSize={12} color="text.secondary">
        Your journey to exam success starts here — request your free quote now.
      </Typography>

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{
          backgroundColor: "#FF6A4D",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          py: 1.2,
          fontSize: { xs: 14, sm: 16 },
          "&:hover": { backgroundColor: "#ff5533" },
          "&:disabled": { backgroundColor: "#ccc" },
        }}
      >
        {isSubmitting ? "Submitting..." : "Book Now"}
      </Button>
    </Box>
      </Box>
    </Stack>
  );
}

export default Banner;
