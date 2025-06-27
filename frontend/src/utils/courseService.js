// Course service for managing courses
import { courses as mockCourses } from './mockData';

// Get courses from localStorage or use mock data as fallback
const getStoredCourses = () => {
  try {
    const stored = localStorage.getItem('courses');
    return stored ? JSON.parse(stored) : mockCourses;
  } catch (error) {
    console.error('Error loading courses:', error);
    return mockCourses;
  }
};

// Save courses to localStorage
const saveCourses = (courses) => {
  try {
    localStorage.setItem('courses', JSON.stringify(courses));
  } catch (error) {
    console.error('Error saving courses:', error);
  }
};

// Course service functions
export const courseService = {
  // Get all courses
  getAllCourses: () => {
    return getStoredCourses();
  },

  // Get course by ID
  getCourseById: (id) => {
    const courses = getStoredCourses();
    return courses.find(course => course.id === id);
  },

  // Add new course
  addCourse: (courseData) => {
    const courses = getStoredCourses();
    const newCourse = {
      ...courseData,
      id: Date.now(), // Simple ID generation
      instructor: courseData.instructor || 'Current Instructor',
      instructorId: courseData.instructorId || Date.now(),
      rating: 0,
      reviews: 0,
      students: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: 'draft', // draft, published, archived
      isPublished: false
    };
    
    courses.push(newCourse);
    saveCourses(courses);
    return newCourse;
  },

  // Update existing course
  updateCourse: (id, courseData) => {
    const courses = getStoredCourses();
    const index = courses.findIndex(course => course.id === id);
    
    if (index !== -1) {
      courses[index] = {
        ...courses[index],
        ...courseData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      saveCourses(courses);
      return courses[index];
    }
    
    return null;
  },

  // Delete course
  deleteCourse: (id) => {
    const courses = getStoredCourses();
    const filteredCourses = courses.filter(course => course.id !== id);
    saveCourses(filteredCourses);
    return true;
  },

  // Publish course
  publishCourse: (id) => {
    const courses = getStoredCourses();
    const index = courses.findIndex(course => course.id === id);
    
    if (index !== -1) {
      courses[index] = {
        ...courses[index],
        status: 'published',
        isPublished: true,
        publishedAt: new Date().toISOString()
      };
      saveCourses(courses);
      return courses[index];
    }
    
    return null;
  },

  // Get courses by instructor
  getCoursesByInstructor: (instructorId) => {
    const courses = getStoredCourses();
    return courses.filter(course => course.instructorId === instructorId);
  },

  // Get published courses only
  getPublishedCourses: () => {
    const courses = getStoredCourses();
    return courses.filter(course => course.isPublished);
  },

  // Search courses
  searchCourses: (query) => {
    const courses = getStoredCourses();
    const publishedCourses = courses.filter(course => course.isPublished);
    
    return publishedCourses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.instructor.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}; 