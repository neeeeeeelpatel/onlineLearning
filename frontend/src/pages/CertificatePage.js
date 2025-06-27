import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../utils/mockData';
import { getUserData } from '../utils/authUtils';
import Navbar from '../components/Navbar';
import { DownloadIcon, PrinterIcon, ShareIcon } from '@heroicons/react/outline';

const CertificatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [certificateDate, setCertificateDate] = useState('');
  const [certificateId, setCertificateId] = useState('');
  
  // Load course and user data
  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    
    // Find the course
    const foundCourse = courses.find(c => c.id === parseInt(courseId));
    if (!foundCourse) {
      navigate('/courses');
      return;
    }
    
    setCourse(foundCourse);
    
    // Check if course is completed
    const userProgress = JSON.parse(localStorage.getItem('user_progress') || '{}');
    const courseProgress = userProgress[courseId];
    
    if (!courseProgress || courseProgress.completionPercentage < 100) {
      // Course not completed, redirect to course page
      navigate(`/course-player/${courseId}`);
      return;
    }
    
    // Generate certificate date (use completion date or current date)
    const completionDate = courseProgress.completionDate 
      ? new Date(courseProgress.completionDate)
      : new Date();
    
    setCertificateDate(formatDate(completionDate));
    
    // Generate certificate ID
    setCertificateId(`NEXTRA-${courseId}-${userData.id}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    
    setIsLoading(false);
  }, [courseId, navigate]);
  
  // Format date as Month DD, YYYY
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Handle certificate download
  const handleDownload = () => {
    // In a real application, this would generate a PDF
    // For this mock, we'll just show an alert
    alert('Certificate download functionality would be implemented here.');
    
    // Save certificate to localStorage
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    
    // Check if certificate already exists
    const existingCertIndex = certificates.findIndex(cert => cert.courseId === parseInt(courseId));
    
    if (existingCertIndex === -1) {
      // Add new certificate
      certificates.push({
        id: certificateId,
        courseId: parseInt(courseId),
        courseName: course.title,
        userName: `${user.firstName} ${user.lastName}`,
        issueDate: new Date().toISOString(),
        instructorName: course.instructor
      });
      
      localStorage.setItem('certificates', JSON.stringify(certificates));
    }
  };
  
  // Handle certificate print
  const handlePrint = () => {
    window.print();
  };
  
  // Handle certificate share
  const handleShare = () => {
    // In a real application, this would open a share dialog
    // For this mock, we'll just show an alert
    alert('Certificate sharing functionality would be implemented here.');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!course || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Certificate not available</h2>
          <p className="mt-2 text-gray-600">The certificate you're looking for doesn't exist or you haven't completed this course yet.</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Certificate Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Course Completion Certificate</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
              Download
            </button>
            
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PrinterIcon className="-ml-1 mr-2 h-5 w-5" />
              Print
            </button>
            
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ShareIcon className="-ml-1 mr-2 h-5 w-5" />
              Share
            </button>
          </div>
        </div>
        
        {/* Certificate */}
        <div 
          ref={certificateRef} 
          className="bg-white border-8 border-double border-gray-300 p-8 shadow-lg max-w-4xl mx-auto print:border-8 print:border-double print:border-gray-300 print:shadow-none print:p-8"
        >
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-primary-600 font-serif">Nextra</h1>
              <p className="text-lg text-gray-600">E-Learning Excellence</p>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate of Completion</h2>
            <p className="text-gray-600 mb-8">This certifies that</p>
            
            <h3 className="text-3xl font-bold text-gray-900 font-serif mb-2">{user.firstName} {user.lastName}</h3>
            
            <p className="text-gray-600 mb-8">has successfully completed the course</p>
            
            <h4 className="text-2xl font-bold text-primary-600 mb-8">{course.title}</h4>
            
            <div className="flex justify-center items-center mb-8">
              <div className="w-1/3 border-t border-gray-300"></div>
              <div className="px-4">
                <p className="text-gray-600">on</p>
                <p className="font-medium">{certificateDate}</p>
              </div>
              <div className="w-1/3 border-t border-gray-300"></div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <div className="h-0.5 w-40 bg-gray-400 mb-2 mx-auto"></div>
                <p className="font-medium">{course.instructor}</p>
                <p className="text-sm text-gray-600">Instructor</p>
              </div>
              
              <div className="text-center">
                <div className="h-20 w-20 mx-auto mb-2">
                  <svg viewBox="0 0 100 100" className="h-full w-full text-primary-600">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M30,50 L45,65 L70,35" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Verified</p>
              </div>
              
              <div className="text-center">
                <div className="h-0.5 w-40 bg-gray-400 mb-2 mx-auto"></div>
                <p className="font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-gray-600">Director of Education</p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">Certificate ID: {certificateId}</p>
              <p className="text-sm text-gray-500 mt-1">Verify this certificate at nextra.com/verify</p>
            </div>
          </div>
        </div>
        
        {/* Certificate Info */}
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Certificate Information</h2>
          </div>
          
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{certificateId}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{certificateDate}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Recipient</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.firstName} {user.lastName}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Course</dt>
                <dd className="mt-1 text-sm text-gray-900">{course.title}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Instructor</dt>
                <dd className="mt-1 text-sm text-gray-900">{course.instructor}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">{course.duration}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;