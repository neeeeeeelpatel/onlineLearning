import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole, hasRole } from '../utils/authUtils';
import { courses, userProgress, notifications, demoUsers } from '../utils/mockData';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CourseCard from '../components/CourseCard';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [recentCourses, setRecentCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect instructors to their specific dashboard
    if (hasRole('instructor')) {
      navigate('/instructor-dashboard');
      return;
    }
    
    // Get user role
    const role = getUserRole();
    setUserRole(role);
    
    // Get recent courses
    const recentIds = userProgress.recentlyViewed || [];
    const recent = courses.filter(course => recentIds.includes(course.id)).slice(0, 3);
    setRecentCourses(recent);
    
    // Get enrolled courses
    const enrolledIds = userProgress.enrolledCourses?.map(course => course.courseId) || [];
    const enrolled = courses.filter(course => enrolledIds.includes(course.id));
    setEnrolledCourses(enrolled);
    
    // Get popular courses (sorted by students count)
    const popular = [...courses].sort((a, b) => b.students - a.students).slice(0, 3);
    setPopularCourses(popular);
    
    // Get user notifications
    const userNotifs = notifications.filter(notif => notif.userId === 'learn@nex.com').slice(0, 5);
    setUserNotifications(userNotifs);
  }, [navigate]);
  
  // Render dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return renderAdminDashboard();
      case 'instructor':
        return renderInstructorDashboard();
      case 'learner':
      default:
        return renderLearnerDashboard();
    }
  };
  
  // Learner Dashboard
  const renderLearnerDashboard = () => {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, Learner!</h2>
            <p className="text-gray-600 mt-2">Continue your learning journey</p>
            
            {/* Progress Overview */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary-700">Enrolled Courses</h3>
                <p className="text-3xl font-bold text-primary-800 mt-2">{enrolledCourses.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700">Completed Courses</h3>
                <p className="text-3xl font-bold text-green-800 mt-2">1</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-700">Certificates Earned</h3>
                <p className="text-3xl font-bold text-yellow-800 mt-2">1</p>
              </div>
            </div>
          </div>
          
          {/* Continue Learning Section */}
          {enrolledCourses.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Continue Learning</h2>
                <Link to="/my-courses" className="text-primary-600 hover:text-primary-800 text-sm font-medium">View All</Link>
              </div>
              
              <div className="space-y-4">
                {enrolledCourses.map(course => {
                  const courseProgress = userProgress.enrolledCourses.find(c => c.courseId === course.id);
                  const progressPercentage = courseProgress ? courseProgress.progress : 0;
                  
                  return (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <img src={course.thumbnail} alt={course.title} className="w-16 h-16 object-cover rounded" />
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-800">{course.title}</h3>
                          <p className="text-sm text-gray-500">{course.instructor}</p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary-600 h-2.5 rounded-full" 
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">{progressPercentage}% complete</span>
                            <Link to={`/learn/${course.id}`} className="text-xs font-medium text-primary-600 hover:text-primary-800">Continue</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Recommended Courses */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recommended For You</h2>
              <Link to="/courses" className="text-primary-600 hover:text-primary-800 text-sm font-medium">Browse All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
          
          {/* Recent Activity & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              
              {recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map(course => (
                    <div key={course.id} className="flex items-center p-3 border-b border-gray-100">
                      <div className="bg-primary-100 p-2 rounded">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">You viewed <Link to={`/courses/${course.id}`} className="text-primary-600 hover:underline">{course.title}</Link></p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
              
              {userNotifications.length > 0 ? (
                <div className="space-y-4">
                  {userNotifications.map(notification => (
                    <div key={notification.id} className={`p-3 border-l-4 ${notification.read ? 'border-gray-300 bg-gray-50' : 'border-primary-500 bg-primary-50'} rounded-r-md`}>
                      <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Instructor Dashboard
  const renderInstructorDashboard = () => {
    // Mock data for instructor dashboard
    const instructorCourses = courses.filter(course => course.instructorId === 102);
    const totalStudents = instructorCourses.reduce((sum, course) => sum + course.students, 0);
    const totalRevenue = instructorCourses.reduce((sum, course) => sum + (course.price * course.students * 0.7), 0); // 70% revenue share
    
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, Instructor!</h2>
            <p className="text-gray-600 mt-2">Manage your courses and students</p>
            
            {/* Stats Overview */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700">Total Courses</h3>
                <p className="text-3xl font-bold text-blue-800 mt-2">{instructorCourses.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700">Total Students</h3>
                <p className="text-3xl font-bold text-green-800 mt-2">{totalStudents}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700">Total Revenue</h3>
                <p className="text-3xl font-bold text-purple-800 mt-2">${totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </div>
          
          {/* Course Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Courses</h2>
              <Link to="/course-builder" className="text-primary-600 hover:text-primary-800 text-sm font-medium">Create New Course</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Admin Dashboard
  const renderAdminDashboard = () => {
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.students), 0);
    
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, Admin!</h2>
            <p className="text-gray-600 mt-2">Manage the platform and monitor performance</p>
            
            {/* Stats Overview */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700">Total Courses</h3>
                <p className="text-3xl font-bold text-red-800 mt-2">{totalCourses}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700">Total Students</h3>
                <p className="text-3xl font-bold text-green-800 mt-2">{totalStudents}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-700">Total Revenue</h3>
                <p className="text-3xl font-bold text-yellow-800 mt-2">${totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </div>
          
          {/* Platform Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/courses" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800">Manage Courses</h3>
                <p className="text-sm text-gray-600 mt-1">Review and approve courses</p>
              </Link>
              <Link to="/users" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800">Manage Users</h3>
                <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
              </Link>
              <Link to="/analytics" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800">Analytics</h3>
                <p className="text-sm text-gray-600 mt-1">View platform statistics</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="main-content">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;