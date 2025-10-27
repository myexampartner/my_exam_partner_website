// components/SubjectCards.js

import React from "react";
import { Grid, Typography, Card, CardContent, Box, Stack } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

function SubjectCards({ curriculumId }) {
  const subjectsData = {
    "1": {
      title: "Core Subjects",
      subtitle: "Canadian Curriculum Coverage",
      subjects: [
        "Advanced Functions (MHF4U)",
        "Calculus & Vectors (MCV4U)",
        "Chemistry (SCH4U)",
        "Biology (SBI4U)",
        "Physics (SPH4U)",
        "English (ENG4U)",
        "French (FSF4U)",
        "Economics",
        "World Issues",
        "Global Politics",
        "Computer Science (ICS4U)",
        "Data Management (MDM4U)"
      ]
    },
    "2": {
      title: "Core Academic Focus",
      subtitle: "IB Diploma Programme",
      subjects: [
        "Group 1: English A - Language & Literature",
        "Group 1: Literature HL",
        "Group 2: French B",
        "Group 2: Spanish Ab Initio",
        "Group 3: Business Management",
        "Group 3: Psychology",
        "Group 3: Economics",
        "Group 4: Biology",
        "Group 4: Chemistry",
        "Group 4: Physics",
        "Group 4: Computer Science",
        "Group 5: Mathematics AA",
        "Group 5: Mathematics AI",
        "Group 6: Visual Arts",
        "Group 6: Film",
        "Group 6: Theatre"
      ]
    },
    "3": {
      title: "Core Subjects",
      subtitle: "SABIS Curriculum",
      subjects: [
        "Algebra",
        "Geometry",
        "Pre-Calculus",
        "AP Calculus AB/BC",
        "Biology",
        "Chemistry",
        "Physics (AP equivalents)",
        "English",
        "French",
        "Arabic",
        "Economics",
        "History",
        "Geography",
        "Computer Science Principles"
      ]
    },
    "4": {
      title: "Subjects & Paper Codes",
      subtitle: "British Curriculum",
      subjects: [
        "Mathematics (0580/0980)",
        "Physics (0625/0972)",
        "Chemistry (0620/0971)",
        "Biology (0610/0970)",
        "English (0500/0990)",
        "Business (0450)",
        "Economics (0455)",
        "Computer Science (0478)",
        "History (0470)",
        "Geography (0460)",
        "Mathematics A-Level (9709)",
        "Further Mathematics (9231)",
        "Biology A-Level (9700)",
        "Chemistry A-Level (9701)",
        "Physics A-Level (9702)",
        "Business A-Level (9609)",
        "Economics A-Level (9708)",
        "Accounting (9706)",
        "Psychology (9990)",
        "Sociology (9699)",
        "Geography A-Level (9696)",
        "Computer Science A-Level (9618)"
      ]
    },
    "5": {
      title: "Core & Elective Subjects",
      subtitle: "HKDSE",
      subjects: [
        "English",
        "Chinese",
        "Mathematics (Core)",
        "Mathematics (M1/M2)",
        "Citizenship & Social Development",
        "Economics",
        "Biology",
        "Chemistry",
        "Physics",
        "History",
        "Geography",
        "ICT",
        "Business",
        "Visual Arts"
      ]
    },
    "6": {
      title: "Core Subjects",
      subtitle: "CBSE Curriculum",
      subjects: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "Hindi",
        "Accountancy",
        "Business Studies",
        "Economics",
        "History",
        "Political Science",
        "Geography",
        "Psychology",
        "Computer Science"
      ]
    }
  };

  const currentData = subjectsData[curriculumId] || subjectsData["4"];
  const allSubjects = currentData.subjects;

  return (
   <Stack
      sx={{
        py: 6,
        px: { xs: 1, sm: 4 },
      }}
      spacing={5}
      alignItems={'center'}
    >
    <Stack spacing={0}>
       <Typography
        fontSize={24}
        fontWeight="bold"
        align="center"
        gutterBottom
        color="var(--info-color)"
      >
        {currentData.title}
      </Typography>
      <Typography fontSize={18} align="center">
        {currentData.subtitle}
      </Typography>

    </Stack>
     
      <Grid
        container
        gap={[1.5,2.5]}
        justifyContent="center"
        sx={{
          mt: 4,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {allSubjects.map((item, index) => {
          const isLongText = item.length > 40; // decide layout for long names

          return (
            <Grid
              item
              key={index}
              xs={10}
              sm={isLongText ? 12 : 2}
              md={isLongText ? 12 : 3} // long text takes full row, others follow 4/2 grid
              display="flex"
              justifyContent="center"
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={[0.5,1]}
                border="1px solid black"
                borderRadius={3}
                px={[1,2]}
                py={1.5}
                sx={{
                  width: "100%",
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  textAlign: "left",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: "#fafafa",
                  },
                }}
              >
                <VerifiedIcon
                />
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flexGrow: 1,
                  }}
                >
                  {item}
                </Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
export default SubjectCards