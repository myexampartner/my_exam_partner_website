'use client';
import { Button, Stack, Typography, useMediaQuery, Skeleton, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import Link from 'next/link';

function OurTeam() {
  const theme = useTheme();
  const isBelow900 = useMediaQuery(theme.breakpoints.down("md"));
  
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tutors from API
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tutors?limit=3&status=active');
        const result = await response.json();
        
        if (result.success) {
          setTutors(result.data.tutors);
        }
      } catch (error) {
        console.error('Error fetching tutors:', error);
      } finally {
        // Fast loading - show skeleton for 1.5 seconds then load
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };
    
    fetchTutors();
  }, []);

  // Don't render the component if there are no tutors and loading is complete
  if (!loading && tutors.length === 0) {
    return null;
  }

  return (
    <>
    <Stack spacing={[10,10,15]} my={18} width={'100%'}>
   
       <Stack
        spacing={4}
        p={3}
        minWidth={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        maxWidth={"100%"}
        data-aos="fade-up"
        data-aos-delay="100"
        sx={{
          backgroundImage: `
            linear-gradient(135deg, #EB7D7E, #B097BE, #6FD4E6
            ),
            url(/images/curriculum-banner-bg.png)
          `,
          backgroundPosition: isBelow900 ? "top center" : "fixed",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "overlay",
        }}
      >
        <Typography 
          fontSize={30} 
          color="white" 
          fontWeight={550}
          sx={{
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)",
            letterSpacing: "0.5px"
          }}
        >
          Meet Our Tutors
        </Typography>

        {/* Cards container */}
        <Stack
          direction={"row"}
          justifyContent={"center"}
          gap={[3,3,3,5,8]}
          flexWrap={"wrap"} // makes responsive
        >
          {loading ? (
            // Professional skeleton loading for 3 tutors
            <>
              {[1, 2, 3].map((index) => (
                <Stack
                  key={index}
                  spacing={2}
                  px={2}
                  py={4}
                  minWidth={"290px"}
                  maxWidth={"360px"}
                  flexGrow={1}
                  borderRadius={5}
                  alignItems={"center"}
                  sx={{ 
                    backgroundColor: "white",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), 0 6px 24px rgba(0, 0, 0, 0.08)",
                  }}
                  mb={[0,0,-16]}
                >
                  {/* Profile image skeleton */}
                  <Skeleton
                    variant="circular"
                    width={140}
                    height={140}
                    animation="pulse"
                    sx={{ animationDuration: '1.2s' }}
                  />
                  
                  {/* Name skeleton */}
                  <Skeleton
                    variant="text"
                    width={200}
                    height={32}
                    animation="pulse"
                    sx={{ animationDuration: '1.2s' }}
                  />
                  
                  {/* Subject skeleton */}
                  <Stack spacing={1} alignItems="center">
                    <Skeleton
                      variant="text"
                      width={150}
                      height={24}
                      animation="pulse"
                      sx={{ animationDuration: '1.2s' }}
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                      animation="pulse"
                      sx={{ animationDuration: '1.2s' }}
                    />
                  </Stack>
            </Stack>
              ))}
            </>
          ) : (
            tutors.map((tutor, index) => {
              return (
                <Stack
                  key={tutor._id || index}
                  spacing={2}
                  px={2}
                  py={4}
                  minWidth={"290px"} // keeps card readable
                  maxWidth={"360px"}
                  flexGrow={1}
                  borderRadius={5}
                  alignItems={"center"}
                  sx={{ 
                    backgroundColor: "white",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), 0 6px 24px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 12px 40px rgba(0, 0, 0, 0.12)"
                    }
                  }}
                  mb={[0,0,-16]}
                >
                  <img
                    src={tutor.image?.url || "/images/tutor1.png"}
                    alt={tutor.name}
                    height={140}
                    width={140}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  <Typography fontSize={25} color="black" fontWeight={"SemiBold"}>
                    {tutor.name}
                  </Typography>
                  <Stack spacing={0} textAlign={"center"}>
                    <Typography fontSize={16} color="rgba(0, 0, 0, 0.7)">
                      {tutor.subject}
                    </Typography>
                    <Typography fontSize={15} fontWeight={"bold"} color="black">
                      ({tutor.experience})
                    </Typography>
                  </Stack>
                </Stack>
              );
            })
          )}
        </Stack>
      </Stack>

          <Stack pt={[0,0,8,8]}>
             <Link href="/tutors" style={{ textDecoration: 'none', alignSelf: 'center' }}>
               <Button  
                 sx={{
                   color: "var(--info-color)",
                   backgroundColor: "transparent",
                   border: "1px solid var(--info-color)",
                   maxWidth: "320px",
                   fontSize: {xs: 14, sm: 16, md: 18},
                   px: {xs: 1.5, sm: 2, md: 2.5},
                   py: {xs: 1, sm: 1.5, md: 2},
                   borderRadius: 10,
                   transition: "all 0.3s ease",
                   "&:hover": {
                     backgroundColor: "var(--info-color)",
                     color: "var(--text-primary)",
                     transform: "translateY(-2px)",
                     boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                   }
                 }}  
                 endIcon={<Person2RoundedIcon sx={{width:25,height:25}}/>}
               >
                 See More Tutors
               </Button>
             </Link>
          </Stack>
     
    </Stack>
     
    </>
  );
}

export default OurTeam;
