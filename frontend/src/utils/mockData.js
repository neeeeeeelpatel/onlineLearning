// Mock data for the e-learning platform

// Demo users for login
export const demoUsers = {
  admin: { email: "admin@nex.com", password: "admin123", role: "admin" },
  instructor: { email: "inst@nex.com", password: "inst123", role: "instructor" },
  learner: { email: "learn@nex.com", password: "learn123", role: "learner" },
};

// Educational video URLs for different topics
const videoUrls = {
  webDevelopment: [
    "https://www.youtube.com/watch?v=UB1O30fR-EE", // HTML Tutorial
    "https://www.youtube.com/watch?v=yfoY53QXEnI", // CSS Tutorial
    "https://www.youtube.com/watch?v=W6NZfCO5SIk", // JavaScript Tutorial
    "https://www.youtube.com/watch?v=3PHXvlpOkf4", // React Tutorial
    "https://www.youtube.com/watch?v=Ke90Tje7VS0", // Node.js Tutorial
    "https://www.youtube.com/watch?v=Oe421EPjeBE", // MongoDB Tutorial
    "https://www.youtube.com/watch?v=1Rs2ND1ryYc", // Express.js Tutorial
    "https://www.youtube.com/watch?v=w7ejDZ8SWv8", // React Hooks Tutorial
  ],
  dataScience: [
    "https://www.youtube.com/watch?v=_uQrJ0TkZlc", // Python Tutorial
    "https://www.youtube.com/watch?v=dcqPhpY7tWk", // Pandas Tutorial
    "https://www.youtube.com/watch?v=QUT1VHiLmmI", // NumPy Tutorial
    "https://www.youtube.com/watch?v=3JwWr7W5TZo", // Matplotlib Tutorial
    "https://www.youtube.com/watch?v=aircAruvnKk", // Neural Networks
    "https://www.youtube.com/watch?v=KNAWp2S3w94", // Machine Learning
    "https://www.youtube.com/watch?v=JcI5Vnw0b2c", // Data Analysis
    "https://www.youtube.com/watch?v=ua-CiDNNj30", // Scikit-learn
  ],
  design: [
    "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", // UI/UX Design
    "https://www.youtube.com/watch?v=68w2VwalD5w", // Figma Tutorial
    "https://www.youtube.com/watch?v=1PnVor36_40", // Adobe XD
    "https://www.youtube.com/watch?v=YQHsXMglC9A", // Design Principles
    "https://www.youtube.com/watch?v=KkzVFB3Ba_o", // Color Theory
    "https://www.youtube.com/watch?v=sByzHoiYFX0", // Typography
    "https://www.youtube.com/watch?v=ZK86XQ1iFVs", // Wireframing
    "https://www.youtube.com/watch?v=7kVeCqQCxlk", // Prototyping
  ],
  mobileDevelopment: [
    "https://www.youtube.com/watch?v=0-S5a0eXPoc", // React Native
    "https://www.youtube.com/watch?v=9bXhf_TELP4", // Flutter Tutorial
    "https://www.youtube.com/watch?v=8jLOx1hD3_o", // iOS Development
    "https://www.youtube.com/watch?v=fis26HvvDII", // Android Development
    "https://www.youtube.com/watch?v=1ukSR1GRtMU", // Mobile UI Design
    "https://www.youtube.com/watch?v=G4lZ6sUe6es", // App Architecture
    "https://www.youtube.com/watch?v=9QVjuAhT6lY", // State Management
    "https://www.youtube.com/watch?v=7CqJlxBYj-M", // Navigation
  ],
  business: [
    "https://www.youtube.com/watch?v=7sEVzQjJjqY", // Business Strategy
    "https://www.youtube.com/watch?v=YyqDdFpEDQQ", // Marketing
    "https://www.youtube.com/watch?v=8bU3SCl7MCU", // Entrepreneurship
    "https://www.youtube.com/watch?v=GJ98Lyda54o", // Finance
    "https://www.youtube.com/watch?v=8jPQjjsBbIc", // Leadership
    "https://www.youtube.com/watch?v=9aHTHpejASE", // Project Management
    "https://www.youtube.com/watch?v=8bU3SCl7MCU", // Business Analytics
    "https://www.youtube.com/watch?v=GJ98Lyda54o", // Investment
  ],
  marketing: [
    "https://www.youtube.com/watch?v=YyqDdFpEDQQ", // Digital Marketing
    "https://www.youtube.com/watch?v=9aHTHpejASE", // Social Media
    "https://www.youtube.com/watch?v=8jPQjjsBbIc", // Content Marketing
    "https://www.youtube.com/watch?v=7sEVzQjJjqY", // SEO
    "https://www.youtube.com/watch?v=GJ98Lyda54o", // Email Marketing
    "https://www.youtube.com/watch?v=8bU3SCl7MCU", // PPC Advertising
    "https://www.youtube.com/watch?v=YyqDdFpEDQQ", // Analytics
    "https://www.youtube.com/watch?v=9aHTHpejASE", // Brand Strategy
  ]
};

