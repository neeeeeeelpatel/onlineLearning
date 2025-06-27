import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserData, hasRole } from '../utils/authUtils';
import { courseService } from '../utils/courseService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check if user is an instructor
  useEffect(() => {
    if (!hasRole('instructor')) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  // Load instructor's courses
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      const instructorCourses = courseService.getCoursesByInstructor(userData.id || userData.email);
      setCourses(instructorCourses);
    }
    setLoading(false);
  }, []);
  
  // Handle course deletion
  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      courseService.deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };
  
  // Handle course publishing
  const handlePublishCourse = (courseId) => {
    const updatedCourse = courseService.publishCourse(courseId);
    if (updatedCourse) {
      setCourses(courses.map(course => 
        course.id === courseId ? updatedCourse : course
      ));
    }
  };
  
  // Handle course unpublishing
  const handleUnpublishCourse = (courseId) => {
    const updatedCourse = courseService.updateCourse(courseId, {
      status: 'draft',
      isPublished: false
    });
    if (updatedCourse) {
      setCourses(courses.map(course => 
        course.id === courseId ? updatedCourse : course
      ));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6 md:ml-64">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
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
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
              <p className="text-gray-600 mt-2">Manage your courses and track their performance</p>
            </div>
            <Link
              to="/course-builder"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create New Course
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Courses</p>
                  <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Published</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {courses.filter(course => course.isPublished).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Drafts</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {courses.filter(course => !course.isPublished).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {courses.reduce((total, course) => total + (course.students || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Courses List */}
          {courses.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Courses</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {courses.map(course => (
                  <div key={course.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-16 w-24 object-cover rounded-lg"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/96x64?text=Course'}
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-500">{course.category} • {course.level}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              {course.students || 0} students • {course.rating || 0} rating
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/course/${course.id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Link>
                        
                        <Link
                          to={`/course-builder/edit/${course.id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        
                        {course.isPublished ? (
                          <button
                            onClick={() => handleUnpublishCourse(course.id)}
                            className="inline-flex items-center px-3 py-1 border border-yellow-300 shadow-sm text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublishCourse(course.id)}
                            className="inline-flex items-center px-3 py-1 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                          >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Publish
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first course.</p>
              <div className="mt-6">
                <Link
                  to="/course-builder"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Create Course
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard; 