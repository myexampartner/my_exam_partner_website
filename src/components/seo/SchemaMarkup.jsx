import Head from 'next/head';

/**
 * SchemaMarkup Component
 * Generates JSON-LD structured data for enhanced SEO and rich snippets
 */
export default function SchemaMarkup({ type, data }) {
  // Generate schema based on type
  const generateSchema = () => {
    switch (type) {
      case 'Organization':
        return createOrganizationSchema(data);
      case 'Website':
        return createWebsiteSchema(data);
      case 'Course':
        return createCourseSchema(data);
      case 'FAQPage':
        return createFAQSchema(data);
      case 'BlogPost':
        return createBlogSchema(data);
      case 'Person':
        return createPersonSchema(data);
      case 'BreadcrumbList':
        return createBreadcrumbSchema(data);
      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

// Organization Schema
function createOrganizationSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': 'https://www.myexampartner.com/#organization',
    name: data.name || 'Exam Partner',
    alternateName: 'My Exam Partner',
    url: data.url || 'https://www.myexampartner.com',
    logo: data.logo || 'https://www.myexampartner.com/images/my-exam-partner-logo.jpg',
    description: data.description || 'Leading online tutoring platform for CBSE, IB, HKDSE, and Canadian Curriculum',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
      addressLocality: 'Pakistan'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: data.email || 'info@myexampartner.com',
      availableLanguage: ['en', 'ur']
    },
    sameAs: [
      'https://www.facebook.com/myexampartner',
      'https://www.twitter.com/myexampartner',
      'https://www.linkedin.com/company/myexampartner'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150'
    }
  };
}

// Website Schema
function createWebsiteSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Exam Partner',
    url: 'https://www.myexampartner.com',
    description: 'Online tutoring and exam preparation platform',
    publisher: {
      '@id': 'https://www.myexampartner.com/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.myexampartner.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

// Course Schema
function createCourseSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: data.name,
    description: data.description,
    provider: {
      '@id': 'https://www.myexampartner.com/#organization'
    },
    courseCode: data.courseCode,
    educationalLevel: data.level || 'Secondary',
    teaches: data.teaches || 'Academic subjects',
    offers: {
      '@type': 'Offer',
      price: data.price || '0',
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock'
    }
  };
}

// FAQ Page Schema
function createFAQSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };
}

// Blog Post Schema
function createBlogSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.publishedAt,
    dateModified: data.lastModified || data.publishedAt,
    author: {
      '@type': 'Person',
      name: data.author || 'Admin'
    },
    publisher: {
      '@id': 'https://www.myexampartner.com/#organization'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url
    },
    articleSection: data.category
  };
}

// Person Schema (for tutors)
function createPersonSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: 'Online Tutor',
    worksFor: {
      '@id': 'https://www.myexampartner.com/#organization'
    },
    description: data.description
  };
}

// Breadcrumb Schema
function createBreadcrumbSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
