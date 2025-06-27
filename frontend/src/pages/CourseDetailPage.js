import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses, instructors } from '../utils/mockData';
import { getUserData } from '../utils/authUtils';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { StarIcon, CheckCircleIcon, AcademicCapIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/solid';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Find the course by ID
    const foundCourse = courses.find(c => c.id === parseInt(courseId));
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Find the instructor
      const foundInstructor = instructors.find(i => i.name === foundCourse.instructor);
      if (foundInstructor) {
        setInstructor(foundInstructor);
      }
      
      // Check if user is enrolled
      const userData = getUserData();
      if (userData && userData.enrolledCourses) {
        setIsEnrolled(userData.enrolledCourses.includes(parseInt(courseId)));
      }
    }
  }, [courseId]);
  
  const handleEnroll = () => {
    if (!getUserData()) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    // Redirect to payment page
    navigate(`/payment/${courseId}`);
  };
  
  const handleContinueLearning = () => {
    navigate(`/course-player/${courseId}`);
  };
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/courses')} 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-6 md:ml-64">
          {/* Course Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="relative">
              <img 
                src={course.thumbnail || 'https://via.placeholder.com/1200x400'} 
                alt={course.title} 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <div className="flex items-center mb-2">
                    <span className="bg-primary-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">{course.category}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-200">{course.level}</span>
                  </div>
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{course.rating.toFixed(1)} ({course.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-sm text-gray-700">{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-sm text-gray-700">{course.duration}</span>
                  </div>
                </div>
                
                <div className="w-full md:w-auto">
                  {isEnrolled ? (
                    <button
                      onClick={handleContinueLearning}
                      className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <div className="text-center md:text-right">
                      <div className="mb-2">
                        {course.discountPrice ? (
                          <>
                            <span className="text-3xl font-bold text-gray-900">₹{course.discountPrice}</span>
                            <span className="ml-2 text-lg text-gray-500 line-through">₹{course.price}</span>
                            <span className="ml-2 text-sm font-semibold text-green-600">
                              {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% off
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-gray-900">₹{course.price}</span>
                        )}
                      </div>
                      <button
                        onClick={handleEnroll}
                        className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                      >
                        Enroll Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex">
                    {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${activeTab === tab
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-4">About This Course</h2>
                      <p className="text-gray-700 mb-6">{course.description}</p>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-3">What You'll Learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                        {course.learningOutcomes?.map((outcome, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span className="text-gray-700">{outcome}</span>
                          </div>
                        )) || (
                          <p className="text-gray-500 italic">Learning outcomes not specified</p>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Requirements</h3>
                      <ul className="list-disc pl-5 mb-6 text-gray-700">
                        {course.requirements?.map((req, index) => (
                          <li key={index} className="mb-1">{req}</li>
                        )) || (
                          <li className="text-gray-500 italic">No specific requirements</li>
                        )}
                      </ul>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Target Audience</h3>
                      <ul className="list-disc pl-5 text-gray-700">
                        {course.targetAudience?.map((audience, index) => (
                          <li key={index} className="mb-1">{audience}</li>
                        )) || (
                          <li className="text-gray-500 italic">Target audience not specified</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* Curriculum Tab */}
                  {activeTab === 'curriculum' && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Content</h2>
                      <div className="mb-4">
                        <p className="text-gray-700">
                          <span className="font-medium">{course.modules?.length || 0}</span> modules • 
                          <span className="font-medium">{course.totalLessons || 0}</span> lessons • 
                          <span className="font-medium">{course.duration}</span> total length
                        </p>
                      </div>
                      
                      {course.modules?.map((module, index) => (
                        <div key={index} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <h3 className="font-medium text-gray-900">{module.title}</h3>
                            <span className="text-sm text-gray-500">{module.lessons.length} lessons</span>
                          </div>
                          <ul className="divide-y divide-gray-200">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {lesson.type === 'video' ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                      </svg>
                                    ) : lesson.type === 'quiz' ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                    <span className="text-gray-700">{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )) || (
                        <p className="text-gray-500 italic">Curriculum details not available</p>
                      )}
                    </div>
                  )}
                  
                  {/* Instructor Tab */}
                  {activeTab === 'instructor' && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-4">About the Instructor</h2>
                      
                      {instructor ? (
                        <div className="flex flex-col md:flex-row items-start md:space-x-6">
                          <div className="flex-shrink-0 mb-4 md:mb-0">
                            <img 
                              src={instructor.avatar || 'https://via.placeholder.com/150'} 
                              alt={instructor.name} 
                              className="w-24 h-24 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{instructor.name}</h3>
                            <p className="text-gray-500 mb-2">{instructor.title}</p>
                            
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex items-center">
                                <StarIcon className="h-5 w-5 text-yellow-400" />
                                <span className="ml-1 text-sm font-medium text-gray-700">{instructor.rating.toFixed(1)} Instructor Rating</span>
                              </div>
                              <div className="flex items-center">
                                <AcademicCapIcon className="h-5 w-5 text-gray-500" />
                                <span className="ml-1 text-sm text-gray-700">{instructor.courses} Courses</span>
                              </div>
                              <div className="flex items-center">
                                <UsersIcon className="h-5 w-5 text-gray-500" />
                                <span className="ml-1 text-sm text-gray-700">{instructor.students.toLocaleString()} Students</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-700">{instructor.bio}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Instructor information not available</p>
                      )}
                    </div>
                  )}
                  
                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Student Reviews</h2>
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                        <div className="flex flex-col items-center mr-6 mb-4 md:mb-0">
                          <div className="text-5xl font-bold text-gray-900">{course.rating.toFixed(1)}</div>
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i} 
                                className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{course.reviews} reviews</div>
                        </div>
                        
                        <div className="flex-1 w-full">
                          {[5, 4, 3, 2, 1].map(star => {
                            // Calculate percentage (mock data)
                            const percentage = star === 5 ? 65 : 
                                              star === 4 ? 20 : 
                                              star === 3 ? 10 : 
                                              star === 2 ? 4 : 1;
                            
                            return (
                              <div key={star} className="flex items-center mb-1">
                                <div className="flex items-center w-24">
                                  <span className="text-sm font-medium text-gray-700 mr-2">{star}</span>
                                  <StarIcon className="h-4 w-4 text-yellow-400" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-2 bg-yellow-400 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 ml-2">{percentage}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Sample Reviews */}
                      <div className="border-t border-gray-200 pt-6">
                        {/* This would typically come from an API, using mock data for now */}
                        {[1, 2, 3].map(i => (
                          <div key={i} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                            <div className="flex items-center mb-2">
                              <img 
                                src={`https://i.pravatar.cc/150?img=${i + 10}`} 
                                alt="Reviewer" 
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900">Student {i}</h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, j) => (
                                    <StarIcon 
                                      key={j} 
                                      className={`h-4 w-4 ${j < (6 - i) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-500">2 weeks ago</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700">
                              {i === 1 ? 
                                "This course exceeded my expectations! The instructor explains complex concepts in a way that's easy to understand, and the practical exercises really helped solidify my knowledge." :
                                i === 2 ?
                                "Great course overall, though some sections could be more in-depth. The instructor is knowledgeable and responsive to questions." :
                                "Solid introduction to the subject. I appreciate the real-world examples and projects. Would recommend to beginners in this field."}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Course Stats */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Course Includes</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      <span className="text-gray-700">{course.totalVideos || 'N/A'} videos</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{course.totalQuizzes || 'N/A'} quizzes</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{course.totalResources || 'N/A'} downloadable resources</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Full lifetime access</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Share */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Share This Course</h3>
                  <div className="flex space-x-4">
                    <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;