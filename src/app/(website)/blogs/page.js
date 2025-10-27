import Blogs from '@/components/blogs/Blogs'
import React from 'react'

export const metadata = {
  title: 'Blog - Exam Partner | Educational Insights & Tips',
  description: 'Explore our collection of educational articles, exam tips, study techniques, and career guidance. Stay updated with the latest insights from education experts.',
  keywords: 'education blog, exam tips, study guides, learning resources, academic articles',
}

function page() {
  return (
    <>
      <Blogs/>
    </>
  )
}

export default page
