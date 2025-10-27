import { Geist, Geist_Mono } from "next/font/google";
import { Quicksand } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Expert Online Tutoring for IGCSE, GCSE, A-Level & IB | Exam Partner",
    template: "%s | Exam Partner"
  },
  description: "Leading online tutoring platform for IGCSE, GCSE, A-Level, and IB students. Expert tutors in Mathematics, Physics, Chemistry, Biology, English, and more. Book your free trial session today!",
  keywords: [
    "online tutoring",
    "IGCSE tutors",
    "GCSE tutors", 
    "A-Level tutors",
    "IB tutors",
    "online education",
    "mathematics tutor",
    "physics tutor",
    "chemistry tutor",
    "biology tutor",
    "English tutor",
    "exam preparation",
    "academic tutoring",
    "home tutoring",
    "virtual learning"
  ],
  authors: [{ name: "Exam Partner" }],
  creator: "Exam Partner",
  publisher: "Exam Partner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Expert Online Tutoring for IGCSE, GCSE, A-Level & IB | Exam Partner",
    description: "Leading online tutoring platform with expert tutors for IGCSE, GCSE, A-Level, and IB students. Quality education delivered at your convenience.",
    url: '/',
    siteName: 'Exam Partner',
    images: [
      {
        url: '/images/my-exam-partner-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Exam Partner - Expert Online Tutoring',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Expert Online Tutoring for IGCSE, GCSE, A-Level & IB",
    description: "Leading online tutoring platform with expert tutors. Quality education delivered at your convenience.",
    images: ['/images/my-exam-partner-logo.jpg'],
    creator: '@exampartner',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/images/my-exam-partner-logo.jpg', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'education',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable}`}>
        <ReduxProvider>
          <LoadingProvider>
            {children}
            <WhatsAppFloatButton />
          </LoadingProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
