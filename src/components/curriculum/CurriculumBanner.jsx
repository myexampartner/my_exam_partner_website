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
function CurriculumBanner({ curriculumId }) {
  const curriculumData = {
    "1": {
      title: "Canadian Curriculum – Provincial Excellence & University Pathway",
      subtitle: "Consistency. Depth. Academic Transition.",
      description: "Our Canadian curriculum program aligns with Ontario, Alberta, and BC standards, integrating university-prep and AP alignment for post-secondary readiness.",
      subjects: [
        "Mathematics: Advanced Functions (MHF4U), Calculus & Vectors (MCV4U)",
        "Sciences: Chemistry (SCH4U), Biology (SBI4U), Physics (SPH4U)",
        "Languages: English (ENG4U), French (FSF4U)",
        "Social Sciences: Economics, World Issues, Global Politics",
        "Computer Science: ICS4U, Data Management (MDM4U)"
      ],
      tutors: "Certified provincial educators and graduates from leading Canadian universities, trained in differentiated assessment and university-level standards.",
      edge: [
        "AP integration within OSSD framework",
        "Research writing mentorship",
        "Grade projection analytics",
        "Curriculum adaptation for inter-provincial students"
      ]
    },
    "2": {
      title: "IB Curriculum – PYP, MYP & DP (SL & HL)",
      subtitle: "Inquiry. Depth. Global Readiness.",
      description: "Our IB continuum program supports students across PYP, MYP, and DP (SL & HL) — nurturing intellectual independence and structured analytical thinking. Lessons emphasize conceptual clarity, critical interpretation, and written precision in alignment with IB's global standards.",
      subjects: [
        "Group 1: English A: Language & Literature, Literature HL",
        "Group 2: French B, Spanish Ab Initio",
        "Group 3: Business Management, Psychology, Economics",
        "Group 4: Biology, Chemistry, Physics, Computer Science",
        "Group 5: Mathematics: Analysis & Approaches (AA) & Applications & Interpretation (AI)",
        "Group 6: Visual Arts, Film, Theatre"
      ],
      tutors: "IB examiners and top-scoring graduates trained through official IB workshops, specializing in IAs, EEs, and TOK essays with criterion-specific insight.",
      edge: [
        "IA/EE mentorship with structured milestones",
        "TOK essay scaffolding and argument mapping",
        "Cross-level skill development from MYP to DP",
        "\"Predicted Grade Boost Plan\" for SL and HL"
      ]
    },
    "3": {
      title: "SABIS Curriculum – Mastery Learning with AP Integration",
      subtitle: "Structure. Precision. Performance.",
      description: "Our SABIS program combines systematic content mastery with AP-level enrichment, helping students perform well within SABIS benchmarks while extending toward international academic excellence.",
      subjects: [
        "Mathematics: Algebra, Geometry, Pre-Calculus, AP Calculus AB/BC",
        "Sciences: Biology, Chemistry, Physics (AP equivalents)",
        "Languages: English, French, Arabic",
        "Social Sciences: Economics, History, Geography",
        "Technology: Computer Science Principles"
      ],
      tutors: "Trained within the SABIS academic system and familiar with assessment modules; several hold AP teaching credentials for dual preparation.",
      edge: [
        "Mastery mapping and performance tracking",
        "Integrated AP modules for advanced learners",
        "Predictive analytics for progress",
        "Continuous assessments aligned with SABIS standards"
      ]
    },
    "4": {
      title: "British Curriculum – IGCSE, GCSE, AS & A Levels",
      subtitle: "Analysis. Structure. Examination Mastery.",
      description: "Our British program mirrors the precision of Cambridge, Edexcel, and AQA boards, emphasizing analytical writing, concept depth, and examiner-style reasoning.",
      subjects: [
        "IGCSE / GCSE: Mathematics (0580/0980), Physics (0625/0972), Chemistry (0620/0971), Biology (0610/0970), English (0500/0990), Business (0450), Economics (0455), Computer Science (0478), History (0470), Geography (0460)",
        "AS & A Levels: Mathematics (9709), Further Mathematics (9231), Biology (9700), Chemistry (9701), Physics (9702), Business (9609), Economics (9708), Accounting (9706), Psychology (9990), Sociology (9699), Geography (9696), Computer Science (9618)"
      ],
      tutors: "Cambridge-certified educators and former A* achievers trained in examiner report interpretation and past-paper calibration.",
      edge: [
        "Paper-by-paper technique sessions",
        "Examiner commentary integration",
        "Essay methodology workshops",
        "Data-driven performance tracking"
      ]
    },
    "5": {
      title: "HKDSE Curriculum – Bilingual Depth, Academic Strategy",
      subtitle: "Precision in Expression. Clarity in Thought.",
      description: "Our HKDSE framework empowers students to succeed in both Core and Elective papers through bilingual fluency and subject mastery.",
      subjects: [
        "English, Chinese, Mathematics (Core, M1/M2), Citizenship & Social Development, Economics, Biology, Chemistry, Physics, History, Geography, ICT, Business, Visual Arts"
      ],
      tutors: "Bilingual specialists and examiners trained in Paper 1–4 assessment patterns who provide targeted English and Cantonese explanations.",
      edge: [
        "SBA mentorship with moderation guidance",
        "Bilingual academic writing development",
        "Structured essay-building templates",
        "Examiner-marked mock sessions"
      ]
    },
    "6": {
      title: "CBSE Curriculum – Concept, Application, Outcome",
      subtitle: "From Foundation to Future Competence.",
      description: "Our CBSE program transforms textbook learning into conceptual mastery through logic-based problem-solving and pattern recognition.",
      subjects: [
        "Mathematics, Physics, Chemistry, Biology, English, Hindi, Accountancy, Business Studies, Economics, History, Political Science, Geography, Psychology, Computer Science"
      ],
      tutors: "Experienced educators and IIT/DU graduates trained in NCERT-to-board mapping, emphasizing reasoning and clarity over memorization.",
      edge: [
        "NCERT-to-board trend tracking",
        "Concept visualization for complex topics",
        "Analytical writing workshops",
        "Predictive assessments based on exam patterns"
      ]
    }
  };

  // Get current curriculum data or default
  const currentData = curriculumData[curriculumId] || curriculumData["4"]; // Default to British Curriculum
 
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
      alignItems="center"
      justifyContent={{ xs: "flex-start", md: "space-evenly" }} // Important fix
      gap={[5,5,5,5,8]}
      px={3}
      py={3}
      sx={{
        width: "100%",
        height: { xs: "auto", md: "100vh" }, // Responsive height
        // overflow: "hidden",
        boxSizing: "border-box",
        background: "url('/images/curriculum-banner-bg.png'), linear-gradient(135deg, #EB7D7E, #B097BE, #6FD4E6)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
          <Typography fontSize={{ xs: 14, sm: 16, md: 18 }} color="var(--text-primary)" fontWeight={600}>
            {currentData.subtitle}
          </Typography>

          <Typography
           color="var(--text-primary)"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: 22,
                sm: 28,
                md: 38,
                lg: 48,
              },
              lineHeight: 1.2,
              my: 1,
            }}
          >
           {currentData.title}
          </Typography>

          <Typography  color="var(--text-primary)" fontSize={{ xs: 14, sm: 16, md: 18 }} mb={2}>
            {currentData.description}
          </Typography>
        </Box>

       
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

export default CurriculumBanner;
