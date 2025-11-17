import { IconButton, Stack, Typography,Button } from '@mui/material'
import React from 'react'
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import Lottie from 'lottie-react';
import whyChooseAnimation from './why-choose-animation.json';
import { useRouter } from 'next/navigation';

function Booking() {
  const router = useRouter()
  const pointsData=[
    {
      info:"Certified & Verified Tutors – Experts you can trust for every subject."
    },
    {
      info:"Tailored Lesson Plans – Every class designed around your learning goals."
    },
    {
      info:"Exam-Focused Training – Past-paper practice and real exam simulations."
    },
    {
      info:"Weekly & Monthly Progress Reports – Transparent growth tracking for parents and students."
    },
    {
      info:"Fully Customised Schedule – Learn at your pace, on your time."
    },
    {
      info:"Proven Exam Techniques – Smart methods to boost grades and confidence."
    },
    {
      info:"Dedicated Education Consultant – Ongoing support to ensure lasting success."
    },
  ]
  return (
    <>
     <Stack px={[2,3,5]} my={12} direction={['column','column','column','row','row']} alignItems={'center'} justifyContent={'center'} gap={1} width={'100%'} sx={{backgroundImage:"url(/images/tutors.png)",backgroundAttcahment:"fixed",backgroundSize:"cover",backgroundRepeat:"no-repeat"}}  >

      {/* left section text  */}
      <Stack spacing={3}  py={6}  >
        <Typography fontSize={[26,28,30,32,35]} fontWeight={550} color='var(--text-primary)' >Why Choose My Exam Partner</Typography>
        <Typography fontSize={[16,18,20,22,25]} color='var(--text-primary)'>We are not just another tutoring service — we are your academic partners:</Typography>

        {/* points  */}
        <Stack spacing={2}>
          {
            pointsData.map((item,index)=>{
              return(
                <Stack key={index} direction={'row'} alignItems={'flex-start'} gap={1.5}>
                <IconButton sx={{backgroundColor:"white",p:0.5,mt:0.7}}>
                  <StarRoundedIcon sx={{fontSize:{xs:14,sm:16,md:18}}}/>
                </IconButton>
                  <Typography fontSize={[14,14,16,18,20]} textAlign={"justify"}  color='var(--text-primary)'>{item.info}</Typography>
                </Stack>
              )
            })
          }
        </Stack>
         <Button onClick={()=> router.push('/tutors')}  sx={{color:"var(--text-primary)",mt:10 ,  backgroundColor:"var(--info-color)",color:"var(--text-primary)",border:"1px solid var(--info-color)",maxWidth:"250px",fontSize:{xs:14,sm:16},px:{xs:1.5},py:{xs:1,sm:1.5,md:2},borderRadius:10}}  endIcon={<Person2RoundedIcon sx={{width:25,height:25}}/>}>Book Your Tutor</Button>
    </Stack>

    {/* right section lottie animation  */}
    <Stack overflow={'hidden'}
  minWidth={['100%','100%','100%','55%','55%']}
  maxWidth={['100%','100%','100%','55%','55%']} 
  sx={{
    '@media (max-width:1200px)': {
      display: 'none',
    },
  }}
>
  <Lottie
    animationData={whyChooseAnimation}
    loop={true}
    autoplay={true}
    style={{
      minHeight: "300px",
      maxHeight: "450px",
      borderRadius: 8,
      width: "100%",
    }}
  />
</Stack>

     
     </Stack>
    </>
  )
}

export default Booking