// Mock courses data
export const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "John Doe",
    instructorId: 101,
    category: "Web Development",
    level: "Beginner",
    rating: 4.8,
    reviews: 120,
    students: 1500,
    price: 49.99,
    discountPrice: 39.99,
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. This course is perfect for beginners who want to start their journey in web development.",
    duration: "10 hours",
    lastUpdated: "2023-10-15",
    isBestseller: true,
    isNew: false,
    modules: [
      {
        id: 1,
        title: "Getting Started with HTML",
        duration: "1.5 hours",
        lessons: [
          { id: 1, title: "Introduction to HTML", duration: "15 mins", videoUrl: videoUrls.webDevelopment[0], type: "video" },
          { id: 2, title: "HTML Document Structure", duration: "20 mins", videoUrl: videoUrls.webDevelopment[0], type: "video" },
          { id: 3, title: "HTML Elements and Tags", duration: "25 mins", videoUrl: videoUrls.webDevelopment[0], type: "video" },
          { id: 4, title: "HTML Forms", duration: "30 mins", videoUrl: videoUrls.webDevelopment[0], type: "video" },
        ],
      },
      {
        id: 2,
        title: "CSS Fundamentals",
        duration: "2 hours",
        lessons: [
          { id: 1, title: "Introduction to CSS", duration: "20 mins", videoUrl: videoUrls.webDevelopment[1], type: "video" },
          { id: 2, title: "CSS Selectors", duration: "25 mins", videoUrl: videoUrls.webDevelopment[1], type: "video" },
          { id: 3, title: "CSS Box Model", duration: "30 mins", videoUrl: videoUrls.webDevelopment[1], type: "video" },
          { id: 4, title: "CSS Flexbox", duration: "45 mins", videoUrl: videoUrls.webDevelopment[1], type: "video" },
        ],
      },
      {
        id: 3,
        title: "JavaScript Basics",
        duration: "2.5 hours",
        lessons: [
          { id: 1, title: "Introduction to JavaScript", duration: "20 mins", videoUrl: videoUrls.webDevelopment[2], type: "video" },
          { id: 2, title: "Variables and Data Types", duration: "30 mins", videoUrl: videoUrls.webDevelopment[2], type: "video" },
          { id: 3, title: "Functions and Events", duration: "40 mins", videoUrl: videoUrls.webDevelopment[2], type: "video" },
          { id: 4, title: "DOM Manipulation", duration: "60 mins", videoUrl: videoUrls.webDevelopment[2], type: "video" },
        ],
      },
    ],
    quiz: [
      {
        id: 1,
        title: "HTML Basics Quiz",
        questions: [
          {
            id: 1,
            type: "mcq",
            question: "What does HTML stand for?",
            options: [
              "Hyper Text Markup Language",
              "High Tech Modern Language",
              "Hyper Transfer Markup Language",
              "Hyper Text Modern Language",
            ],
            correctAnswer: "Hyper Text Markup Language",
          },
          {
            id: 2,
            type: "mcq",
            question: "Which tag is used to create a hyperlink?",
            options: ["<a>", "<link>", "<href>", "<url>"],
            correctAnswer: "<a>",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    instructor: "Jane Smith",
    instructorId: 102,
    category: "Web Development",
    level: "Intermediate",
    rating: 4.6,
    reviews: 85,
    students: 950,
    price: 69.99,
    discountPrice: 59.99,
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description: "Take your JavaScript skills to the next level with advanced concepts like closures, prototypes, async/await, and more.",
    duration: "12 hours",
    lastUpdated: "2023-09-20",
    isBestseller: false,
    isNew: true,
    modules: [
      {
        id: 1,
        title: "Advanced JavaScript Concepts",
        duration: "3 hours",
        lessons: [
          { id: 1, title: "Closures and Scope", duration: "45 mins", videoUrl: videoUrls.webDevelopment[2], type: "video" },
          { id: 2, title: "Prototypes and Inheritance", duration: "50 mins", videoUrl: videoUrls.webDevelopment[2], type: "video" },
          { id: 3, title: "ES6+ Features", duration: "45 mins", videoUrl: videoUrls.webDevelopment[2], type: "video" },
          { id: 4, title: "Functional Programming", duration: "40 mins", videoUrl: videoUrls.webDevelopment[2], type: "video" },
        ],
      },
      {
        id: 2,
        title: "React Fundamentals",
        duration: "4 hours",
        lessons: [
          { id: 1, title: "Introduction to React", duration: "30 mins", videoUrl: videoUrls.webDevelopment[3], type: "video" },
          { id: 2, title: "Components and Props", duration: "45 mins", videoUrl: videoUrls.webDevelopment[3], type: "video" },
          { id: 3, title: "State and Lifecycle", duration: "60 mins", videoUrl: videoUrls.webDevelopment[3], type: "video" },
          { id: 4, title: "React Hooks", duration: "45 mins", videoUrl: videoUrls.webDevelopment[7], type: "video" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Data Science with Python",
    instructor: "Michael Johnson",
    instructorId: 103,
    category: "Data Science",
    level: "Intermediate",
    rating: 4.9,
    reviews: 200,
    students: 2200,
    price: 79.99,
    discountPrice: 69.99,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description: "Learn data science using Python, including pandas, numpy, matplotlib, and scikit-learn for data analysis and machine learning.",
    duration: "15 hours",
    lastUpdated: "2023-11-05",
    isBestseller: true,
    isNew: false,
    modules: [
      {
        id: 1,
        title: "Python Fundamentals for Data Science",
        duration: "4 hours",
        lessons: [
          { id: 1, title: "Introduction to Python", duration: "30 mins", videoUrl: videoUrls.dataScience[0], type: "video" },
          { id: 2, title: "Working with NumPy", duration: "45 mins", videoUrl: videoUrls.dataScience[2], type: "video" },
          { id: 3, title: "Data Manipulation with Pandas", duration: "60 mins", videoUrl: videoUrls.dataScience[1], type: "video" },
          { id: 4, title: "Data Visualization", duration: "45 mins", videoUrl: videoUrls.dataScience[3], type: "video" },
        ],
      },
      {
        id: 2,
        title: "Machine Learning Basics",
        duration: "5 hours",
        lessons: [
          { id: 1, title: "Introduction to Machine Learning", duration: "40 mins", videoUrl: videoUrls.dataScience[5], type: "video" },
          { id: 2, title: "Supervised Learning", duration: "60 mins", videoUrl: videoUrls.dataScience[7], type: "video" },
          { id: 3, title: "Unsupervised Learning", duration: "50 mins", videoUrl: videoUrls.dataScience[7], type: "video" },
          { id: 4, title: "Neural Networks", duration: "70 mins", videoUrl: videoUrls.dataScience[4], type: "video" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    instructor: "Sarah Williams",
    instructorId: 104,
    category: "Design",
    level: "Beginner",
    rating: 4.7,
    reviews: 150,
    students: 1800,
    price: 59.99,
    discountPrice: 49.99,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
    description: "Master the principles of UI/UX design and create user-friendly interfaces that provide excellent user experiences.",
    duration: "8 hours",
    lastUpdated: "2023-10-10",
    isBestseller: false,
    isNew: false,
    modules: [
      {
        id: 1,
        title: "UI Design Fundamentals",
        duration: "2.5 hours",
        lessons: [
          { id: 1, title: "Design Principles", duration: "30 mins", videoUrl: videoUrls.design[3], type: "video" },
          { id: 2, title: "Color Theory", duration: "35 mins", videoUrl: videoUrls.design[4], type: "video" },
          { id: 3, title: "Typography", duration: "40 mins", videoUrl: videoUrls.design[5], type: "video" },
          { id: 4, title: "Layout and Composition", duration: "45 mins", videoUrl: videoUrls.design[3], type: "video" },
        ],
      },
      {
        id: 2,
        title: "Design Tools",
        duration: "3 hours",
        lessons: [
          { id: 1, title: "Figma Basics", duration: "40 mins", videoUrl: videoUrls.design[1], type: "video" },
          { id: 2, title: "Wireframing", duration: "35 mins", videoUrl: videoUrls.design[6], type: "video" },
          { id: 3, title: "Prototyping", duration: "45 mins", videoUrl: videoUrls.design[7], type: "video" },
          { id: 4, title: "User Testing", duration: "30 mins", videoUrl: videoUrls.design[0], type: "video" },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    instructor: "David Brown",
    instructorId: 105,
    category: "Mobile Development",
    level: "Intermediate",
    rating: 4.5,
    reviews: 95,
    students: 1200,
    price: 69.99,
    discountPrice: 59.99,
    thumbnail: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description: "Build cross-platform mobile applications using React Native. Learn to create native-like experiences for iOS and Android.",
    duration: "14 hours",
    lastUpdated: "2023-11-01",
    isBestseller: false,
    isNew: true,
    modules: [
      {
        id: 1,
        title: "Getting Started with React Native",
        duration: "3 hours",
        lessons: [
          { id: 1, title: "Introduction to React Native", duration: "30 mins", videoUrl: videoUrls.mobileDevelopment[0], type: "video" },
          { id: 2, title: "Setting up Development Environment", duration: "45 mins", videoUrl: videoUrls.mobileDevelopment[0], type: "video" },
          { id: 3, title: "Basic Components", duration: "40 mins", videoUrl: videoUrls.mobileDevelopment[0], type: "video" },
          { id: 4, title: "Navigation", duration: "35 mins", videoUrl: videoUrls.mobileDevelopment[7], type: "video" },
        ],
      },
      {
        id: 2,
        title: "Advanced React Native",
        duration: "4 hours",
        lessons: [
          { id: 1, title: "State Management", duration: "50 mins", videoUrl: videoUrls.mobileDevelopment[6], type: "video" },
          { id: 2, title: "API Integration", duration: "45 mins", videoUrl: videoUrls.mobileDevelopment[0], type: "video" },
          { id: 3, title: "Native Modules", duration: "60 mins", videoUrl: videoUrls.mobileDevelopment[0], type: "video" },
          { id: 4, title: "App Deployment", duration: "40 mins", videoUrl: videoUrls.mobileDevelopment[0], type: "video" },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Digital Marketing Masterclass",
    instructor: "Emily Chen",
    instructorId: 106,
    category: "Marketing",
    level: "Beginner",
    rating: 4.4,
    reviews: 180,
    students: 2100,
    price: 44.99,
    discountPrice: 34.99,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
    description: "Learn digital marketing strategies including SEO, social media, content marketing, and analytics to grow your business online.",
    duration: "12 hours",
    lastUpdated: "2023-12-01",
    isBestseller: true,
    isNew: false,
    modules: [
      {
        id: 1,
        title: "Digital Marketing Fundamentals",
        duration: "3 hours",
        lessons: [
          { id: 1, title: "Introduction to Digital Marketing", duration: "25 mins", videoUrl: videoUrls.marketing[0], type: "video" },
          { id: 2, title: "Marketing Strategy", duration: "35 mins", videoUrl: videoUrls.marketing[0], type: "video" },
          { id: 3, title: "Target Audience", duration: "30 mins", videoUrl: videoUrls.marketing[0], type: "video" },
          { id: 4, title: "Brand Positioning", duration: "40 mins", videoUrl: videoUrls.marketing[7], type: "video" },
        ],
      },
      {
        id: 2,
        title: "Social Media Marketing",
        duration: "4 hours",
        lessons: [
          { id: 1, title: "Social Media Strategy", duration: "45 mins", videoUrl: videoUrls.marketing[1], type: "video" },
          { id: 2, title: "Content Creation", duration: "50 mins", videoUrl: videoUrls.marketing[2], type: "video" },
          { id: 3, title: "Community Management", duration: "40 mins", videoUrl: videoUrls.marketing[1], type: "video" },
          { id: 4, title: "Analytics and Reporting", duration: "35 mins", videoUrl: videoUrls.marketing[6], type: "video" },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Business Strategy and Entrepreneurship",
    instructor: "Robert Wilson",
    instructorId: 107,
    category: "Business",
    level: "Intermediate",
    rating: 4.6,
    reviews: 120,
    students: 1600,
    price: 54.99,
    discountPrice: 44.99,
    thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    description: "Develop strategic thinking and entrepreneurial skills to start and grow successful businesses in today's competitive market.",
    duration: "10 hours",
    lastUpdated: "2023-11-15",
    isBestseller: false,
    isNew: true,
    modules: [
      {
        id: 1,
        title: "Business Strategy Fundamentals",
        duration: "3 hours",
        lessons: [
          { id: 1, title: "Strategic Thinking", duration: "30 mins", videoUrl: videoUrls.business[0], type: "video" },
          { id: 2, title: "Market Analysis", duration: "45 mins", videoUrl: videoUrls.business[0], type: "video" },
          { id: 3, title: "Competitive Advantage", duration: "40 mins", videoUrl: videoUrls.business[0], type: "video" },
          { id: 4, title: "Business Models", duration: "35 mins", videoUrl: videoUrls.business[2], type: "video" },
        ],
      },
      {
        id: 2,
        title: "Entrepreneurship",
        duration: "4 hours",
        lessons: [
          { id: 1, title: "Starting a Business", duration: "50 mins", videoUrl: videoUrls.business[2], type: "video" },
          { id: 2, title: "Funding and Finance", duration: "45 mins", videoUrl: videoUrls.business[3], type: "video" },
          { id: 3, title: "Leadership Skills", duration: "40 mins", videoUrl: videoUrls.business[4], type: "video" },
          { id: 4, title: "Scaling Your Business", duration: "35 mins", videoUrl: videoUrls.business[0], type: "video" },
        ],
      },
    ],
  },
];

// Mock quiz data
export const quizzes = [
  {
    id: 1,
    courseId: 1,
    title: "HTML Fundamentals Quiz",
    timeLimit: 15, // in minutes
    questions: [
      {
        id: 1,
        type: "mcq",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Hyper Text Modern Language",
        ],
        correctAnswer: "Hyper Text Markup Language",
      },
      {
        id: 2,
        type: "mcq",
        question: "Which tag is used to create a hyperlink?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        correctAnswer: "<a>",
      },
      {
        id: 3,
        type: "mcq",
        question: "Which HTML element is used to define an unordered list?",
        options: ["<ul>", "<ol>", "<li>", "<list>"],
        correctAnswer: "<ul>",
      },
      {
        id: 4,
        type: "match",
        question: "Match the HTML elements with their purpose:",
        pairs: [
          { item: "<h1>", match: "Main heading" },
          { item: "<p>", match: "Paragraph" },
          { item: "<img>", match: "Image" },
          { item: "<table>", match: "Tabular data" },
        ],
      },
    ],
  },
  {
    id: 2,
    courseId: 1,
    title: "CSS Basics Quiz",
    timeLimit: 20,
    questions: [
      {
        id: 1,
        type: "mcq",
        question: "What does CSS stand for?",
        options: [
          "Cascading Style Sheets",
          "Creative Style Sheets",
          "Computer Style Sheets",
          "Colorful Style Sheets",
        ],
        correctAnswer: "Cascading Style Sheets",
      },
      {
        id: 2,
        type: "mcq",
        question: "Which property is used to change the background color?",
        options: [
          "background-color",
          "bgcolor",
          "color",
          "background-style",
        ],
        correctAnswer: "background-color",
      },
      {
        id: 3,
        type: "match",
        question: "Match the CSS properties with their purpose:",
        pairs: [
          { item: "color", match: "Text color" },
          { item: "font-size", match: "Text size" },
          { item: "margin", match: "Outside spacing" },
          { item: "padding", match: "Inside spacing" },
        ],
      },
    ],
  },
];

// Mock instructors data
export const instructors = [
  {
    id: 101,
    name: "John Doe",
    title: "Web Development Expert",
    bio: "John is a seasoned web developer with over 10 years of experience in building web applications. He specializes in frontend technologies and has worked with major tech companies.",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    courses: [1],
    students: 15000,
    rating: 4.8,
    reviews: 120,
    website: "https://johndoe.dev",
    social: {
      twitter: "@johndoe",
      linkedin: "johndoe",
      github: "johndoe",
    },
  },
  {
    id: 102,
    name: "Jane Smith",
    title: "JavaScript Specialist",
    bio: "Jane is a JavaScript expert with a focus on modern frameworks and libraries. She has authored several books on advanced JavaScript concepts and regularly speaks at tech conferences.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    courses: [2],
    students: 12000,
    rating: 4.6,
    reviews: 85,
    website: "https://janesmith.dev",
    social: {
      twitter: "@janesmith",
      linkedin: "janesmith",
      github: "janesmith",
    },
  },
  {
    id: 103,
    name: "Michael Johnson",
    title: "Data Scientist & Python Developer",
    bio: "Michael is a data scientist with expertise in Python programming. He has worked on numerous data analysis projects and has a passion for teaching complex concepts in a simple way.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    courses: [3],
    students: 18000,
    rating: 4.9,
    reviews: 200,
    website: "https://michaeljohnson.dev",
    social: {
      twitter: "@michaelj",
      linkedin: "michaeljohnson",
      github: "michaelj",
    },
  },
];

// Mock categories
export const categories = [
  { id: 1, name: "Web Development", courses: 45 },
  { id: 2, name: "Mobile Development", courses: 28 },
  { id: 3, name: "Data Science", courses: 32 },
  { id: 4, name: "Machine Learning", courses: 25 },
  { id: 5, name: "DevOps", courses: 18 },
  { id: 6, name: "Business", courses: 35 },
  { id: 7, name: "Design", courses: 30 },
  { id: 8, name: "Marketing", courses: 22 },
];

// Mock user progress data
export const userProgress = {
  userId: "learn@nex.com",
  enrolledCourses: [
    {
      courseId: 1,
      progress: 60, // percentage
      lastAccessed: "2023-11-10",
      completedLessons: [1, 2, 3, 5, 7],
      quizScores: [
        { quizId: 1, score: 80, completed: true },
        { quizId: 2, score: 0, completed: false },
      ],
      notes: [
        {
          id: 1,
          lessonId: 2,
          content: "Remember to practice HTML forms",
          timestamp: "2023-11-08",
        },
        {
          id: 2,
          lessonId: 5,
          content: "Look up more about CSS flexbox examples",
          timestamp: "2023-11-09",
        },
      ],
      certificate: null,
    },
    {
      courseId: 3,
      progress: 25,
      lastAccessed: "2023-11-09",
      completedLessons: [1, 2],
      quizScores: [],
      notes: [],
      certificate: null,
    },
  ],
  wishlist: [2, 5],
  recentlyViewed: [1, 3, 4],
};

// Mock certificates
export const certificates = [
  {
    id: 1,
    userId: "learn@nex.com",
    courseId: 6,
    courseName: "Digital Marketing Masterclass",
    instructorName: "Emily Clark",
    issueDate: "2023-10-15",
    expiryDate: null,
    certificateUrl: "/certificates/cert-1.pdf",
  },
];

// Mock notifications
export const notifications = [
  {
    id: 1,
    userId: "learn@nex.com",
    type: "course_update",
    message: "New content added to 'Introduction to Web Development'",
    courseId: 1,
    read: false,
    date: "2023-11-10",
  },
  {
    id: 2,
    userId: "learn@nex.com",
    type: "quiz_reminder",
    message: "Don't forget to complete the CSS Basics Quiz",
    courseId: 1,
    quizId: 2,
    read: true,
    date: "2023-11-09",
  },
  {
    id: 3,
    userId: "inst@nex.com",
    type: "student_enrollment",
    message: "5 new students enrolled in your course",
    courseId: 2,
    read: false,
    date: "2023-11-08",
  },
];

// Mock payment history
export const payments = [
  {
    id: "pay_123456",
    userId: "learn@nex.com",
    courseId: 1,
    amount: 39.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    date: "2023-10-05",
    receipt: "/receipts/receipt-123456.pdf",
  },
  {
    id: "pay_123457",
    userId: "learn@nex.com",
    courseId: 3,
    amount: 69.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "paypal",
    date: "2023-11-01",
    receipt: "/receipts/receipt-123457.pdf",
  },
];