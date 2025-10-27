"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CardSlider() {
  const sliderRef = useRef(null);


  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const cardData=[
      {
        descrip:"The training so far have been great. i haveunderstood whatever has been taught certainly.There have been no technical problems in theuse of the portal and i would give the instructor aperfect score",
        image:"/images/member1.png",
        name:"John",
        position:"Teacher"
      },
       {
        descrip:"The training so far have been great. i haveunderstood whatever has been taught certainly.There have been no technical problems in theuse of the portal and i would give the instructor aperfect score",
        image:"/images/member2.png",
        name:"Benny",
        position:"CEO"
      },
       {
        descrip:"The training so far have been great. i haveunderstood whatever has been taught certainly.There have been no technical problems in theuse of the portal and i would give the instructor aperfect score",
        image:"/images/member3.png",
        name:"Kishore",
        position:"CEO"
      },
       {
        descrip:"The training so far have been great. i haveunderstood whatever has been taught certainly.There have been no technical problems in theuse of the portal and i would give the instructor aperfect score",
        image:"/images/member1.png",
        name:"John",
        position:"Teacher"
      },
       {
        descrip:"The training so far have been great. i haveunderstood whatever has been taught certainly.There have been no technical problems in theuse of the portal and i would give the instructor aperfect score",
        image:"/images/member2.png",
        name:"Benny",
        position:"CEO"
      },
      
  ]

  return (
    <Stack spacing={5} mt={18}>
    {/* top text  */}
    <Stack spacing={1} alignSelf={'center'} textAlign={'center'}>
      <Typography color="var(--info-color)" fontSize={16} fontWeight={'bold'}>Flexible Learning, Global Success.</Typography>
      <Typography color="var(--dark-color)" fontSize={28} fontWeight={'bold'}>Hear What Our Valued Customers Have to Say</Typography>
    </Stack>
      <Box
      sx={{
        width: "100%",
        position: "relative",
        py: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Slider */}
      <Box
        sx={{
          width: "90%",
          "& .slick-slide > div": {
            margin: "10px 15px", // gap between cards
          },
          "& .slick-list": {
            margin: "10px -15px", // remove outer spacing
          },
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {cardData.map((item, index) => (
            <Box
              key={index}
              sx={{
                minWidth: 250,
                borderRadius: 8,
                boxShadow: 5,
                }}
            >
            <Stack spacing={[2.5]} px={3} py={4} >
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.75 6.25H4.6875C2.10312 6.25 0 8.35313 0 10.9375V25C0 27.5844 2.10312 29.6875 4.6875 29.6875H10.9953L8.62344 41.8906C8.57969 42.1167 8.58644 42.3496 8.64321 42.5728C8.69999 42.7959 8.80537 43.0037 8.95183 43.1814C9.09829 43.3591 9.28221 43.5022 9.49042 43.6005C9.69864 43.6988 9.926 43.7498 10.1562 43.75H15.2188C16.5781 43.75 17.7844 42.8609 18.1969 41.5734L22.7437 30.7844C22.7703 30.7219 22.7922 30.6594 22.8109 30.5969C23.2266 29.0984 23.4375 27.55 23.4375 25.9953V10.9375C23.4375 8.35313 21.3344 6.25 18.75 6.25ZM45.3125 6.25H31.25C28.6656 6.25 26.5625 8.35313 26.5625 10.9375V25C26.5625 27.5844 28.6656 29.6875 31.25 29.6875H37.5578L35.1859 41.8906C35.1413 42.1168 35.1474 42.35 35.2039 42.5735C35.2603 42.797 35.3656 43.0052 35.5123 43.1831C35.6589 43.361 35.8432 43.5041 36.0518 43.6021C36.2604 43.7002 36.4882 43.7507 36.7188 43.75H41.7812C43.1406 43.75 44.3484 42.8609 44.7578 41.5734L49.3078 30.7844C49.3328 30.7219 49.3547 30.6594 49.3734 30.5953C49.7891 29.0969 50 27.5484 50 25.9953V10.9375C50 8.35313 47.8969 6.25 45.3125 6.25Z"
                  fill="#013781"
                />
              </svg>
              <Typography fontSize={16} color="var(--dark-color)">
                {item.descrip}
              </Typography>
            </Stack>
              

              <Stack direction={'row'}   alignItems={'center'} gap={2} sx={{backgroundColor:"rgba(1, 55, 129, 0.03)",borderBottomLeftRadius:18,borderBottomRightRadius:18}} py={2} alignSelf={'flex-end'} px={3} >
                <img src={item.image} height={50} width={50}/>
                <Stack spacing={0}>
                  <Typography color="var(--dark-color)" fontWeight={'bold'} fontSize={16}>{item.name}</Typography>
                  <Typography color="var(--dark-color)" fontSize={14}>{item.position}</Typography>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Arrows below cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 3,
        }}
      >
        <IconButton
          onClick={() => sliderRef.current.slickPrev()}
          sx={{
            backgroundColor: "white",
            boxShadow: 5,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton
          onClick={() => sliderRef.current.slickNext()}
          sx={{
            backgroundColor: "white",
            boxShadow: 5,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
    </Stack>
    
  );
}
