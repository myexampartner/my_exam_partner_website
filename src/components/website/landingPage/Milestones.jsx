"use client";
import React from "react";
import {
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import Image from "next/image";
function Milestones() {
  const router = useRouter();
  
  // Curriculum icon components
  const CanadianIcon = () => (
    <Image
      src="/images/canadian-curriculum-icon.png"
      alt="Canadian Curriculum"
      width={28}
      height={28}
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );

  const IBIcon = () => (
    <Image
      src="/images/IB-curriculum-icon.png"
      alt="IB Curriculum"
      width={28}
      height={28}
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );

  const SABISIcon = () => (
    <Image
      src="/images/SABIS-icon.png"
      alt="SABIS Curriculum"
      width={28}
      height={28}
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );

  const BritishIcon = () => (
    <Image
      src="/images/british-curriculum-icon.png"
      alt="British Curriculum"
      width={28}
      height={28}
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );

  const HKDSEIcon = () => (
    <Image
      src="/images/HKDSE-icon.png"
      alt="HKDSE"
      width={28}
      height={28}
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );

  const CBSEIcon = () => (
    <Image
      src="/images/CBSE-icon.png"
      alt="CBSE"
      width={28}
      height={28}
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
  const cardData = [
    {
      icon: CanadianIcon,
      title: " Canadian Curriculum",
      descriptions: [
        "Aligned with provincial learning goals.",
        "Emphasis on writing and problem-solving.",
        "Personalized tutoring across all grades."
      ],
      id: "1",
    },
    {
      icon: IBIcon,
      title: "IB Curriculum",
      descriptions: [
        "Support for EE, TOK & IAs.",
        "Tutors who simplify HL & SL.",
        "Balanced growth through real understanding."
      ],
      id: "2",
    },
    {
      icon: SABISIcon,
      title: "SABIS",
      descriptions: [
        "Lessons aligned with school pacing.",
        "Weekly reports for steady progress.",
        "Focused support in core subjects."
      ],
      id: "3",
    },
    {
      icon: BritishIcon,
      title: " British Curriculum",
      descriptions: [
        "Smart prep for IGCSE & A-Levels.",
        "Learn how exams truly think.",
        "Transparent progress every three weeks."
      ],
      id: "4",
    },
    {
      icon: HKDSEIcon,
      title: "HKDSE Curriculum",
      descriptions: [
        "Intensive prep for every subject.",
        "Real past paper practice sessions.",
        "Smart strategies to raise performance."
      ],
      id: "5",
    },
    {
      icon: CBSEIcon,
      title: "CBSE Curriculum",
      descriptions: [
        "Strong NCERT-based concept learning.",
        "Practice with real exam patterns.",
        "Strategy-driven board exam results."
      ],
      id: "6",
    },
  ];

  const handleCardClick = (id) => {
    // Instant navigation to curriculum page
    router.push(`/curriculum?id=${id}`);
  };
  return (
    <>
      <Stack spacing={8} minWidth={"100%"} maxWidth={"100%"} mt={10} mb={5}>
        {/* top text  */}
        <Stack
          spacing={2}
          textAlign={"center"}
          alignSelf={"center"}
          minWidth={["100%", "70%", "70%", "55%"]}
          maxWidth={["100%", "70%", "70%", "55%"]}
          px={3}
          
        >
          <Typography fontSize={[26,28,30,32]} fontWeight={550}>
            Explore Our Expertise
          </Typography>
          <Typography fontSize={[16,18,20,22]} color="rgba(61, 61, 61, 0.88)">
            Our 1-to-1 online tutoring is designed to give every student the
            confidence, clarity, and skills they need to succeed in their exams
            and beyond
          </Typography>
        </Stack>

        <Stack
          direction={["column", "row"]}
          gap={4}
          minWidth={["100%", "100%", "100%", "100%", "95%"]}
          flexWrap={"wrap"}
          flexGrow={3}
          maxWidth={["100%", "100%", "100%", "100%", "95%"]}
          justifyContent={"center"}
          alignSelf={"center"}
          px={[2, 0]}
        >
          {cardData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Stack
                spacing={2}
                key={index}
                boxShadow={12}
                p={3}
                minWidth={["100%", "45%", "30%", "28%", "28%"]}
                maxWidth={["100%", "45%", "30%", "28%", "28%"]}
                borderRadius={8}
                onClick={() => handleCardClick(item.id)}
                sx={{
                  minHeight: "380px", // fix card height (adjust as needed)
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)", // Enhanced default shadow
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)", // Current shadow on hover
                  },
                }}
              >
                {/* Top content */}
                <Stack spacing={2}>
                  <IconButton
                    sx={{
                      backgroundColor: "var(--info-color)",
                      borderRadius: 4,
                      p: 1.3,
                      width: 50,
                      height: 50,
                      "&:hover": {
                        backgroundColor: "var(--info-color)",
                      },
                    }}
                  >
                    <IconComponent sx={{ color: "white", fontSize: 28 }} />
                  </IconButton>
                  <Typography
                    color="var(--info-color)"
                    fontSize={20}
                    fontWeight={550}
                  >
                    {item.title}
                  </Typography>

                  {/* list points */}
                  <Stack spacing={1.5} maxWidth="100%" flexGrow={1}>
                    {item.descriptions.map((description, descIndex) => (
                      <Stack key={descIndex} direction="row" gap={0.5} alignItems="flex-start">
                        <DoubleArrowIcon
                          sx={{ color: "rgba(58, 56, 56, 0.88)" }}
                        />
                        <Typography mt={-0.3} fontSize={16}>
                          {description}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>

                {/* Bottom aligned Read More */}
                <Stack 
                  direction="row" 
                  gap={1} 
                  alignItems="center"
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <Typography color="var(--info-color)" fontSize={18}>
                    Read More
                  </Typography>
                  <ArrowForwardIcon 
                    sx={{ 
                      color: "var(--info-color)",
                      transition: "transform 0.3s ease",
                    }} 
                  />
                </Stack>
              </Stack>
            );
          })}
        </Stack>
         {/* <Button  sx={{backgroundColor:"var(--info-color)",color:"var(--text-primary)",maxWidth:"320px",fontSize:18,alignSelf:"center",px:2.5,py:1.5,borderRadius:10,border:"1px solid transparent","&:hover":{
              color:"var(--info-color)",backgroundColor:"transparent",border:"1px solid var(--info-color)"
            }}}  endIcon={<Person2RoundedIcon sx={{width:25,height:25}}/>}>Request A Tutor</Button> */}
      </Stack>
    </>
  );
}

export default Milestones;
