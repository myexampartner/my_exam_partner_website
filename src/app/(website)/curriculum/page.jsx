import MainCurriculum from '@/components/curriculum/MainCurriculum'
import React from 'react'

async function page({ searchParams }) {
  const params = await searchParams;
  const curriculumId = params?.id || null;
  
  return (
    <>
      <MainCurriculum curriculumId={curriculumId} />
    </>
  )
}

export default page
