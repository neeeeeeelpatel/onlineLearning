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

// Save user data to localStorage
export const saveUserData = (userData) => {
  localStorage.setItem('nextraUser', JSON.stringify(userData));
};

// Get user data from localStorage
export const getUserData = () => {
  const userData = localStorage.getItem('nextraUser');
  return userData ? JSON.parse(userData) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getUserData();
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('nextraUser');
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