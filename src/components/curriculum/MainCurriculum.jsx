import React from 'react'
import CurriculumBanner from './CurriculumBanner'
import OnlineTution from './OnlineTution'
import Widgets from '../about/Widgets'
import FlexibleLearning from './FlexibleLearning'
import SubjectCards from './SubjectCards'

function MainCurriculum({ curriculumId }) {
  // curriculumId is available here for future use
  // You can pass it to child components or use it to fetch specific data
  
  return (
    <>
      <CurriculumBanner curriculumId={curriculumId} />
      <OnlineTution curriculumId={curriculumId} />
      <Widgets/>
      <FlexibleLearning curriculumId={curriculumId} />
      <SubjectCards curriculumId={curriculumId} />
    </>
  )
}

export default MainCurriculum
