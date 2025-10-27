const mongoose = require('mongoose');
const Blog = require('../models/Blog').default;
require('dotenv').config({ path: '.env.local' });

const sampleBlogs = [
  {
    title: "10 Essential Study Tips for Exam Success",
    description: "Discover proven study techniques that will help you ace your exams and improve your academic performance.",
    content: `<h2>Introduction</h2>
    <p>Preparing for exams can be overwhelming, but with the right strategies, you can maximize your study time and improve your results. Here are 10 essential tips to help you succeed.</p>
    
    <h3>1. Create a Study Schedule</h3>
    <p>Plan your study sessions in advance and stick to a consistent schedule. This helps build good habits and ensures you cover all topics thoroughly.</p>
    
    <h3>2. Use Active Learning Techniques</h3>
    <p>Don't just read passively. Take notes, create mind maps, and explain concepts to others to reinforce your understanding.</p>
    
    <h3>3. Take Regular Breaks</h3>
    <p>Use the Pomodoro Technique: study for 25 minutes, then take a 5-minute break. This maintains focus and prevents burnout.</p>
    
    <h3>4. Practice with Past Papers</h3>
    <p>Familiarize yourself with exam formats and question types by practicing with previous years' papers.</p>
    
    <h3>5. Stay Organized</h3>
    <p>Keep your study materials organized and create a dedicated study space free from distractions.</p>
    
    <p>Remember, consistent effort and smart study techniques are the keys to exam success!</p>`,
    author: "Admin",
    category: "Study Material",
    tags: ["study tips", "exam preparation", "academic success"],
    status: "published",
    featured: true,
    image: {
      public_id: "exam-partner/blogs/study-tips",
      url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&crop=center&auto=format&q=80"
    },
    views: 245,
    likes: 56
  },
  {
    title: "How Technology is Transforming Education",
    description: "Explore how modern technology is revolutionizing the way we learn and teach in the digital age.",
    content: `<h2>The Digital Revolution in Education</h2>
    <p>Technology has fundamentally changed how we approach education. From online learning platforms to AI-powered tutoring, the educational landscape is evolving rapidly.</p>
    
    <h3>Online Learning Platforms</h3>
    <p>Platforms like Coursera, edX, and Khan Academy have made quality education accessible to millions worldwide, breaking down geographical barriers.</p>
    
    <h3>Virtual Reality in Classrooms</h3>
    <p>VR technology allows students to experience immersive learning environments, from exploring ancient civilizations to conducting virtual science experiments.</p>
    
    <h3>AI-Powered Personalized Learning</h3>
    <p>Artificial intelligence can adapt to individual learning styles and pace, providing customized educational experiences for each student.</p>
    
    <h3>Collaborative Tools</h3>
    <p>Cloud-based tools enable real-time collaboration between students and teachers, making group projects and discussions more efficient.</p>
    
    <p>The future of education is digital, and embracing these technologies can enhance learning outcomes for everyone.</p>`,
    author: "Admin",
    category: "Technology",
    tags: ["technology", "education", "online learning", "AI"],
    status: "published",
    featured: true,
    image: {
      public_id: "exam-partner/blogs/tech-education",
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop&crop=center&auto=format&q=80"
    },
    views: 189,
    likes: 42
  },
  {
    title: "Choosing the Right Career Path After Graduation",
    description: "A comprehensive guide to help students make informed decisions about their career choices after completing their education.",
    content: `<h2>Making the Right Career Choice</h2>
    <p>Choosing a career path is one of the most important decisions you'll make. Here's how to approach it strategically.</p>
    
    <h3>Self-Assessment</h3>
    <p>Start by understanding your strengths, interests, and values. What activities make you lose track of time? What subjects do you excel in?</p>
    
    <h3>Research Career Options</h3>
    <p>Explore different industries and roles. Talk to professionals, attend career fairs, and read about various career paths.</p>
    
    <h3>Consider Market Demand</h3>
    <p>Look at job market trends and future projections. Some fields are growing rapidly while others are declining.</p>
    
    <h3>Gain Experience</h3>
    <p>Internships, part-time jobs, and volunteer work can provide valuable insights into different careers.</p>
    
    <h3>Continuous Learning</h3>
    <p>The job market is constantly evolving. Be prepared to learn new skills and adapt throughout your career.</p>
    
    <p>Remember, your first job doesn't define your entire career. Stay flexible and open to new opportunities!</p>`,
    author: "Admin",
    category: "Career",
    tags: ["career advice", "graduation", "job search", "career planning"],
    status: "published",
    featured: false,
    image: {
      public_id: "exam-partner/blogs/career-guide",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&crop=center&auto=format&q=80"
    },
    views: 156,
    likes: 38
  },
  {
    title: "The Ultimate Guide to Time Management for Students",
    description: "Learn practical time management strategies that will help you balance academics, extracurricular activities, and personal life.",
    content: `<h2>Master Your Time, Master Your Life</h2>
    <p>Effective time management is crucial for academic success and personal well-being. Here's your comprehensive guide.</p>
    
    <h3>Prioritize Your Tasks</h3>
    <p>Use the Eisenhower Matrix to categorize tasks by urgency and importance. Focus on what matters most.</p>
    
    <h3>Use a Planner</h3>
    <p>Whether digital or physical, a planner helps you track deadlines, assignments, and commitments.</p>
    
    <h3>Avoid Multitasking</h3>
    <p>Contrary to popular belief, multitasking reduces productivity. Focus on one task at a time for better results.</p>
    
    <h3>Set Realistic Goals</h3>
    <p>Break large projects into smaller, manageable tasks. This makes them less overwhelming and easier to complete.</p>
    
    <h3>Learn to Say No</h3>
    <p>Don't overcommit yourself. It's okay to decline requests that don't align with your priorities.</p>
    
    <p>With these strategies, you'll find yourself with more time and less stress!</p>`,
    author: "Admin",
    category: "Tips & Tricks",
    tags: ["time management", "productivity", "study skills", "organization"],
    status: "published",
    featured: false,
    image: {
      public_id: "exam-partner/blogs/time-management",
      url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=630&fit=crop&crop=center&auto=format&q=80"
    },
    views: 198,
    likes: 45
  },
  {
    title: "Understanding Pakistan's Education System: A Complete Overview",
    description: "An in-depth look at Pakistan's education system, from primary to higher education, and current reforms.",
    content: `<h2>Pakistan's Education Landscape</h2>
    <p>Pakistan's education system has evolved significantly over the years. Let's explore its structure and recent developments.</p>
    
    <h3>Structure of Education</h3>
    <p>The system is divided into five levels: Pre-primary, Primary (1-5), Middle (6-8), Secondary (9-10), and Higher Secondary (11-12).</p>
    
    <h3>Examination Boards</h3>
    <p>Multiple boards conduct exams across provinces, including Federal Board, Punjab Board, and others.</p>
    
    <h3>Higher Education</h3>
    <p>The Higher Education Commission (HEC) regulates universities and degree-awarding institutions.</p>
    
    <h3>Recent Reforms</h3>
    <p>The Single National Curriculum (SNC) aims to standardize education across all schools in Pakistan.</p>
    
    <h3>Challenges and Opportunities</h3>
    <p>While challenges exist, initiatives in digital education and vocational training are creating new opportunities.</p>
    
    <p>Understanding the system helps students and parents make informed educational decisions.</p>`,
    author: "Admin",
    category: "Education",
    tags: ["Pakistan", "education system", "academic", "reforms"],
    status: "published",
    featured: false,
    image: {
      public_id: "exam-partner/blogs/pakistan-education",
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=630&fit=crop&crop=center&auto=format&q=80"
    },
    views: 134,
    likes: 29
  },
  {
    title: "Effective Note-Taking Strategies for Better Learning",
    description: "Discover different note-taking methods and find the one that works best for your learning style.",
    content: `<h2>The Art of Note-Taking</h2>
    <p>Good notes are the foundation of effective studying. Let's explore proven note-taking methods.</p>
    
    <h3>The Cornell Method</h3>
    <p>Divide your page into three sections: notes, cues, and summary. This structured approach enhances review and retention.</p>
    
    <h3>Mind Mapping</h3>
    <p>Visual learners benefit from creating diagrams that show relationships between concepts.</p>
    
    <h3>The Outline Method</h3>
    <p>Organize information hierarchically with main topics and subtopics. Great for structured lectures.</p>
    
    <h3>Digital Note-Taking</h3>
    <p>Apps like Notion, OneNote, and Evernote offer flexibility and searchability.</p>
    
    <h3>The Boxing Method</h3>
    <p>Group related information in boxes for easy visualization and review.</p>
    
    <p>Experiment with different methods to find what works best for you!</p>`,
    author: "Admin",
    category: "Study Material",
    tags: ["note-taking", "study methods", "learning", "productivity"],
    status: "draft",
    featured: false,
    image: {
      public_id: "exam-partner/blogs/note-taking",
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=630&fit=crop&crop=center&auto=format&q=80"
    },
    views: 0,
    likes: 0
  }
];

async function seedBlogs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('Cleared existing blogs');

    // Generate slugs for blogs that don't have them
    const blogsWithSlugs = sampleBlogs.map((blog, index) => {
      if (!blog.slug) {
        blog.slug = blog.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim() + '-' + Date.now() + '-' + index;
      }
      return blog;
    });

    // Insert sample blogs one by one to handle any remaining conflicts
    const blogs = [];
    for (const blogData of blogsWithSlugs) {
      try {
        const blog = await Blog.create(blogData);
        blogs.push(blog);
        console.log(`- Created: ${blog.title} (${blog.status})`);
      } catch (error) {
        console.error(`Error creating blog "${blogData.title}":`, error.message);
      }
    }

    console.log(`Successfully seeded ${blogs.length} blogs`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
}

seedBlogs();

