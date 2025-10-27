import React from 'react'
import Intro from './Intro'
import OurPurpose from './OurPurpose'
import OurMission from './OurMission'
import OurApproach from './OurApproach'
import FAQs from '../website/landingPage/FAQs'
import AboutBanner from './AboutBanner'

function MainAbout() {
  return (
    <>
      <AboutBanner/>
      <Intro/>
      <OurPurpose/>
      <OurMission/>
      <OurApproach/>
      <FAQs/>
    </>
  )
}

export default MainAbout
