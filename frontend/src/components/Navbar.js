import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUserData, logoutUser, hasRole } from '../utils/authUtils';
import { ShoppingCartIcon, HomeIcon } from '@heroicons/react/24/outline';
import { FaBell, FaUserCircle, FaMoon, FaSun, FaChevronDown, FaLaptopCode, FaChartLine, FaPalette, FaBullhorn, FaUserAstronaut } from 'react-icons/fa';

const categories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Business',
  'Design',
  'Marketing',
];

const learnerCategories = [
  { label: 'Web Development', icon: <FaLaptopCode className="inline mr-2 text-purple-600" /> },
  { label: 'Data Science', icon: <FaChartLine className="inline mr-2 text-orange-500" /> },
  { label: 'UI/UX Design', icon: <FaPalette className="inline mr-2 text-purple-600" /> },
  { label: 'Marketing', icon: <FaBullhorn className="inline mr-2 text-orange-500" /> },
  { label: 'Personal Growth', icon: <FaUserAstronaut className="inline mr-2 text-purple-600" /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const profileRef = useRef(null);
  
  const userData = getUserData();
  const isInstructor = userData?.role === 'instructor';
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/courses?search=${encodeURIComponent(search)}`);
  };

  // Get the appropriate home/dashboard route based on user role
  const getHomeRoute = () => {
    if (hasRole('instructor')) return '/instructor-dashboard';
    if (hasRole('admin')) return '/dashboard';
    return '/dashboard'; // Default for learners
  };

  // Check if we're on a dashboard page
  const isOnDashboard = location.pathname === '/dashboard' || 
                       location.pathname === '/instructor-dashboard' ||
                       location.pathname === '/admin-dashboard';
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isProfileOpen]);
  
  // If no user data, don't render navbar
  if (!userData) return null;
  
  const userInitial = userData.email ? userData.email.charAt(0).toUpperCase() : 'A';
  
  // Toggle dark mode (for demo, just toggles a class on body)
  const handleToggleDark = () => {
    setDarkMode((d) => {
      if (!d) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      return !d;
    });
  };

  if (isInstructor) {
    return (
      <header className="fixed top-0 left-0 w-full z-30 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-16 shadow-sm">
        {/* Left: Branding */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Online Learning Platform</span>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-full hover:bg-gray-100" title="Notifications">
            <FaBell className="text-lg text-gray-600" />
            {/* Notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          {/* Dark/Light Mode Toggle */}
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={handleToggleDark}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun className="text-lg text-yellow-500" /> : <FaMoon className="text-lg text-gray-600" />}
          </button>
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setProfileOpen((o) => !o)}
              title="Account"
            >
              <FaUserCircle className="text-2xl text-primary-600" />
              <span className="hidden sm:inline font-medium text-gray-700">{userData?.email?.split('@')[0] || 'Instructor'}</span>
              <FaChevronDown className="ml-1 text-xs text-gray-500" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700">Account Settings</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700">Profile</button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                >Logout</button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-200 via-white to-purple-200" />
      </header>
    );
  }

  // Learner Navbar (default)
  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white border-b border-gray-200 flex flex-col md:flex-row items-center justify-between px-4 h-auto md:h-16 shadow-sm">
      {/* Branding */}
      <div className="flex items-center gap-2 font-bold text-xl text-primary-700 py-2 md:py-0">
        <span>Online Learning Platform</span>
      </div>
      {/* Center: Categories + Search */}
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center gap-2 md:gap-4 w-full md:w-auto">
        {/* Categories Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-purple-100 text-purple-700 font-semibold rounded-full shadow hover:from-orange-100 hover:to-purple-200 transition"
            onClick={() => setShowCategories((v) => !v)}
            type="button"
          >
            <span>Categories</span>
            <FaChevronDown className="text-xs" />
          </button>
          {showCategories && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
              {learnerCategories.map((cat) => (
                <button
                  key={cat.label}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-100 text-slate-700 font-medium"
                  onClick={() => {
                    setSelectedCategory(cat.label);
                    setShowCategories(false);
                    window.dispatchEvent(new CustomEvent('dashboard-category', { detail: cat.label }));
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Search Bar */}
        <form className="flex-1 flex justify-center w-full max-w-md" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
      </div>
      {/* Right: Notification and Profile */}
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        <button className="relative text-gray-500 hover:text-primary-600 focus:outline-none">
          <FaBell className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;