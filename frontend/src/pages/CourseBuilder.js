import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, hasRole, getUserData } from '../utils/authUtils';
import { courseService } from '../utils/courseService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/solid';

const CourseBuilder = () => {
  const navigate = useNavigate();
  
  // Check if user is an instructor
  useEffect(() => {
    if (!hasRole('instructor')) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  // Course state
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: '',
    discountPrice: '',
    thumbnail: '',
    learningOutcomes: [''],
    requirements: [''],
    targetAudience: [''],
    modules: [{
      title: 'Module 1',
      lessons: [{
        title: 'Introduction',
        type: 'video',
        duration: '00:05:00',
        content: ''
      }]
    }]
  });
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('basic');
  
  // Active module and lesson for editing
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  
  // Handle input change for basic course info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle array input changes (learning outcomes, requirements, target audience)
  const handleArrayInputChange = (arrayName, index, value) => {
    setCourse(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };
  
  // Add new item to array (learning outcomes, requirements, target audience)
  const handleAddArrayItem = (arrayName) => {
    setCourse(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };
  
  // Remove item from array (learning outcomes, requirements, target audience)
  const handleRemoveArrayItem = (arrayName, index) => {
    setCourse(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };
  
  // Handle module title change
  const handleModuleTitleChange = (index, value) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[index] = {
        ...newModules[index],
        title: value
      };
      return {
        ...prev,
        modules: newModules
      };
    });
  };
  
  // Add new module
  const handleAddModule = () => {
    setCourse(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: `Module ${prev.modules.length + 1}`,
          lessons: [{
            title: 'Introduction',
            type: 'video',
            duration: '00:05:00',
            content: ''
          }]
        }
      ]
    }));
    setActiveModuleIndex(course.modules.length);
    setActiveLessonIndex(0);
  };
  
  // Remove module
  const handleRemoveModule = (index) => {
    if (course.modules.length === 1) {
      alert('Course must have at least one module');
      return;
    }
    
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules.splice(index, 1);
      return {
        ...prev,
        modules: newModules
      };
    });
    
    if (activeModuleIndex >= index) {
      setActiveModuleIndex(Math.max(0, activeModuleIndex - 1));
      setActiveLessonIndex(0);
    }
  };
  
  // Handle lesson change
  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lessons: newModules[moduleIndex].lessons.map((lesson, i) => {
          if (i === lessonIndex) {
            return {
              ...lesson,
              [field]: value
            };
          }
          return lesson;
        })
      };
      return {
        ...prev,
        modules: newModules
      };
    });
  };
  
  // Add new lesson
  const handleAddLesson = (moduleIndex) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lessons: [
          ...newModules[moduleIndex].lessons,
          {
            title: `Lesson ${newModules[moduleIndex].lessons.length + 1}`,
            type: 'video',
            duration: '00:05:00',
            content: ''
          }
        ]
      };
      return {
        ...prev,
        modules: newModules
      };
    });
    setActiveLessonIndex(course.modules[moduleIndex].lessons.length);
  };
  
  // Remove lesson
  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    if (course.modules[moduleIndex].lessons.length === 1) {
      alert('Module must have at least one lesson');
      return;
    }
    
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lessons: newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
      };
      return {
        ...prev,
        modules: newModules
      };
    });
    
    if (activeLessonIndex >= lessonIndex) {
      setActiveLessonIndex(Math.max(0, activeLessonIndex - 1));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!course.title || !course.description || !course.category || !course.price) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Get current user data
    const userData = getUserData();
    
    // Prepare course data with instructor information
    const courseData = {
      ...course,
      instructor: userData.email,
      instructorId: userData.id || Date.now(),
      duration: calculateTotalDuration(),
      thumbnail: course.thumbnail || 'https://via.placeholder.com/640x360?text=Course+Thumbnail',
      status: 'draft',
      isPublished: false
    };
    
    try {
      // Save course using the service
      const savedCourse = courseService.addCourse(courseData);
      console.log('Course saved successfully:', savedCourse);
      
      alert('Course saved successfully! You can now publish it to make it visible to students.');
      
      // Redirect to instructor dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };
  
  // Calculate total duration from modules
  const calculateTotalDuration = () => {
    const totalMinutes = course.modules.reduce((total, module) => {
      return total + module.lessons.reduce((moduleTotal, lesson) => {
        const duration = lesson.duration || '00:05:00';
        const [hours, minutes] = duration.split(':').slice(0, 2);
        return moduleTotal + (parseInt(hours) * 60 + parseInt(minutes));
      }, 0);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hours ${minutes} minutes`;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-6 md:ml-64">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Course Builder</h1>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
              Save Course
            </button>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {['basic', 'curriculum', 'requirements', 'pricing'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                  >
                    {tab === 'basic' ? 'Basic Info' : tab}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div>
                  <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={course.title}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="e.g. Complete Web Development Bootcamp"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Course Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={course.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Provide a detailed description of your course"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={course.category}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                      <select
                        id="level"
                        name="level"
                        value={course.level}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail URL</label>
                    <input
                      type="text"
                      id="thumbnail"
                      name="thumbnail"
                      value={course.thumbnail}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                    {course.thumbnail && (
                      <div className="mt-2">
                        <img 
                          src={course.thumbnail} 
                          alt="Course thumbnail preview" 
                          className="h-40 object-cover rounded-md"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/640x360?text=Thumbnail+Preview'}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
                    <p className="text-sm text-gray-500 mb-4">What will students learn in your course?</p>
                    
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => handleArrayInputChange('learningOutcomes', index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`Outcome ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('learningOutcomes', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          disabled={course.learningOutcomes.length === 1}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('learningOutcomes')}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                      Add Learning Outcome
                    </button>
                  </div>
                </div>
              )}
              
              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Course Modules</h2>
                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                        Add Module
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Module List */}
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Modules</h3>
                        <ul className="space-y-2">
                          {course.modules.map((module, moduleIndex) => (
                            <li key={moduleIndex}>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveModuleIndex(moduleIndex);
                                  setActiveLessonIndex(0);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-md ${activeModuleIndex === moduleIndex ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium truncate">{module.title}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveModule(moduleIndex);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{module.lessons.length} lessons</div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Module Editor */}
                      <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-md p-4">
                          <div className="mb-4">
                            <label htmlFor="moduleTitle" className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                            <input
                              type="text"
                              id="moduleTitle"
                              value={course.modules[activeModuleIndex].title}
                              onChange={(e) => handleModuleTitleChange(activeModuleIndex, e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium text-gray-700">Lessons</h4>
                              <button
                                type="button"
                                onClick={() => handleAddLesson(activeModuleIndex)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
                                Add Lesson
                              </button>
                            </div>
                            
                            <ul className="space-y-2 mb-4">
                              {course.modules[activeModuleIndex].lessons.map((lesson, lessonIndex) => (
                                <li key={lessonIndex}>
                                  <button
                                    type="button"
                                    onClick={() => setActiveLessonIndex(lessonIndex)}
                                    className={`w-full text-left px-3 py-2 rounded-md ${activeLessonIndex === lessonIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="truncate">{lesson.title}</span>
                                      <div className="flex items-center">
                                        <span className="text-xs text-gray-500 mr-2">{lesson.type}</span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveLesson(activeModuleIndex, lessonIndex);
                                          }}
                                          className="text-gray-400 hover:text-red-500"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Lesson Editor */}
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Lesson Details</h4>
                            
                            <div className="mb-4">
                              <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                              <input
                                type="text"
                                id="lessonTitle"
                                value={course.modules[activeModuleIndex].lessons[activeLessonIndex].title}
                                onChange={(e) => handleLessonChange(activeModuleIndex, activeLessonIndex, 'title', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label htmlFor="lessonType" className="block text-sm font-medium text-gray-700 mb-1">Lesson Type</label>
                                <select
                                  id="lessonType"
                                  value={course.modules[activeModuleIndex].lessons[activeLessonIndex].type}
                                  onChange={(e) => handleLessonChange(activeModuleIndex, activeLessonIndex, 'type', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                >
                                  <option value="video">Video</option>
                                  <option value="quiz">Quiz</option>
                                  <option value="assignment">Assignment</option>
                                  <option value="text">Text</option>
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor="lessonDuration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                  type="text"
                                  id="lessonDuration"
                                  value={course.modules[activeModuleIndex].lessons[activeLessonIndex].duration}
                                  onChange={(e) => handleLessonChange(activeModuleIndex, activeLessonIndex, 'duration', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                  placeholder="HH:MM:SS"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="lessonContent" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                              <textarea
                                id="lessonContent"
                                value={course.modules[activeModuleIndex].lessons[activeLessonIndex].content}
                                onChange={(e) => handleLessonChange(activeModuleIndex, activeLessonIndex, 'content', e.target.value)}
                                rows={4}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                placeholder={course.modules[activeModuleIndex].lessons[activeLessonIndex].type === 'video' ? 'Video URL' : 'Lesson content'}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Requirements Tab */}
              {activeTab === 'requirements' && (
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <p className="text-sm text-gray-500 mb-4">What are the prerequisites for taking this course?</p>
                    
                    {course.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleArrayInputChange('requirements', index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`Requirement ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('requirements', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          disabled={course.requirements.length === 1}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('requirements')}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                      Add Requirement
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <p className="text-sm text-gray-500 mb-4">Who is this course for?</p>
                    
                    {course.targetAudience.map((audience, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={audience}
                          onChange={(e) => handleArrayInputChange('targetAudience', index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`Target Audience ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('targetAudience', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          disabled={course.targetAudience.length === 1}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('targetAudience')}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                      Add Target Audience
                    </button>
                  </div>
                </div>
              )}
              
              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Regular Price (₹) *</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={course.price}
                          onChange={handleInputChange}
                          className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          id="discountPrice"
                          name="discountPrice"
                          value={course.discountPrice}
                          onChange={handleInputChange}
                          className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Leave empty if no discount</p>
                    </div>
                  </div>
                  
                  {course.price && course.discountPrice && parseFloat(course.discountPrice) < parseFloat(course.price) && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Discount Applied</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>You're offering a {Math.round(((parseFloat(course.price) - parseFloat(course.discountPrice)) / parseFloat(course.price)) * 100)}% discount on this course.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;