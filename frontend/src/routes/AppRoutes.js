import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../utils/authUtils';

// Pages
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import InstructorDashboard from '../pages/InstructorDashboard';
import CourseCatalog from '../pages/CourseCatalog';
import CourseDetailPage from '../pages/CourseDetailPage';
import CourseBuilder from '../pages/CourseBuilder';
import CoursePlayer from '../pages/CoursePlayer';
import QuizInterface from '../pages/QuizInterface';
import PaymentPage from '../pages/PaymentPage';
import CertificatePage from '../pages/CertificatePage';
import SignUpPage from '../pages/SignUpPage';
import LandingPage from '../pages/LandingPage';
import InstructorMyCourses from '../pages/instructor/InstructorMyCourses';
import InstructorCourseBuilder from '../pages/instructor/InstructorCourseBuilder';
import InstructorStudents from '../pages/instructor/InstructorStudents';
import InstructorAnalytics from '../pages/instructor/InstructorAnalytics';
import InstructorAccountSettings from '../pages/InstructorAccountSettings';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = isLoggedIn();
  const userRole = getUserRole();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user's role is not included, redirect to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated and authorized, render the children
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes for all authenticated users */}
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Instructor Dashboard */}
      <Route 
        path="/instructor-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/instructor/my-courses" 
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorMyCourses />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/instructor/course-builder" 
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorCourseBuilder />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/instructor/students" 
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorStudents />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/instructor/analytics" 
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorAnalytics />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/instructor/account-settings" 
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorAccountSettings />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/courses" 
        element={
          <ProtectedRoute>
            <CourseCatalog />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/courses/:courseId" 
        element={
          <ProtectedRoute>
            <CourseDetailPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/learn/:courseId" 
        element={
          <ProtectedRoute>
            <CoursePlayer />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/quiz/:quizId" 
        element={
          <ProtectedRoute>
            <QuizInterface />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/payment/:courseId" 
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/certificate/:certificateId" 
        element={
          <ProtectedRoute>
            <CertificatePage />
          </ProtectedRoute>
        } 
      />
      
      {/* Instructor Only Routes */}
      <Route 
        path="/course-builder" 
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseBuilder />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/course-builder/:courseId" 
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseBuilder />
          </ProtectedRoute>
        } 
      />
      
      {/* Landing Page Route (Public) */}
      <Route 
        path="/" 
        element={<LandingPage />} 
      />
      
      {/* Catch all - redirect to dashboard or login */}
      <Route 
        path="*" 
        element={
          isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
      
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};

export default AppRoutes;