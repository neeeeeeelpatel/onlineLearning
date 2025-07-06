import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getUserData } from '../utils/authUtils';
import { FaEdit, FaBook, FaChalkboardTeacher, FaUsers, FaChartBar, FaChevronLeft, FaChevronRight, FaCog } from 'react-icons/fa';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'My Courses', path: '/my-courses' },
  { name: 'Quizzes', path: '/quizzes' },
  { name: 'Learning Path', path: '/learning-path' },
  { name: 'Account Settings', path: '/settings' },
];

const Sidebar = ({ onEditProfile }) => {
  const user = getUserData();
  const isInstructor = user?.role === 'instructor';
  const [collapsed, setCollapsed] = useState(false);

  if (isInstructor) {
    // Example: 2 drafts for badge
    const draftCount = 2;
    return (
      <aside className={`h-screen bg-white ${collapsed ? 'w-20' : 'w-64'} px-2 py-6 border-r border-gray-200 hidden md:flex flex-col pt-16 transition-all duration-200`}>
        {/* Collapse/Expand Button */}
        <button
          className="absolute top-4 right-2 bg-gray-100 rounded-full p-1 hover:bg-gray-200"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        {/* User Email */}
        {!collapsed && (
          <div className="mb-8 flex items-center justify-between">
            <div className="text-base font-bold text-primary-700 break-all">{user?.email || 'user@email.com'}</div>
          </div>
        )}
        {/* Navigation Groups */}
        <nav className="flex-1 space-y-4">
          {/* Courses Group */}
          <div>
            {!collapsed && <div className="text-xs font-semibold text-gray-400 px-3 mb-1">Courses</div>}
            <NavLink
              to="/instructor-dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-150 border-l-4 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-50 to-purple-100 border-l-[6px] border-orange-400 text-orange-600 font-bold shadow-sm'
                    : 'border-transparent text-purple-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              title="Dashboard"
              end
            >
              <FaChalkboardTeacher className="text-lg text-purple-600 group-hover:text-orange-500" />
              {!collapsed && 'Instructor Dashboard'}
            </NavLink>
            <NavLink
              to="/instructor/my-courses"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-150 border-l-4 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-50 to-purple-100 border-l-[6px] border-orange-400 text-orange-600 font-bold shadow-sm'
                    : 'border-transparent text-purple-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              title="My Courses"
            >
              <FaBook className="text-lg text-purple-600 group-hover:text-orange-500" />
              {!collapsed && <span>My Courses</span>}
              {!collapsed && draftCount > 0 && (
                <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-semibold">{draftCount} Drafts</span>
              )}
            </NavLink>
            <NavLink
              to="/instructor/course-builder"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-150 border-l-4 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-50 to-purple-100 border-l-[6px] border-orange-400 text-orange-600 font-bold shadow-sm'
                    : 'border-transparent text-purple-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              title="Course Builder"
            >
              <FaChalkboardTeacher className="text-lg text-purple-600 group-hover:text-orange-500" />
              {!collapsed && 'Course Builder'}
            </NavLink>
          </div>
          {/* Management Group */}
          <div>
            {!collapsed && <div className="text-xs font-semibold text-gray-400 px-3 mb-1">Management</div>}
            <NavLink
              to="/instructor/students"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-150 border-l-4 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-50 to-purple-100 border-l-[6px] border-orange-400 text-orange-600 font-bold shadow-sm'
                    : 'border-transparent text-purple-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              title="Students"
            >
              <FaUsers className="text-lg text-purple-600 group-hover:text-orange-500" />
              {!collapsed && 'Students'}
            </NavLink>
            <NavLink
              to="/instructor/analytics"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-150 border-l-4 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-50 to-purple-100 border-l-[6px] border-orange-400 text-orange-600 font-bold shadow-sm'
                    : 'border-transparent text-purple-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              title="Analytics"
            >
              <FaChartBar className="text-lg text-purple-600 group-hover:text-orange-500" />
              {!collapsed && 'Analytics'}
            </NavLink>
          </div>
          {/* Instructor Account Settings */}
          <NavLink
            to="/instructor/account-settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-150 border-l-4 mt-4 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-50 to-purple-100 border-l-[6px] border-orange-400 text-orange-600 font-bold shadow-sm'
                  : 'border-transparent text-purple-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            title="Account Settings"
          >
            <FaCog className="text-lg text-purple-600 group-hover:text-orange-500" />
            {!collapsed && 'Account Settings'}
          </NavLink>
        </nav>
        {/* Logout */}
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className={`mt-8 flex items-center px-3 py-2 rounded-md font-medium text-red-600 hover:bg-red-50 ${collapsed ? 'justify-center' : ''}`}>Logout</button>
      </aside>
    );
  }

  // Learner Sidebar (default)
  return (
    <aside className="h-screen bg-white w-64 px-4 py-6 border-r border-gray-200 hidden md:flex flex-col pt-16">
      {/* User Email + Edit */}
      <div className="mb-8 flex items-center justify-between">
        <div className="text-base font-bold text-primary-700 break-all">{user?.email || 'user@email.com'}</div>
        <button onClick={onEditProfile} className="ml-2 p-1 rounded hover:bg-gray-100" title="Edit Email">
          <FaEdit className="h-4 w-4 text-gray-500" />
        </button>
          </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(item => (
          <NavLink
                key={item.name}
                to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-150 border-l-4 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-50 to-purple-100 border-l-[6px] border-orange-400 text-orange-600 font-bold shadow-sm'
                  : 'border-transparent text-purple-600 hover:text-orange-500 hover:bg-orange-50'
              }`
            }
            end
          >
                {item.name}
          </NavLink>
            ))}
          </nav>
      {/* Logout */}
      <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="mt-8 flex items-center px-3 py-2 rounded-md font-medium text-red-600 hover:bg-red-50">Logout</button>
    </aside>
  );
};

export default Sidebar;