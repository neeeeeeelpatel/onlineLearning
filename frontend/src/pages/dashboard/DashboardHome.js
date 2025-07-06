import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaChartBar, FaBook, FaCalendarAlt, FaClipboardList, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { getUserData } from '../../utils/authUtils';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const statusColors = {
  'In Progress': 'bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700',
  'Completed': 'bg-gradient-to-r from-purple-100 to-orange-100 text-purple-700',
};

const DashboardHome = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('');
  const user = getUserData() || { name: '', avatar: '', email: '', role: '' };
  const progress = 0;
  const enrolledCourses = 0;
  const completedQuizzes = 0;
  const certificates = 0;
  const upcomingLessons = [];
  const recentQuizzes = [];

  useEffect(() => {
    const handler = (e) => setSelectedCategory(e.detail);
    window.addEventListener('dashboard-category', handler);
    return () => window.removeEventListener('dashboard-category', handler);
  }, []);

  // Calendar tile content for events (empty)
  const tileContent = ({ date, view }) => null;
  // Calendar tile class for today
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.toDateString() === new Date().toDateString()) {
      return 'bg-gradient-to-r from-orange-100 to-purple-100 rounded-full font-bold';
    }
    return '';
  };
  // Calendar tooltip for events (none)
  const getTileTooltip = (date) => null;

  // All data arrays are empty
  const filteredAllCourses = [];
  const filteredInProgressCourses = [];

  return (
    <div className="bg-transparent min-h-[calc(100vh-64px)] w-full p-2 sm:p-4 md:p-8 flex flex-col">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-y-auto">
        {/* Main content (3/4) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Welcome and Progress */}
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-stretch">
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col justify-center min-w-0 border-l-4 hover:scale-[1.02] transition" style={{ borderImage: 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' }}>
              <div className="text-2xl font-extrabold mb-2 text-slate-800">
                Welcome back, <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">{user.name || 'Learner'} 👋</span>
              </div>
              <div className="text-gray-500 mb-2">Let's keep learning and growing.</div>
              <div className="bg-gradient-to-r from-orange-50 to-purple-100 rounded-lg p-4 flex items-center gap-4">
                <FaChartBar className="text-3xl text-purple-600" />
                <div>
                  <div className="font-semibold text-orange-500">Your average progress</div>
                  <div className="text-2xl font-bold text-purple-600">{progress}%</div>
                  <div className="text-xs text-gray-500">Complete more lessons to improve your progress!</div>
                </div>
              </div>
            </div>
            {/* Profile Card */}
            <div className="w-full md:w-64 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center border-l-4 hover:scale-[1.02] transition" style={{ borderImage: 'linear-gradient(to bottom, #7F00FF, #FF6A00) 1' }}>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover mb-2" />
              ) : (
                <FaUserCircle className="w-20 h-20 text-gray-300 mb-2" />
              )}
              <div className="font-semibold text-lg text-slate-800">{user.name || 'User'}</div>
              <div className="text-xs text-gray-500 mb-2">{user.email || 'user@example.com'}</div>
              <button
                className="mt-2 px-4 py-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded font-bold text-sm shadow hover:from-orange-600 hover:to-purple-700 transition-all"
                onClick={() => setShowProfile(true)}
              >
                View Profile
              </button>
            </div>
          </div>

          {/* All Courses Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:scale-[1.02] transition mb-4" style={{ borderImage: 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-800"><span className="text-purple-600">All</span> <span className="text-orange-500">Courses</span></h3>
              <button
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded font-bold shadow hover:from-orange-600 hover:to-purple-700 transition"
                onClick={() => window.location.href = '/dashboard/my-courses'}
              >
                View All
              </button>
            </div>
            <ul className="space-y-2">
              <li className="text-gray-400 italic">No courses found for this category.</li>
            </ul>
          </div>

          {/* Grid of Cards/Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Enrolled Courses Widget */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 border-l-4 hover:scale-[1.02] transition" style={{ borderImage: 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' }}>
              <div className="flex items-center gap-2 mb-2">
                <FaBook className="text-orange-500" />
                <span className="font-semibold text-purple-600">Courses In Progress</span>
              </div>
              <div className="text-xs text-gray-400 italic">No in-progress courses for this category.</div>
            </div>
            {/* Completed Quizzes Widget */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 border-l-4 hover:scale-[1.02] transition" style={{ borderImage: 'linear-gradient(to bottom, #7F00FF, #FF6A00) 1' }}>
              <div className="flex items-center gap-2 mb-2">
                <FaClipboardList className="text-purple-600" />
                <span className="font-semibold text-orange-500">Completed Quizzes</span>
              </div>
              <div className="text-3xl font-bold text-orange-500">{completedQuizzes}</div>
              <div className="text-xs text-gray-500">Great job on your quizzes!</div>
            </div>
            {/* Certificates Widget */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 border-l-4 hover:scale-[1.02] transition" style={{ borderImage: 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' }}>
              <div className="flex items-center gap-2 mb-2">
                <FaChartBar className="text-orange-500" />
                <span className="font-semibold text-purple-600">Certificates Earned</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">{certificates}</div>
              <div className="text-xs text-gray-500">Show off your achievements!</div>
            </div>
            {/* Recent Quizzes Widget */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 col-span-1 md:col-span-2 xl:col-span-1 border-l-4 hover:scale-[1.02] transition" style={{ borderImage: 'linear-gradient(to bottom, #7F00FF, #FF6A00) 1' }}>
              <div className="font-semibold mb-2 text-orange-500">Recent Quizzes</div>
              <div className="text-gray-500 text-sm">No recent quizzes</div>
            </div>
            {/* Upcoming Lessons Widget */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 col-span-1 md:col-span-2 xl:col-span-1 border-l-4 hover:scale-[1.02] transition" style={{ borderImage: 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' }}>
              <div className="font-semibold mb-2 text-purple-600">Upcoming Lessons</div>
              <div className="text-gray-500 text-sm">No upcoming lessons</div>
            </div>
            {/* Calendar Widget (Empty) */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 border-l-4 hover:scale-[1.02] transition" style={{ borderImage: 'linear-gradient(to bottom, #7F00FF, #FF6A00) 1' }}>
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-purple-600" />
                <span className="font-semibold text-orange-500">Calendar</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">Your upcoming schedule</div>
              <Calendar
                value={calendarDate}
                onChange={setCalendarDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="rounded-xl border-0 w-full max-w-xs mx-auto text-sm"
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={false}
                formatShortWeekday={(locale, date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
                tileDisabled={() => false}
                onClickDay={() => {}}
              />
              <div className="text-xs text-gray-400 mt-2">No events scheduled.</div>
            </div>
          </div>
        </div>
        {/* Right sidebar (empty for now, can add more widgets) */}
        {/* <div className="lg:col-span-1"></div> */}
      </div>
    </div>
  );
};

export default DashboardHome; 