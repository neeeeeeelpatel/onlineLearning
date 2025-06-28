// Authentication utility functions

import { demoUsers } from './mockData';

// Check if user credentials are valid
export const validateUser = (email, password) => {
  // Convert email to lowercase for case-insensitive comparison
  const lowerEmail = email.toLowerCase();
  
  // Check if the email exists in any of the demo users
  for (const key in demoUsers) {
    const user = demoUsers[key];
    if (user.email.toLowerCase() === lowerEmail && user.password === password) {
      return { isValid: true, userData: { ...user, id: key } };
    }
  }
  
  return { isValid: false };
};

// Save user data to localStorage (for Firebase users)
export const saveUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

// Get user data from localStorage (for Firebase users)
export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getUserData();
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('user');
};

// Get user role
export const getUserRole = () => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

// Check if user has specific role
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

// Get current user data from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get current user's role
export const getCurrentUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// Check if user is an instructor
export const isInstructor = () => {
  return getCurrentUserRole() === 'instructor';
};

// Check if user is a learner
export const isLearner = () => {
  return getCurrentUserRole() === 'learner';
};

// Logout function
export const logout = () => {
  localStorage.removeItem('user');
  // You can also sign out from Firebase Auth here if needed
  // import { signOut } from 'firebase/auth';
  // await signOut(auth);
};