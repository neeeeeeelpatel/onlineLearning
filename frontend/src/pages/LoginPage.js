import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateUser, saveUserData, isLoggedIn } from '../utils/authUtils';
import { demoUsers } from '../utils/mockData';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('learner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log("Attempting to sign in with email:", email);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Firebase Auth successful, user UID:", user.uid);
      
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      console.log("Firestore document exists:", userDoc.exists());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Retrieved user data from Firestore:", userData);
        
        // Store user data in localStorage
        const localStorageData = {
          uid: user.uid,
          email: user.email,
          role: userData.role,
          createdAt: userData.createdAt
        };
        
        console.log("Storing in localStorage:", localStorageData);
        localStorage.setItem('user', JSON.stringify(localStorageData));
        
        // Redirect based on role
        if (userData.role === 'instructor') {
          console.log("Redirecting to instructor dashboard");
          navigate('/instructor-dashboard');
        } else {
          console.log("Redirecting to learner dashboard");
          navigate('/dashboard');
        }
      } else {
        console.error("User document not found in Firestore");
        setError('User data not found. Please try signing up again.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (userType) => {
    const user = demoUsers[userType];
    setEmail(user.email);
    setPassword(user.password);
    setRole(user.role);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Nextra
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your complete e-learning platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                Sign in
              </button>
            </div>

            {/* Add sign up link */}
            <div className="mt-4 text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <a href="/signup" className="text-primary-600 hover:underline font-medium">Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;