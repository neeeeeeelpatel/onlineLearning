import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import LoginForm from './LoginPage';
import SignUpForm from './SignUpPage';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  const handleGetStarted = () => {
    setAuthTab('login');
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const handleSwitchToSignUp = () => setAuthTab('signup');
  const handleSwitchToLogin = () => setAuthTab('login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-purple-100 relative">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-blue-900">Online Learning Platform</span>
        </div>
        <div className="flex space-x-8 text-lg font-medium">
          <button className="text-purple-700 hover:underline" onClick={() => handleGetStarted()}>Courses</button>
          <button className="text-purple-700 hover:underline" onClick={() => window.scrollTo(0, 0)}>Home</button>
          <button className="text-purple-700 hover:underline">About</button>
          <button className="text-purple-700 hover:underline">Contact Us</button>
        </div>
      </div>
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 mt-32">
        <h1 className="text-6xl font-extrabold text-center mb-4">
          <span className="text-orange-500">Learn Anytime,</span>
          <span className="text-purple-600 ml-2">Grow Every Day</span>
        </h1>
        <p className="text-xl text-gray-700 text-center mb-10 max-w-2xl">
          Unlock your potential with flexible, self-paced learning designed for real-world success.
        </p>
        <div className="flex space-x-6">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-all duration-200"
            onClick={handleGetStarted}
          >
            GET STARTED
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-all duration-200"
            onClick={handleGetStarted}
          >
            VIEW COURSES
          </button>
        </div>
      </div>
      {/* Auth Modal Placeholder */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <div className="flex justify-center mb-6">
              <button
                className={`px-4 py-2 font-semibold rounded-l ${authTab === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setAuthTab('login')}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 font-semibold rounded-r ${authTab === 'signup' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setAuthTab('signup')}
              >
                Sign Up
              </button>
            </div>
            {authTab === 'login' ? (
              <LoginForm onSuccess={handleCloseModal} onSwitchToSignUp={handleSwitchToSignUp} />
            ) : (
              <SignUpForm onSuccess={handleCloseModal} onSwitchToLogin={handleSwitchToLogin} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 