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
        path="/dashboard" 
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
      
      {/* Redirect root to login or dashboard based on auth status */}
      <Route 
        path="/" 
        element={
          isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
      
      {/* Catch all - redirect to dashboard or login */}
      <Route 
        path="*" 
        element={
          isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;