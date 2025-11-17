import Head from 'next/head';

/**
 * SEO Meta Component
 * Generates comprehensive meta tags for enhanced search engine optimization
 * 
 * @param {Object} props - SEO properties
 * @param {string} props.title - Page title (max 60 characters)
 * @param {string} props.description - Meta description (max 160 characters)
 * @param {string} props.keywords - Comma-separated keywords
 * @param {string} props.url - Canonical URL
 * @param {string} props.image - Open Graph image URL
 * @param {string} props.type - Open Graph type (website, article, etc.)
 * @param {string} props.author - Article author (for blog posts)
 * @param {string} props.publishedTime - Publication date (for blog posts)
 * @param {boolean} props.noindex - Whether to prevent indexing
 */

export default function SEOMeta({
  title = 'My Exam Partner - Online Tutoring & Exam Preparation Platform',
  description = 'Expert online tutoring for CBSE, IB, HKDSE, and Canadian Curriculum. Qualified tutors, flexible schedules, and personalized learning.',
  keywords = 'online tutoring, exam preparation, CBSE, IB, HKDSE, Canadian Curriculum, online classes, home tuition',
  url = 'https://www.myexampartner.com',
  image = 'https://www.myexampartner.com/images/my-exam-partner-logo.jpg',
  type = 'website',
  author = '',
  publishedTime = '',
  noindex = false
}) {
  const fullTitle = title.includes('My Exam Partner') ? title : `${title} - My Exam Partner`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="My Exam Partner" />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="My Exam Partner" />
      <meta property="og:locale" content="en_US" />
      
      {author && <meta property="article:author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@myexampartner" />
      <meta name="twitter:creator" content="@myexampartner" />

      {/* Additional SEO Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1a1a2e" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Head>
  );
}
