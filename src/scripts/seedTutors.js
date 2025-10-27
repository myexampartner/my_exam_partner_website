import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env.local') });

import { connectDB } from '../lib/mongodb.js';
import Tutor from '../models/Tutor.js';

const sampleTutors = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "3001234567",
    subject: "Mathematics",
    qualification: "PhD in Mathematics from MIT",
    experience: "10 years",
    rating: 4.8,
    status: "active",
    bio: "Passionate mathematics educator with extensive experience in calculus and algebra.",
    specialization: ["Calculus", "Algebra", "Statistics"],
    availability: "full-time",
    hourlyRate: 2500,
    languages: ["English", "Urdu"],
    certifications: ["PhD Mathematics", "Certified Math Teacher"],
    teachingMethods: ["Interactive Learning", "Problem Solving"],
    studentCount: 150,
    successRate: 95,
    isVerified: true,
    image: {
      public_id: "sample_tutor_1",
      url: "/images/tutor1.png"
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      website: "https://sarahjohnsonmath.com"
    },
    address: {
      city: "Karachi",
      state: "Sindh",
      country: "Pakistan"
    }
  },
  {
    name: "Prof. Michael Chen",
    email: "michael.chen@example.com",
    phone: "3009876543",
    subject: "Physics",
    qualification: "MSc Physics from Oxford University",
    experience: "8 years",
    rating: 4.9,
    status: "active",
    bio: "Expert in theoretical physics with a focus on quantum mechanics and relativity.",
    specialization: ["Quantum Mechanics", "Thermodynamics", "Electromagnetism"],
    availability: "part-time",
    hourlyRate: 3000,
    languages: ["English"],
    certifications: ["MSc Physics", "Certified Physics Teacher"],
    teachingMethods: ["Visual Learning", "Practical Examples"],
    studentCount: 120,
    successRate: 92,
    isVerified: true,
    image: {
      public_id: "sample_tutor_2",
      url: "/images/tutor2.png"
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchen"
    },
    address: {
      city: "Lahore",
      state: "Punjab",
      country: "Pakistan"
    }
  },
  {
    name: "Dr. Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "3001112233",
    subject: "Chemistry",
    qualification: "PhD in Chemistry from Cambridge University",
    experience: "12 years",
    rating: 4.7,
    status: "active",
    bio: "Organic chemistry specialist with expertise in laboratory techniques and research.",
    specialization: ["Organic Chemistry", "Inorganic Chemistry", "Biochemistry"],
    availability: "flexible",
    hourlyRate: 2800,
    languages: ["English", "Urdu"],
    certifications: ["PhD Chemistry", "Lab Safety Certified"],
    teachingMethods: ["Lab-based Learning", "Interactive Sessions"],
    studentCount: 180,
    successRate: 88,
    isVerified: true,
    image: {
      public_id: "sample_tutor_3",
      url: "/images/tutor1.png"
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/emmawilson",
      website: "https://emmawilsonchemistry.com"
    },
    address: {
      city: "Islamabad",
      state: "Capital Territory",
      country: "Pakistan"
    }
  },
  {
    name: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    phone: "3005556677",
    subject: "Biology",
    qualification: "PhD in Biology from Harvard University",
    experience: "15 years",
    rating: 4.6,
    status: "active",
    bio: "Molecular biology expert with extensive research experience in genetics.",
    specialization: ["Molecular Biology", "Genetics", "Ecology"],
    availability: "full-time",
    hourlyRate: 2700,
    languages: ["English", "Urdu", "Arabic"],
    certifications: ["PhD Biology", "Research Certified"],
    teachingMethods: ["Research-based Learning", "Case Studies"],
    studentCount: 200,
    successRate: 90,
    isVerified: true,
    image: {
      public_id: "sample_tutor_4",
      url: "/images/tutor2.png"
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/ahmedhassan",
      website: "https://ahmedhassanbiology.com"
    },
    address: {
      city: "Karachi",
      state: "Sindh",
      country: "Pakistan"
    }
  },
  {
    name: "Ms. Fatima Ali",
    email: "fatima.ali@example.com",
    phone: "3009998888",
    subject: "English",
    qualification: "MA in English Literature from University of London",
    experience: "6 years",
    rating: 4.5,
    status: "active",
    bio: "English literature specialist with expertise in creative writing and communication.",
    specialization: ["Literature", "Creative Writing", "Communication"],
    availability: "part-time",
    hourlyRate: 2000,
    languages: ["English", "Urdu", "French"],
    certifications: ["MA English Literature", "TESOL Certified"],
    teachingMethods: ["Creative Writing", "Discussion-based Learning"],
    studentCount: 100,
    successRate: 85,
    isVerified: true,
    image: {
      public_id: "sample_tutor_5",
      url: "/images/tutor1.png"
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/fatimaali",
      twitter: "https://twitter.com/fatimaali"
    },
    address: {
      city: "Lahore",
      state: "Punjab",
      country: "Pakistan"
    }
  }
];

async function seedTutors() {
  try {
    await connectDB();
    
    // Clear existing tutors
    await Tutor.deleteMany({});
    console.log('Cleared existing tutors');
    
    // Insert sample tutors
    const insertedTutors = await Tutor.insertMany(sampleTutors);
    console.log(`Successfully seeded ${insertedTutors.length} tutors`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tutors:', error);
    process.exit(1);
  }
}

seedTutors();
