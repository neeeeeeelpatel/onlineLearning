import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUserData, logoutUser, hasRole } from '../utils/authUtils';
import { ShoppingCartIcon, HomeIcon } from '@heroicons/react/24/outline';

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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const userData = getUserData();
  
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
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
  
  // If no user data, don't render navbar
  if (!userData) return null;
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Home & Categories */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-600 mr-2">
              Nextra
            </Link>
            
            {/* Home Button - Show when not on dashboard */}
            {!isOnDashboard && (
              <Link
                to={getHomeRoute()}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <HomeIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            )}
            
            {/* Categories Button - Direct navigation */}
            <Link
              to="/courses"
              className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            >
              Categories
            </Link>
          </div>
          
          {/* Center: Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex justify-center mx-4 max-w-lg">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for anything..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Right: Links, Cart, Profile */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Teach on Nextra */}
            {(hasRole('instructor') || hasRole('admin')) && (
              <Link
                to="/course-builder"
                className="text-gray-700 hover:text-primary-600 font-medium hidden lg:inline"
              >
                Teach on Nextra
              </Link>
            )}
            {/* Cart Icon */}
            <Link to="/cart" className="relative hover:text-primary-600">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-primary-300"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  {userData.email.charAt(0).toUpperCase()}
                </div>
              </button>
              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{userData.email}</p>
                    <p className="capitalize">{userData.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Hamburger for mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {/* Mobile Home Button */}
              {!isOnDashboard && (
                <Link
                  to={getHomeRoute()}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Home
                </Link>
              )}
              
              {/* Mobile Categories Button */}
              <Link
                to="/courses"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              
              {/* Mobile Teach on Nextra */}
              {(hasRole('instructor') || hasRole('admin')) && (
                <Link
                  to="/course-builder"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Teach on Nextra
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;