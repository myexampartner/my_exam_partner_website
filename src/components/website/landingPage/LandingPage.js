"use client"
import React from 'react'
import Banner from './Banner'
import Milestones from './Milestones'
import OurTeam from './OurTeam'
import StartingSteps from './StartingSteps'
import Booking from './Booking'
import FAQs from './FAQs'
import ContactUs from './ContactForm'

export default function LandingPage() {
  return (
    <>
      <Banner/>
      <Milestones/>
      <OurTeam/>
      <StartingSteps/>
      <Booking/>
      <FAQs/>
      <ContactUs/>
    </>
  )
}
