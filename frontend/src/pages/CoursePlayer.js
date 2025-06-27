import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../utils/mockData';
import { getUserData, hasRole } from '../utils/authUtils';
import Navbar from '../components/Navbar';
import ReactPlayer from 'react-player/lazy';
import { CheckCircleIcon, LockClosedIcon, PlayIcon, BookmarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  
  // Check if user is logged in and has access to this course
  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      navigate('/login');
      return;
    }
    
    // Find the course
    const foundCourse = courses.find(c => c.id === parseInt(courseId));
    if (!foundCourse) {
      navigate('/courses');
      return;
    }
    
    // Check if user is enrolled or is an admin/instructor
    const isEnrolled = userData.enrolledCourses && userData.enrolledCourses.includes(parseInt(courseId));
    if (!isEnrolled && !hasRole('admin') && !hasRole('instructor')) {
      navigate(`/course/${courseId}`);
      return;
    }
    
    setCourse(foundCourse);
    
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setProgress(parsedProgress);
      
      // Set active module and lesson based on progress
      if (parsedProgress.lastModule !== undefined && parsedProgress.lastLesson !== undefined) {
        setActiveModule(parsedProgress.lastModule);
        setActiveLesson(parsedProgress.lastLesson);
      }
    } else {
      // Initialize progress
      const initialProgress = {
        completedLessons: [],
        lastModule: 0,
        lastLesson: 0,
        overallProgress: 0
      };
      setProgress(initialProgress);
      localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(initialProgress));
    }
    
    setIsLoading(false);
  }, [courseId, navigate]);
  
  // Save progress when active lesson changes
  useEffect(() => {
    if (!course) return;
    
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const lessonKey = `${activeModule}-${activeLesson}`;
    
    // Update progress
    const updatedProgress = {
      ...progress,
      lastModule: activeModule,
      lastLesson: activeLesson,
    };
    
    // Add to completed lessons if not already there
    if (!progress.completedLessons.includes(lessonKey)) {
      updatedProgress.completedLessons = [...progress.completedLessons, lessonKey];
    }
    
    // Calculate overall progress
    updatedProgress.overallProgress = Math.round((updatedProgress.completedLessons.length / totalLessons) * 100);
    
    // Save to state and localStorage
    setProgress(updatedProgress);
    localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(updatedProgress));
  }, [activeModule, activeLesson, course, courseId, progress]);
  
  // Handle lesson completion
  const markLessonComplete = () => {
    const lessonKey = `${activeModule}-${activeLesson}`;
    if (!progress.completedLessons.includes(lessonKey)) {
      const updatedCompletedLessons = [...progress.completedLessons, lessonKey];
      const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
      const overallProgress = Math.round((updatedCompletedLessons.length / totalLessons) * 100);
      
      const updatedProgress = {
        ...progress,
        completedLessons: updatedCompletedLessons,
        overallProgress
      };
      
      setProgress(updatedProgress);
      localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(updatedProgress));
    }
  };
  
  // Navigate to next lesson
  const goToNextLesson = () => {
    if (!course) return;
    
    // Mark current lesson as complete
    markLessonComplete();
    
    // Find next lesson
    const currentModule = course.modules[activeModule];
    if (activeLesson < currentModule.lessons.length - 1) {
      // Next lesson in same module
      setActiveLesson(activeLesson + 1);
    } else if (activeModule < course.modules.length - 1) {
      // First lesson in next module
      setActiveModule(activeModule + 1);
      setActiveLesson(0);
    } else {
      // Course completed
      navigate(`/certificate/${courseId}`);
    }
  };
  
  // Navigate to previous lesson
  const goToPrevLesson = () => {
    if (!course) return;
    
    if (activeLesson > 0) {
      // Previous lesson in same module
      setActiveLesson(activeLesson - 1);
    } else if (activeModule > 0) {
      // Last lesson in previous module
      setActiveModule(activeModule - 1);
      setActiveLesson(course.modules[activeModule - 1].lessons.length - 1);
    }
  };
  
  // Check if a lesson is completed
  const isLessonCompleted = (moduleIndex, lessonIndex) => {
    return progress.completedLessons?.includes(`${moduleIndex}-${lessonIndex}`) || false;
  };
  
  // Handle video progress
  const handleProgress = (state) => {
    setPlayed(state.played);
    if (state.played >= 0.9) { // Mark as complete when 90% watched
      markLessonComplete();
    }
  };
  
  // Handle video end
  const handleEnded = () => {
    setPlaying(false);
    markLessonComplete();
  };
  
  // Save notes
  const saveNotes = () => {
    const lessonKey = `${activeModule}-${activeLesson}`;
    const courseNotes = JSON.parse(localStorage.getItem(`course_notes_${courseId}`) || '{}');
    courseNotes[lessonKey] = notes;
    localStorage.setItem(`course_notes_${courseId}`, JSON.stringify(courseNotes));
  };
  
  // Load notes
  const loadNotes = () => {
    const lessonKey = `${activeModule}-${activeLesson}`;
    const courseNotes = JSON.parse(localStorage.getItem(`course_notes_${courseId}`) || '{}');
    setNotes(courseNotes[lessonKey] || '');
  };
  
  // Load notes when lesson changes
  useEffect(() => {
    loadNotes();
  }, [activeModule, activeLesson, courseId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/courses')} 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }
  
  const currentModule = course.modules[activeModule];
  const currentLesson = currentModule.lessons[activeLesson];
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar darkMode={true} />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block bg-gray-800 w-full lg:w-80 flex-shrink-0 overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Course Content</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{progress.overallProgress || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress.overallProgress || 0}%` }}
                ></div>
              </div>
            </div>
            
            {/* Course Modules */}
            <div className="mt-6 space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="border border-gray-700 rounded-lg">
                  <div className="p-3 bg-gray-700">
                    <h3 className="text-sm font-medium text-white">{module.title}</h3>
                    <p className="text-xs text-gray-400">{module.duration}</p>
                  </div>
                  
                  <div className="p-2">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = isLessonCompleted(moduleIndex, lessonIndex);
                      const isActive = moduleIndex === activeModule && lessonIndex === activeLesson;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setActiveModule(moduleIndex);
                            setActiveLesson(lessonIndex);
                          }}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            isActive 
                              ? 'bg-primary-600 text-white' 
                              : isCompleted 
                                ? 'text-green-400 hover:bg-gray-700' 
                                : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            {isCompleted ? (
                              <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            ) : (
                              <PlayIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <div className="text-xs text-gray-500 ml-6">{lesson.duration}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative bg-black">
            <div className="aspect-video">
              <ReactPlayer
                url={currentLesson.videoUrl}
                width="100%"
                height="100%"
                playing={playing}
                controls={true}
                onProgress={handleProgress}
                onEnded={handleEnded}
                onDuration={setDuration}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                    }
                  }
                }}
              />
            </div>
            
            {/* Mobile sidebar toggle */}
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Lesson Info and Controls */}
          <div className="bg-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-white">{currentLesson.title}</h1>
                <p className="text-gray-400">Module {activeModule + 1} • Lesson {activeLesson + 1}</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  <BookmarkIcon className="h-4 w-4 mr-1" />
                  Notes
                </button>
                <button
                  onClick={() => {/* TODO: Implement discussion */}}
                  className="flex items-center px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  Discussion
                </button>
              </div>
            </div>
            
            {/* Notes Section */}
            {showNotes && (
              <div className="mb-4 p-4 bg-gray-700 rounded">
                <h3 className="text-white font-medium mb-2">Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={saveNotes}
                  placeholder="Take notes about this lesson..."
                  className="w-full h-24 bg-gray-600 text-white p-2 rounded resize-none"
                />
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={goToPrevLesson}
                disabled={activeModule === 0 && activeLesson === 0}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Lesson
              </button>
              
              <button
                onClick={goToNextLesson}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                {activeModule === course.modules.length - 1 && activeLesson === currentModule.lessons.length - 1 
                  ? 'Complete Course' 
                  : 'Next Lesson'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;