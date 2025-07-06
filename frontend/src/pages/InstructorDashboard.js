import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserData, hasRole } from '../utils/authUtils';
import { courseService } from '../utils/courseService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaBook, FaCheckCircle, FaRegEdit, FaUsers, FaPlus, FaCloudUploadAlt, FaLightbulb } from 'react-icons/fa';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const user = getUserData();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  
  useEffect(() => {
    if (!hasRole('instructor')) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      const instructorCourses = courseService.getCoursesByInstructor(userData.id || userData.email);
      setCourses(instructorCourses);
    }
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">
        <Navbar />
          <Sidebar />
        <div className="ml-64 p-8">Loading...</div>
              </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">
        <Navbar />
        <Sidebar />
        <div className="ml-64 p-8 text-red-600">{error}</div>
      </div>
    );
  }

  const safeStats = stats || [];
  const instructorName = user?.name || user?.email?.split('@')[0] || 'Instructor';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 pt-24 md:pt-20">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center md:text-left">
              Welcome back, <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">{instructorName} 👋</span>
            </h1>
          </div>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {safeStats.length > 0 ? safeStats.map((stat, idx) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-md flex items-center gap-4 p-6 border-l-4" style={{ borderImage: idx % 2 === 0 ? 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' : 'linear-gradient(to bottom, #7F00FF, #FF6A00) 1' }}>
                <div>{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm font-semibold">
                    {stat.label.includes('Courses') && <span className="text-orange-500">{stat.label}</span>}
                    {stat.label.includes('Students') && <span className="text-purple-600">{stat.label}</span>}
                    {!stat.label.includes('Courses') && !stat.label.includes('Students') && <span className="text-slate-600">{stat.label}</span>}
                </div>
                </div>
              </div>
            )) : (
              <div className="col-span-4 text-center text-gray-400 italic">No stats available.</div>
            )}
            </div>
          {/* Recent Courses Table */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                <span className="text-orange-500">Recent</span> <span className="text-purple-600">Courses</span>
              </h2>
              <Link to="/instructor/course-builder" className="bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-5 py-2 rounded-lg shadow hover:from-orange-600 hover:to-orange-500 transition-all">
                <FaPlus className="inline mr-2" /> Create New Course
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm">
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Students</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourses.length > 0 ? recentCourses.map(course => (
                    <tr key={course.id} className="border-t border-slate-100">
                      <td className="py-2 px-4 font-semibold text-slate-800">{course.title}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${course.status === 'Published' ? 'bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{course.status}</span>
                      </td>
                      <td className="py-2 px-4 text-slate-700">{course.students}</td>
                      <td className="py-2 px-4 space-x-2">
                        <Link to={`/instructor/course-builder/edit/${course.id}`} className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500 hover:underline">Edit</Link>
                        <Link to={`/course/${course.id}`} className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-600 hover:underline">View</Link>
                        <button className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500 hover:underline">
                          {course.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-400 italic py-4">No recent courses found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Chart & Quick Tip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center min-h-[200px] w-full">
              <h3 className="text-lg font-bold mb-2 text-slate-800">Enrollment Trends</h3>
              {/* Simple SVG Line Chart */}
              <svg width="100%" height="100" viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline
                  fill="none"
                  stroke="#7F00FF"
                  strokeWidth="3"
                  points="0,80 40,60 80,65 120,40 160,20 200,30 240,10 280,30 320,20"
                />
                <polyline
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="3"
                  points="0,90 40,80 80,85 120,70 160,60 200,65 240,50 280,60 320,55"
                />
              </svg>
              <div className="text-xs text-slate-500 mt-2">Purple: This Month &nbsp;|&nbsp; Orange: Last Month</div>
            </div>
            {/* Smart Tip */}
            <div className="bg-gradient-to-br from-orange-50 via-white to-purple-100 border-l-4 border-orange-400 rounded-xl shadow-md p-6 flex flex-col items-start justify-center min-h-[200px] w-full">
              <div className="flex items-center gap-2 mb-2">
                <FaLightbulb className="text-yellow-400 text-xl" />
                <span className="font-semibold text-orange-600">Smart Tip</span>
              </div>
              <div className="text-slate-700">Engage your students by adding quizzes and interactive content to your courses!</div>
            </div>
        </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard; 