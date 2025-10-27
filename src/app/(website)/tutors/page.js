import AllTutors from '@/components/allTutors/AllTutors';

export const metadata = {
  title: 'Find Expert Online Tutors | IGCSE, GCSE, A-Level & IB Tutoring',
  description: 'Browse our qualified and experienced online tutors for IGCSE, GCSE, A-Level, and IB programs. Expert teachers in Mathematics, Physics, Chemistry, Biology, English, and more. Book your session today!',
  keywords: 'online tutors, IGCSE tutors, GCSE tutors, A-Level tutors, IB tutors, mathematics tutor, physics tutor, chemistry tutor, biology tutor, English tutor, online tutoring, expert teachers',
  openGraph: {
    title: 'Find Expert Online Tutors | IGCSE, GCSE, A-Level & IB Tutoring',
    description: 'Browse our qualified and experienced online tutors for IGCSE, GCSE, A-Level, and IB programs. Expert teachers ready to help you excel.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Expert Online Tutors | IGCSE, GCSE, A-Level & IB Tutoring',
    description: 'Browse our qualified and experienced online tutors. Expert teachers in Mathematics, Physics, Chemistry, Biology, English, and more.',
  },
  alternates: {
    canonical: '/tutors',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TutorsPage() {
  return <AllTutors />;
}