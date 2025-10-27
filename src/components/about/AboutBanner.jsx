import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';

function AboutBanner() {
  return (
    <>
      <Stack
        sx={{
          background: "url('/images/about-banner-bg.png'), linear-gradient(135deg, #EB7D7E, #B097BE, #6FD4E6)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat", 
        }}
        px={[2,5]}
        minWidth={"100%"}
        maxWidth={"100%"}
        alignItems={'center'}
        alignSelf={'center'}
        justifySelf={'center'}
        spacing={3}
        py={[8,12,15,20]}
      >
        <Typography fontSize={[30,40,50,75]} fontWeight={550} color="var(--text-primary)" textAlign={'center'}>About Us</Typography>
        <Typography fontSize={[16,18,20]} color="var(--text-primary)" maxWidth={'800px'} textAlign={'center'} lineHeight={1.6}>
          We believe every student deserves a tutor who truly understands them. Our experts craft lessons that match your pace, goals, and exams. At MyExamPartner, learning feels personal — and results speak loudest.
        </Typography>
        <Button  
          sx={{
            backgroundColor:"rgba(255, 96, 74, 1)",
            color:"var(--text-primary)",
            py:{xs:1.5,sm:1.5,md:2},
            px:{xs:1.5,sm:2,md:3},
            borderRadius:10,
            fontSize:{xs:13,sm:15,md:18},
            fontWeight: 600,
            '&:hover': {
              backgroundColor:"rgba(255, 80, 60, 1)",
            }
          }} 
          endIcon={<Person2RoundedIcon sx={{height:{xs:20,sm:22,md:25},width:{xs:20,sm:22,md:25}}}/>}
        >
          Book a Tutor
        </Button>
      </Stack>
    </>
  );
}

export default AboutBanner;
