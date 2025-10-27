"use client"; 
import { Button, Stack, Typography, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';

function PricingBanner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fast loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Stack
        sx={{
          background: "url('/images/pricing-banner-bg.png'), linear-gradient(135deg, #EB7D7E, #B097BE, #6FD4E6)",
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
        <Typography fontSize={[30,40,50,75]} fontWeight={550} color="var(--text-primary)" textAlign={'center'}>Pricing</Typography>
        
        <Stack spacing={4} maxWidth={'1000px'} textAlign={'center'}>
          <Typography 
            fontSize={[20,24,28,32]} 
            fontWeight={700} 
            color="var(--text-primary)" 
            textAlign={'center'}
            sx={{ lineHeight: 1.2 }}
          >
            World-Class Private Tutoring,<br/>
            Tailored to Every Curriculum
          </Typography>
          
          <Stack spacing={3} maxWidth={'800px'} mx={'auto'}>
            <Typography 
              fontSize={[15,17,19]} 
              color="var(--text-primary)" 
              textAlign={'center'} 
              lineHeight={1.7}
              fontWeight={400}
            >
              At My Exam Partner, education is deeply personal.<br/>
              We provide exclusive one-on-one learning for students who aim higher — guided by tutors<br/>
              trained and certified in the world's most respected curricula.
            </Typography>
            
            <Typography 
              fontSize={[15,17,19]} 
              color="var(--text-primary)" 
              textAlign={'center'} 
              lineHeight={1.7}
              fontWeight={400}
            >
              Our model is simple yet refined: hourly flexibility, expert precision, and measurable<br/>
              academic excellence. Every session adapts to your goals, every hour holds enduring<br/>
              value, and every milestone is achieved through purpose-driven teaching.
            </Typography>
            
            <Typography 
              fontSize={[15,17,19]} 
              color="var(--text-primary)" 
              textAlign={'center'} 
              lineHeight={1.7}
              fontWeight={500}
              sx={{ fontStyle: 'italic' }}
            >
              Our pricing reflects the quality of our tutors and the value of your time.<br/>
              Flexible, transparent, and built for families who invest in genuine academic excellence.
            </Typography>
          </Stack>
        </Stack>
        <Button  sx={{backgroundColor:"rgba(255, 96, 74, 1)",color:"var(--text-primary)",py:{xs:1.5,sm:1.5,md:2},px:{xs:1.5,sm:2,md:3},borderRadius:10,fontSize:{xs:13,sm:15,md:18}}} endIcon={<Person2RoundedIcon sx={{height:{xs:20,sm:22,md:25},width:{xs:20,sm:22,md:25}}}/>}>Let's Connect</Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack
        sx={{
          background: "url('/images/pricing-banner-bg.png'), linear-gradient(135deg, #EB7D7E, #B097BE, #6FD4E6)",
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
        <Typography fontSize={[30,40,50,75]} fontWeight={550} color="var(--text-primary)" textAlign={'center'}>Pricing</Typography>
        
        <Stack spacing={4} maxWidth={'1000px'} textAlign={'center'}>
          <Typography 
            fontSize={[20,24,28,32]} 
            fontWeight={700} 
            color="var(--text-primary)" 
            textAlign={'center'}
            sx={{ lineHeight: 1.2 }}
          >
            World-Class Private Tutoring,<br/>
            Tailored to Every Curriculum
          </Typography>
          
          <Stack spacing={3} maxWidth={'800px'} mx={'auto'}>
            <Typography 
              fontSize={[15,17,19]} 
              color="var(--text-primary)" 
              textAlign={'center'} 
              lineHeight={1.7}
              fontWeight={400}
            >
              At My Exam Partner, education is deeply personal.<br/>
              We provide exclusive one-on-one learning for students who aim higher — guided by tutors<br/>
              trained and certified in the world's most respected curricula.
            </Typography>
            
            <Typography 
              fontSize={[15,17,19]} 
              color="var(--text-primary)" 
              textAlign={'center'} 
              lineHeight={1.7}
              fontWeight={400}
            >
              Our model is simple yet refined: hourly flexibility, expert precision, and measurable<br/>
              academic excellence. Every session adapts to your goals, every hour holds enduring<br/>
              value, and every milestone is achieved through purpose-driven teaching.
            </Typography>
            
            <Typography 
              fontSize={[15,17,19]} 
              color="var(--text-primary)" 
              textAlign={'center'} 
              lineHeight={1.7}
              fontWeight={500}
              sx={{ fontStyle: 'italic' }}
            >
              Our pricing reflects the quality of our tutors and the value of your time.<br/>
              Flexible, transparent, and built for families who invest in genuine academic excellence.
            </Typography>
          </Stack>
        </Stack>
        <Button  sx={{backgroundColor:"rgba(255, 96, 74, 1)",color:"var(--text-primary)",py:{xs:1.5,sm:1.5,md:2},px:{xs:1.5,sm:2,md:3},borderRadius:10,fontSize:{xs:13,sm:15,md:18}}} endIcon={<Person2RoundedIcon sx={{height:{xs:20,sm:22,md:25},width:{xs:20,sm:22,md:25}}}/>}>Let's Connect</Button>
      </Stack>
    </>
  );
}

export default PricingBanner;
